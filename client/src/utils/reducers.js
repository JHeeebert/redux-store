import {
  UPDATE_PRODUCTS,
  ADD_TO_CART,
  UPDATE_CART_QUANTITY,
  REMOVE_FROM_CART,
  ADD_MULTIPLE_TO_CART,
  UPDATE_CATEGORIES,
  UPDATE_CURRENT_CATEGORY,
  CLEAR_CART,
  TOGGLE_CART,
} from "./actions";

const defaultState = {
  products: [],
  cart: [],
  cartOpen: false,
  categories: [],
  currentCategory: "",
};

const handleUpdateProducts = (state, action) => {
  // Updates the products in the state with new data from action
  return {
    ...state,
    products: [...action.products],
  };
};

const handleAddToCart = (state, action) => {
  return {
    ...state,
    cartOpen: true,
    cart: [...state.cart, action.product],
  };
};

const handleAddMultipleToCart = (state, action) => {
  return {
    ...state,
    cart: [...state.cart, ...action.products],
  };
};

const handleUpdateCartQuantity = (state, action) => {
  return {
    ...state,
    cartOpen: true,
    cart: state.cart.map((product) => {
      if (action._id === product._id) {
        product.purchaseQuantity = action.purchaseQuantity;
      }
      return product;
    }),
  };
};

const handleRemoveFromCart = (state, action) => {
  const newState = state.cart.filter((product) => {
    return product._id !== action._id;
  });

  return {
    ...state,
    cartOpen: newState.length > 0,
    cart: newState,
  };
};

const handleClearCart = (state) => {
  return {
    ...state,
    cartOpen: false,
    cart: [],
  };
};

const handleToggleCart = (state) => {
  return {
    ...state,
    cartOpen: !state.cartOpen,
  };
};

const handleUpdateCategories = (state, action) => {
  // Updates the categories in the state with new data from action
  return {
    ...state,
    categories: [...action.categories],
  };
};

const handleUpdateCurrentCategory = (state, action) => {
  return {
    ...state,
    currentCategory: action.currentCategory,
  };
};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case UPDATE_PRODUCTS:
      return handleUpdateProducts(state, action);
    case ADD_TO_CART:
      return handleAddToCart(state, action);
    case ADD_MULTIPLE_TO_CART:
      return handleAddMultipleToCart(state, action);
    case UPDATE_CART_QUANTITY:
      return handleUpdateCartQuantity(state, action);
    case REMOVE_FROM_CART:
      return handleRemoveFromCart(state, action);
    case CLEAR_CART:
      return handleClearCart(state);
    case TOGGLE_CART:
      return handleToggleCart(state);
    case UPDATE_CATEGORIES:
      return handleUpdateCategories(state, action);
    case UPDATE_CURRENT_CATEGORY:
      return handleUpdateCurrentCategory(state, action);
    default:
      return state;
  }
};

export default reducer;