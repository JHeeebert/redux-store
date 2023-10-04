import React from "react";
import ProductList from "../components/ProductList";
import CategoryMenu from "../components/CategoryMenu";
import Cart from "../components/Cart";

const Home = () => {
  return (
    <div className="container">
      <h2>Welcome to Our Shop</h2>
      <CategoryMenu />
      <ProductList />
      <Cart />
    </div>
  );
};

export default Home;
