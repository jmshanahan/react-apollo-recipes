import React from "react";
import { Mutation } from "react-apollo";
import { withRouter } from "react-router-dom";
import CKEditor from "react-ckeditor-component";
import { ADD_RECIPE, GET_ALL_RECIPES, GET_USER_RECIPES } from "../../queries";
import Error from "../Error";
import withAuth from "../withAuth";

const initialState = {
  name: "",
  instructions: "",
  category: "Breakfast",
  description: "",
  username: ""
};

class AddRecipe extends React.Component {
  state = { ...initialState };
  clearState = () => {
    this.setState(state => ({
      ...state,
      ...initialState,
      username: this.props.session.getCurrentUser.username
    }));
  };
  componentDidMount() {
    this.setState(state => ({
      ...state,
      username: this.props.session.getCurrentUser.username
    }));
  }

  handleChange = event => {
    const { name, value } = event.target;
    //I think this is correct. If not go back to the standard way
    // this.setState({ [name]: value });

    this.setState(state => ({
      ...state,
      [name]: value
    }));
  };
  handleInstructionChange = event => {
    const newContent = event.editor.getData();
    this.setState({ instructions: newContent });
  };
  handleSubmit = (event, addRecipe) => {
    event.preventDefault();
    addRecipe().then(({ data }) => {
      this.clearState();
      // This requires withRouter which is a HOC. Note how we wrapped signIn with withRouter
      this.props.history.push("/");
    });
  };
  validateForm = () => {
    const { name, category, description, instructions } = this.state;
    const isInvalid = !name || !category || !description || !instructions;
    return isInvalid;
  };
  updateCache = (cache, { data: { addRecipe } }) => {
    const { getAllRecipes } = cache.readQuery({ query: GET_ALL_RECIPES });
    cache.writeQuery({
      query: GET_ALL_RECIPES,
      data: {
        getAllRecipes: [addRecipe, ...getAllRecipes]
      }
    });
  };

  render() {
    const { name, category, description, instructions, username } = this.state;
    return (
      <Mutation
        mutation={ADD_RECIPE}
        variables={{
          name,
          category,
          description,
          instructions,
          username
        }}
        refetchQueries={() => [
          { query: GET_USER_RECIPES, variables: { username } }
        ]}
        update={this.updateCache}
      >
        {(addRecipe, { data, loading, error }) => {
          return (
            <div className="App">
              <h2 className="App">Add Recipe</h2>
              <form
                className="form"
                onSubmit={event => this.handleSubmit(event, addRecipe)}
              >
                <input
                  type="text"
                  name="name"
                  placeholder="Recipe Name"
                  onChange={this.handleChange}
                  value={name}
                />

                <select
                  name="category"
                  onChange={this.handleChange}
                  value={category}
                >
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Snack">Snack</option>
                </select>
                <input
                  type="text"
                  name="description"
                  placeholder="Add description"
                  onChange={this.handleChange}
                  value={description}
                />
                <label htmlFor="instructions">Instructions</label>
                <CKEditor
                  name="instructions"
                  content={instructions}
                  events={{ change: this.handleInstructionChange }}
                />
                <button
                  disabled={loading || this.validateForm()}
                  type="submit"
                  className="button-primary"
                >
                  Submit
                </button>
                {error && <Error error={error} />}
              </form>
            </div>
          );
        }}
      </Mutation>
    );
  }
}
export default withAuth(session => session && session.getCurrentUser)(
  withRouter(AddRecipe)
);
