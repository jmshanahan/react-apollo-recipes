import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Mutation } from "react-apollo";
import "../App.css";
import { SIGNIN_USER } from "../../queries";
import Error from "../Error";

const initialState = {
  username: "",
  password: ""
};

class signin extends Component {
  state = { ...initialState };
  clearState = () => {
    this.setState(state => ({ ...state, ...initialState }));
  };
  handleChange = e => {
    const { name, value } = e.target;
    //I think this is correct. If not go back to the standard way
    this.setState({ [name]: value });

    // this.setState(state => ({
    //   ...state,
    //   [name]: value
    // }));
  };
  handleSubmit = (event, signinUser) => {
    event.preventDefault();
    signinUser().then(async ({ data }) => {
      localStorage.setItem("token", data.signinUser.token);
      // Do this before state is cleared.
      await this.props.refetch();
      this.clearState();
      // This requires withRouter which is a HOC. Note how we wrapped signIn with withRouter
      this.props.history.push("/");
    });
  };

  validateForm = () => {
    const { username, password } = this.state;
    const isInvalid = !username || !password;
    return isInvalid;
  };
  render() {
    const { username, password } = this.state;
    return (
      <div className="App">
        <h2 className="App">Signin</h2>
        <Mutation mutation={SIGNIN_USER} variables={{ username, password }}>
          {(signinUser, { data, loading, error }) => {
            return (
              <form
                className="form"
                onSubmit={event => this.handleSubmit(event, signinUser)}
              >
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  autoComplete="off"
                  onChange={this.handleChange}
                  value={username}
                />

                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  autoComplete="off"
                  value={password}
                  onChange={this.handleChange}
                />

                <button
                  type="submit"
                  disabled={loading || this.validateForm()}
                  className="button-primary"
                >
                  Submit
                </button>
                {error && <Error error={error} />}
              </form>
            );
          }}
        </Mutation>
      </div>
    );
  }
}
export default withRouter(signin);
