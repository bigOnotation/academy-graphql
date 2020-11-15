const http = require('http')
const express = require('express')
const { ApolloServer, gql } = require('apollo-server-express')

const PORT = process.env.PORT || 4011

const app = express()

app.get('/', (req, res) => res.end('Graphql Service'))

const server = new ApolloServer({
	typeDefs: gql `
		type Course {
			id: ID!
			name: String!
		}
		type Query {
			courses: [Course!]!
		}
	`,
	resolvers: {
		Query: {
			courses: () => {
				return [
					{ id: 1, name: "X", },
					{ id: 2, name: "Y", },
				]
			},
		}
	},
	context: ({ connection }) => {
		return connection ? connection.context : {}
	},
	subscriptions: {
		onConnect: (connectionParams, webSocket, context) => {},
		onDisconnect: (webSocket, context) => {},
	},
})

server.applyMiddleware({ app, path: '/graphql' })

const httpServer = http.createServer(app)

server.installSubscriptionHandlers(httpServer)

httpServer.listen({ port: PORT }, () => {
	console.log('http://localhost:' + PORT + server.graphqlPath)
	console.log('ws://localhost:' + PORT + server.subscriptionsPath)
})
