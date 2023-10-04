import React, { useEffect } from "react";

import { useQuery } from "@apollo/client";

import { useDispatch, useSelector } from "react-redux";

import {
  UPDATE_CATEGORIES,
  UPDATE_CURRENT_CATEGORY,
} from "../../utils/actions";

import { QUERY_CATEGORIES } from "../../utils/queries";

import { idbPromise } from "../../utils/helpers";

// import "./CategoryMenu.css"; // Import your CSS file

function CategoryMenu() {
  const state = useSelector((state) => state);

  const dispatch = useDispatch();

  const { categories } = state;

  const { loading, data: categoryData } = useQuery(QUERY_CATEGORIES);

  useEffect(() => {
    if (categoryData) {
      dispatch({
        type: UPDATE_CATEGORIES,

        categories: categoryData.categories,
      });

      categoryData.categories.forEach((category) => {
        idbPromise("categories", "put", category);
      });
    } else if (!loading) {
      idbPromise("categories", "get").then((categories) => {
        dispatch({
          type: UPDATE_CATEGORIES,

          categories: categories,
        });
      });
    }
  }, [categoryData, loading, dispatch]);

  const handleClick = (id) => {
    dispatch({
      type: UPDATE_CURRENT_CATEGORY,

      currentCategory: id,
    });
  };

  return (
    <div className="category-menu">
      <h2 className="category-menu__title">Choose a Category</h2>

      <div className="category-menu__buttons">
        {categories.map((item) => (
          <button
            key={item._id}
            onClick={() => {
              handleClick(item._id);
            }}
            className="category-menu__button"
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default CategoryMenu;
