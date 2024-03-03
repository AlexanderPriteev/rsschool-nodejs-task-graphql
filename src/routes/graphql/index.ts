import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql, GraphQLSchema, parse, validate } from 'graphql';
import { queries } from './modules/queries.js';
import { mutations } from './modules/mutations.js';
import depthLimit from 'graphql-depth-limit';
import { createLoaders } from './modules/loaders.js';

const schema = new GraphQLSchema({
  query: queries,
  mutation: mutations,
});

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

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
        const { query, variables } = req.body;
        const loaders = createLoaders(prisma);

        const errors = validate(schema, parse(query), [depthLimit(5)]);
        if (errors.length) return { errors };

        return await graphql({
          schema,
          source: query,
          contextValue: { prisma, loaders },
          variableValues: variables,
        });
      } catch (err) {
        console.error(err);
      }
    },
  });
};

export default plugin;
