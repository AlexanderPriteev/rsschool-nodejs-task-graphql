import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import {
  graphql, GraphQLBoolean,
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt, GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString
} from 'graphql';
import { PrismaClient } from '@prisma/client';

interface IContext {
  prisma: PrismaClient;
}

const MemberTypeId = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    BASIC: { value: 'basic' },
    BUSINESS: { value: 'business' },
  },
});
const MemberTypes = new GraphQLObjectType({
  name: 'memberTypes',
  fields: {
    id: { type: MemberTypeId },
    discount: { type: GraphQLFloat },
    postsLimitPerMonth: { type: GraphQLInt },
  },
});
const PostTypes = new GraphQLObjectType({
  name: 'posts',
  fields: {
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    authorId: { type: GraphQLID },
  },
});
const UserTypes = new GraphQLObjectType({
  name: 'users',
  fields: {
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  },
});
const ProfileTypes = new GraphQLObjectType({
  name: 'profiles',
  fields: {
    id: { type: MemberTypeId },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    userId: { type: GraphQLInt },
    memberTypeId: { type: GraphQLInt },
  },
});

const rootQuery = new GraphQLObjectType({
  name: 'query',
  fields: {
    memberTypes: {
      type: new GraphQLList(MemberTypes),
      resolve: (_, _args, context: IContext) => context.prisma.memberType.findMany()
    },
    posts: {
      type: new GraphQLList(PostTypes),
      resolve: (_, _args, context: IContext) => context.prisma.post.findMany()
    },
    users: {
      type: new GraphQLList(UserTypes),
      resolve: (_, _args, context: IContext) => context.prisma.user.findMany()
    },
    profiles: {
      type: new GraphQLList(ProfileTypes),
      resolve: (_, _args, context: IContext) => context.prisma.profile.findMany()
    }
  }
})

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
        const {query} = req.body;
        console.log(query);
        const res = await graphql({
          schema,
          source: query,
          contextValue: { prisma }
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
