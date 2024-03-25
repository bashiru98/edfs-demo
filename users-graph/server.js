// Imports
const { ApolloServer } = require("@apollo/server");
const { gql } = require("graphql-tag");
const { buildSubgraphSchema } = require("@apollo/subgraph");

// express setup imports
const express = require("express");
const cors = require("cors");
const http = require("http");
const { expressMiddleware } = require("@apollo/server/express4");
const {
  ApolloServerPluginDrainHttpServer,
} = require("@apollo/server/plugin/drainHttpServer");

const app = express();
const httpServer = http.createServer(app);
// Typedefs
const typeDefs = gql(
  require("fs").readFileSync(__dirname + "/schema.graphql", "utf-8")
);
// Resolvers
const resolvers = require("./resolvers");

// Apollo server
const server = new ApolloServer({
  schema: buildSubgraphSchema([
    {
      typeDefs,
      resolvers,
      plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    },
  ]),
  csrfPrevention: true,
  introspection: true,
  cache: "bounded",
});

// function that is self invoking
(async () => {
  try {
    // Ensure we wait for our server to start
    await server.start();

    app.use(
      "/",
      cors(),
      express.json(),
      // expressMiddleware accepts the same arguments:
      // an Apollo Server instance and optional configuration options
      expressMiddleware(server, {})
    );

    const port = 4018;
    // Modified server startup
    await new Promise((resolve) => httpServer.listen({ port }, resolve));

    console.log(`🚀 Server ready at http://localhost:${port}/`);
  } catch (error) {
    console.log("Error starting server: ", error);
    // exit if server fails to start
    process.exit(1);
  }
})();
