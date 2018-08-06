import React from "react";
import { Link } from "react-router-dom";

export default ({ _id, name, likes }) => {
  return (
    <li>
      <Link to={`/recipes/${_id}`}>
        <h4>{name}</h4>
      </Link>
      <p>Likes: {likes}</p>
    </li>
  );
};
