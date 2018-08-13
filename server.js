const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const jwt = require("jsonwebtoken")
require("dotenv").config({ path: "variables.env" });

const Recipe = require("./models/Recipe");
const User = require("./models/User");

const { graphiqlExpress, graphqlExpress } = require("apollo-server-express");
const { makeExecutableSchema } = require("graphql-tools");
const { typeDefs } = require("./schema");
const { resolvers } = require("./resolvers");

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

// Connects to Database

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("DB connected"))
  .catch(err => console.log(err));

  const app = express();
  // if (process.env.NODE_ENV === "development"){

  //   // Initialize the application
  //   const corsOptions = {
  //     origin: "http://localhost:3000",
  //     credentials: true
  //   };
  //   app.use(cors(corsOptions));
  // }else{
    app.use(cors("*"));
  // }

// Set up authentication middleware
app.use( async (req, res, next) => {
  const token = req.headers["authorization"];
  // console.log(token, typeof token)
  // Note this returns a string of null not null. We discovered this by passing in typeof token and checking what was returned.
  if(token !== "null"){
    try{
      const currentUser = await jwt.verify(token, process.env.SECRET);
      req.currentUser = currentUser;
    }
    catch(err){
      console.error(`${err.name} : ${err.message}  : ${err.expiredAt}`)
    }
  }
  next()
})

if (process.env.NODE_ENV === "development"){
app.use("/graphiql", graphiqlExpress({ endpointURL: "/graphql" }));
}
// Connect schemas with GraphQL
// Ref to https://github.com/jmshanahan/nasatographql/blob/master/server/server.js
// In this example it is done through a callback
// Docs are poor. Refer to https://github.com/apollographql/apollo-server
// Destructure the currentUser off the req argument
app.use(
  "/graphql",
  bodyParser.json(),
  graphqlExpress(({currentUser}) => ({
    schema,
    context: {
      Recipe,
      User,
      currentUser
    }
  }))
);

if(process.env.NODE_ENV === 'production' ){
  app.use(express.static('client/build'))
  app.get("*",(req,res) => {
    res.sendFile(path.resolve(__dirname,"client","build", "index.html"))
  })
}

const PORT = process.env.PORT || 4444;

app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
