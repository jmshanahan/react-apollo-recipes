import React from "react";
import "./App.css";
import { Query } from "react-apollo";
import { GET_ALL_RECIPES } from "../queries";
import RecipeItem from "./Recipe/RecipeItem";
const App = () => (
  <div className="App">
    <h1>Home</h1>
    <Query query={GET_ALL_RECIPES} displayName="App-Get-Recipes">
      {({ data, loading, error }) => {
        if (loading) return <div>Loading</div>;
        if (error) return <div>Error</div>;
        return (
          <ul>
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
