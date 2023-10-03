const { AuthenticationError } = require("apollo-server-express");
const { User, Product, Category, Order } = require("../models");
const { signToken } = require("../utils/auth");
const stripe = require("stripe")(
  process.env.STRIPE_SECRET_KEY || "your_secret_key_here"
);
const resolvers = {
  Query: {
    categories: async () => {
      return await Category.find();
    },
    products: async (_, { category, name }) => {
      const params = {};
      if (category) {
        params.category = category;
      }
      if (name) {
        params.name = {
          $regex: name,
        };
      }
      return await Product.find(params).populate("category");
    },
    product: async (_, { _id }) => {
      return await Product.findById(_id).populate("category");
    },
    user: async (_, __, { user }) => {
      if (user) {
        const fetchedUser = await User.findById(user._id).populate({
          path: "orders.products",
          populate: "category",
        });
        fetchedUser.orders.sort((a, b) => b.purchaseDate - a.purchaseDate);
        return fetchedUser;
      }
      throw new AuthenticationError("Not logged in");
    },
    order: async (_, { _id }, { user }) => {
      if (user) {
        const fetchedUser = await User.findById(user._id).populate({
          path: "orders.products",
          populate: "category",
        });
        return fetchedUser.orders.id(_id);
      }
      throw new AuthenticationError("Not logged in");
    },
    checkout: async (_, { products }, { headers }) => {
      const url = new URL(headers.referer).origin;
      const order = new Order({ products });
      const line_items = [];
      const { products: orderedProducts } = await order.populate("products");
      for (const product of orderedProducts) {
        const stripeProduct = await stripe.products.create({
          name: product.name,
          description: product.description,
          images: [`${url}/images/${product.image}`],
        });
        const price = await stripe.prices.create({
          product: stripeProduct.id,
          unit_amount: product.price * 100,
          currency: "usd",
        });
        line_items.push({
          price: price.id,
          quantity: 1,
        });
      }
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items,
        mode: "payment",
        success_url: `${url}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${url}/`,
      });
      return { session: session.id };
    },
  },
  Mutation: {
    addUser: async (_, args) => {
      const user = await User.create(args);
      const token = signToken(user);
      return { token, user };
    },
    addOrder: async (_, { products }, { user }) => {
      console.log(user);
      if (user) {
        const order = new Order({ products });
        await User.findByIdAndUpdate(user._id, { $push: { orders: order } });
        return order;
      }
      throw new AuthenticationError("Not logged in");
    },
    updateUser: async (_, args, { user }) => {
      if (user) {
        return await User.findByIdAndUpdate(user._id, args, { new: true });
      }
      throw new AuthenticationError("Not logged in");
    },
    updateProduct: async (_, { _id, quantity }) => {
      const decrement = Math.abs(quantity) * -1;
      return await Product.findByIdAndUpdate(
        _id,
        { $inc: { quantity: decrement } },
        { new: true }
      );
    },
    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError("Incorrect credentials");
      }
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }
      const token = signToken(user);
      return { token, user };
    },
  },
};

module.exports = resolvers;