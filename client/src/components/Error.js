import React, { Fragment } from "react";

export default ({ error }) => (
  <Fragment>
    <p>{error.message}</p>
  </Fragment>
);
