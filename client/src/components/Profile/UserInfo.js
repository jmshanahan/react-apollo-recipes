import React from "react";
import { Link } from "react-router-dom";

const formatDate = date => {
  const newDate = new Date(date).toLocaleDateString("en-UK");
  const newTime = new Date(date).toLocaleTimeString("en-UK");
  return `${newDate} at ${newTime}`;
};

export default ({ session }) => {
  return (
    <div className="App">
      <h3>User Info</h3>
      <p>Username: {session.getCurrentUser.username}</p>
      <p>Email: {session.getCurrentUser.email}</p>
      <p>Join Date: {formatDate(session.getCurrentUser.joinDate)}</p>
      <h3>{session.getCurrentUser.username}'s favorites</h3>
      <ul>
        {session.getCurrentUser.favorites.map(favorite => (
          <li key={favorite._id}>
            <Link to={`/recipes/${favorite._id}`}>
              <p>{favorite.name}</p>
            </Link>
          </li>
        ))}
        {!session.getCurrentUser.favorites.length && (
          <p>
            <strong>You have no favourites currently. Go add some</strong>
          </p>
        )}
      </ul>
    </div>
  );
};
