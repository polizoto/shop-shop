import React from "react";
import ProductList from "../components/ProductList";
import CategoryMenu from "../components/CategoryMenu";

const Home = () => {
// Previous
// const [currentCategory, setCategory] = useState("");
//   return (
//     <div className="container">
//       <CategoryMenu setCategory={setCategory} />
//       <ProductList currentCategory={currentCategory} />
//     </div>
//   );
// };

// Now all this component has to concern itself with is displaying the other components, which makes it much easier to build upon in the future.
  return (
    <div className="container">
      <CategoryMenu />
      <ProductList />
    </div>
  );
};

export default Home;