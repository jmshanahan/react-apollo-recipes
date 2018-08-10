import React from "react";
import { Link } from "react-router-dom";
import { Query, Mutation } from "react-apollo";
import {
  GET_USER_RECIPES,
  DELETE_USER_RECIPE,
  GET_ALL_RECIPES,
  GET_CURRENT_USER
} from "../../queries";
import Spinner from "../Spinner";
const handleDelete = delete_user_recipe => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this recipe?"
  );
  if (confirmDelete) {
    delete_user_recipe().then(({ data }) => {
      //console.log(data)};
    });
  }
};

export default ({ username }) => (
  <Query query={GET_USER_RECIPES} variables={{ username }}>
    {({ data, loading, error }) => {
      if (loading) return <Spinner />;
      if (error) return <div>Error</div>;
      return (
        <ul className="App">
          <h3>Your Recipes</h3>
          {!data.getUserRecipes.length && (
            <p>
              <strong>You have not added recipes</strong>
            </p>
          )}
          {data.getUserRecipes.map(recipe => (
            <li key={recipe._id}>
              <Link to={`/recipes/${recipe._id}`}>
                <p>{recipe.name}</p>
              </Link>
              <p style={{ marginBottom: "0" }}>Likes: {recipe.likes}</p>
              <Mutation
                mutation={DELETE_USER_RECIPE}
                variables={{ _id: recipe._id }}
                refetchQueries={() => [
                  { query: GET_ALL_RECIPES },
                  { query: GET_CURRENT_USER }
                ]}
                update={(cache, { data: { deleteUserRecipe } }) => {
                  const { getUserRecipes } = cache.readQuery({
                    query: GET_USER_RECIPES,
                    variables: { username }
                  });
                  cache.writeQuery({
                    query: GET_USER_RECIPES,
                    variables: { username },
                    data: {
                      getUserRecipes: getUserRecipes.filter(
                        recipe => recipe._id !== deleteUserRecipe._id
                      )
                    }
                  });
                }}
              >
                {(delete_user_recipe, attrs = {}) => {
                  return (
                    <p
                      className="delete-button"
                      onClick={() => handleDelete(delete_user_recipe)}
                    >
                      {attrs.loading ? "deleting..." : "X"}
                    </p>
                  );
                }}
              </Mutation>
            </li>
          ))}
        </ul>
      );
    }}
  </Query>
);
