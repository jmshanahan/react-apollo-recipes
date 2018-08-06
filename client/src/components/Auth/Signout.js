import React from "react";
import { withRouter } from "react-router-dom";
import { ApolloConsumer } from "react-apollo";
const handleSignout = (client, history) => {
  localStorage.setItem("token", "");
  // Apollo caches all queries si it is important to clear them when you log out
  client.resetStore();
  history.push("/");
};

export default withRouter(({ history }) => (
  <ApolloConsumer>
    {client => {
      return (
        <button onClick={() => handleSignout(client, history)}>Signout</button>
      );
    }}
  </ApolloConsumer>
));
