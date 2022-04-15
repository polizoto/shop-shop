import React, { useEffect } from 'react';
import { idbPromise } from '../../utils/helpers';
import { UPDATE_CATEGORIES, UPDATE_CURRENT_CATEGORY } from '../../utils/actions';
// Currently, we have it set up to use the useQuery() Hook from Apollo to retrieve all of our category data and use it for the UI. This works great, but because we want to add offline capabilities later, this may become more difficult.
import { useQuery } from '@apollo/client';
// Instead, we'll query our category data, store it into the global state object, and then use the category data from the global state object to use it in the UI instead. 
import { useStoreContext } from "../../utils/GlobalState";
import { QUERY_CATEGORIES } from '../../utils/queries';

function CategoryMenu() {
// BEFORE - using apollo
  // const { data: categoryData } = useQuery(QUERY_CATEGORIES);
  // const categories = categoryData?.categories || [];


  // Now when we use this component, we immediately call upon the useStoreContext() Hook to retrieve the current state from the global state object and the dispatch() method to update state. Because we only need the categories array out of our global state, we simply destructure it out of state so we can use it to provide to our returning JSX.
  const [state, dispatch] = useStoreContext();

  const { categories } = state;
  
  const { loading, data: categoryData } = useQuery(QUERY_CATEGORIES);

  useEffect(() => {
    // if categoryData exists or has changed from the response of useQuery, then run dispatch()
    // categoryData is going to be undefined on load because the useQuery() Hook isn't done with its request just yet, meaning that if statement will not run.
    if (categoryData) {
      // execute our dispatch function with our action object indicating the type of action and the data to set our state for categories to
      dispatch({
        type: UPDATE_CATEGORIES,
        categories: categoryData.categories
      });
      categoryData.categories.forEach(category => {
        idbPromise('categories', 'put', category);
      });
    } else if (!loading) {
      idbPromise('categories', 'get').then(categories => {
        dispatch({
          type: UPDATE_CATEGORIES,
          categories: categories
        });
      });
    }
  }, [categoryData, loading, dispatch]);

  const handleClick = id => {
    dispatch({
      type: UPDATE_CURRENT_CATEGORY,
      currentCategory: id
    });
  };
  

  return (
    <div>
      <h2>Choose a Category:</h2>
      {categories.map(item => (
        <button
          key={item._id}
          onClick={() => {
            handleClick(item._id);
          }}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
  
}

export default CategoryMenu;
