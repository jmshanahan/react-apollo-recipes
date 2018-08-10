import React from "react";
import "./App.css";
import { Query } from "react-apollo";
import { GET_ALL_RECIPES } from "../queries";
import RecipeItem from "./Recipe/RecipeItem";
import Spinner from "./Spinner";
const App = () => (
  <div className="App">
    <h1 className="main-title">
      Find Recipes you <strong>Love</strong>
    </h1>
    <Query query={GET_ALL_RECIPES} displayName="App-Get-Recipes">
      {({ data, loading, error }) => {
        if (loading) return <Spinner />;
        if (error) return <div>Error</div>;
        return (
          <ul className="cards">
            {data.getAllRecipes.map(recipe => (
              //  Note you need to spread the recipe.
              //  Worth noting as its going to catch you out in the future.
              //  you cannot pass in recipe directly.
              <RecipeItem key={recipe._id} {...recipe} />
            ))}
          </ul>
        );
      }}
    </Query>
  </div>
);

export default App;
