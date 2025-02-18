// npm install @apollo/server express graphql cors
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import { createServer } from "http";
import cors from "cors";
import { typeDefs, resolvers } from "./graphql/index.js";
import dotenv from "dotenv";
import { environment } from "./environments/environment.js";
import { AppContext } from "./types/index.js";
import { routes } from "./routes/index.js";
import { verifyToken } from "./services/jwt.js";
import { prisma } from "./services/prisma.js";
import { GraphQLError } from "graphql";

import { WebSocketServer } from "ws";
// import { useServer } from "node_modules/graphql-ws/lib/use/ws.js";
import { useServer } from "graphql-ws/lib/use/ws";

// (Removed unused useServer import)

import { makeExecutableSchema } from "@graphql-tools/schema";

// Initialize an app and an httpServer
dotenv.config();
const app = express();
const httpServer = createServer(app);

const schema = makeExecutableSchema({ typeDefs, resolvers });

// Same ApolloServer initialization as before, plus the drain plugin
// for our httpServer.
// const server = new ApolloServer({
// 	schema,
// 	plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
// });

// WebSocket server
const wsServer = new WebSocketServer({
	server: httpServer,
	path: "/graphql",
});

// Server Cleanup
const serverCleanup = useServer({ schema }, wsServer as any);

// Set up ApolloServer.
const server = new ApolloServer({
	schema,
	plugins: [
		ApolloServerPluginDrainHttpServer({ httpServer }),
		{
			async serverWillStart() {
				return {
					async drainServer() {
						await serverCleanup.dispose();
					},
				};
			},
		},
	],
});

// Health check endpoint
app.get("/healthz", (_, res) => {
	res.send("ok");
});

// Middlewares

app.use(
	cors<cors.CorsRequest>({
		// origin: environment.CLIENT_URL,/
		methods: ["GET", "POST", "PATCH", "PUT"],
		origin: function (origin, callback) {
			if (
				origin === environment.CLIENT_URL ||
				!origin ||
				origin == "http://localhost:4000" ||
				origin == "http://localhost:5173"
			) {
				callback(null, true);
			} else {
				callback(new Error("Not allowed by CORS"));
			}
		},
		allowedHeaders: ["Content-Type", "Authorization"],
	})
);
app.use(express.json());

// REST endpoints
app.use("/api", routes);

// Ensure we wait for our server to start
(async () => {
	await server.start();

	// GraphQL endpoint
	app.use(
		"/graphql",
		// @ts-ignore
		expressMiddleware(server, {
			context: async ({ req }): Promise<AppContext> => {
				const token = req.headers.authorization?.split(" ")[1];
				if (!token) {
					throw new GraphQLError("UnAuthorized");
				}
				const data = verifyToken(token);
				if (!data) {
					throw new GraphQLError("UnAuthorized");
				}
				return {
					id: data.id,
					email: data.email,
					role: data.role,
					prisma: prisma,
				};
			},
		})
	);

	// Modified server startup
	// await new Promise<void>((resolve) => {
	// });
})();

httpServer.listen({ port: Number(environment.PORT) }, () => {
	console.log(`🚀 Server ready at http://localhost:${environment.PORT}/`);
});
