import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql, GraphQLSchema } from 'graphql';
import {rootQuery} from "./root-query.js";

const schema = new GraphQLSchema({
  query: rootQuery,
})

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma, httpErrors } = fastify;

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      try {
        const {query, variables} = req.body;
        console.log(query);
        const res = await graphql({
          schema,
          source: query,
          contextValue: { prisma },
          variableValues: variables
        });
        console.log( res);

        return res;
      } catch (err) {
        console.error(err);
      }
    }
  });
};

export default plugin;
