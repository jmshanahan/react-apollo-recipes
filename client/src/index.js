import React, { Fragment } from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import "./index.css";
import App from "./components/App";
import Signin from "./components/Auth/signin";
import Signup from "./components/Auth/signup";
import Search from "./components/Recipe/Search";
import AddRecipe from "./components/Recipe/AddRecipe";
import RecipePage from "./components/Recipe/RecipePage";
import Profile from "./components/Profile/Profile";
import withSession from "./components/withSession";

import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import Navbar from "./components/navbar";
//uri: "http:///graphql",

// const uriPath =
//   process.env.NODE_ENV === "development"
//     ? "http://localhost:4444"
//     : "https://react-apollo-joes-recipes.herokuapp.com";
const client = new ApolloClient({
  uri: `https://react-apollo-joes-recipes.herokuapp.com/graphql`,
  fetchOptions: {
    credentials: "include"
  },
  request: operation => {
    const token = localStorage.getItem("token");
    operation.setContext({ headers: { authorization: token } });
  },
  onError: ({ networkError }) => {
    if (networkError) {
      // console.log("Network Error", networkError);
      localStorage.setItem("token", "");
    }
    // if (networkError.statusCode === 401) {
    //   localStorage.setItem("token", "");
    // }
  }
});

const Root = ({ refetch, session }) => (
  <Router>
    <Fragment>
      <Navbar session={session} />
      <Switch>
        <Route path="/" exact component={App} />
        <Route path="/search" exact component={Search} />
        <Route path="/signin" render={() => <Signin refetch={refetch} />} />
        <Route path="/signup" render={() => <Signup refetch={refetch} />} />
        <Route
          path="/recipe/add"
          render={() => <AddRecipe session={session} />}
        />
        <Route path="/recipes/:_id" component={RecipePage} />
        <Route path="/profile" render={() => <Profile session={session} />} />
        <Redirect to="/" />
      </Switch>
    </Fragment>
  </Router>
);
const RootwithSession = withSession(Root);

ReactDOM.render(
  <ApolloProvider client={client}>
    <RootwithSession />
  </ApolloProvider>,

  document.getElementById("root")
);
