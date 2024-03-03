import { Type } from '@fastify/type-provider-typebox';
import {
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql/index.js';
import { UUIDType } from './types/uuid.js';
import { GraphQLList } from 'graphql';
import { IContext } from './types/interfaces.js';
import { getLoader } from './loaders.js';

export const gqlResponseSchema = Type.Partial(
  Type.Object({
    data: Type.Any(),
    errors: Type.Any(),
  }),
);

export const createGqlResponseSchema = {
  body: Type.Object(
    {
      query: Type.String(),
      variables: Type.Optional(Type.Record(Type.String(), Type.Any())),
    },
    {
      additionalProperties: false,
    },
  ),
};

//GET
export const MemberTypeId = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    basic: { value: 'basic' },
    business: { value: 'business' },
  },
});
export const MemberTypes = new GraphQLObjectType({
  name: 'memberTypes',
  fields: {
    id: { type: MemberTypeId },
    discount: { type: GraphQLFloat },
    postsLimitPerMonth: { type: GraphQLInt },
  },
});
export const PostTypes = new GraphQLObjectType({
  name: 'posts',
  fields: {
    id: { type: UUIDType },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    authorId: { type: UUIDType },
  },
});
export const ProfileTypes = new GraphQLObjectType({
  name: 'profiles',
  fields: {
    id: { type: UUIDType },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    userId: { type: UUIDType },
    memberTypeId: { type: MemberTypeId },
    memberType: {
      type: MemberTypes,
      resolve: ({ memberTypeId }, _, context: IContext) => {
        return getLoader(memberTypeId, context, 'membersLoader');
      },
    },
  },
});
export const UserTypes = new GraphQLObjectType({
  name: 'users',
  fields: () => ({
    id: { type: UUIDType },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },

    profile: {
      type: ProfileTypes,
      resolve: ({ id }, _, context: IContext) => {
        return getLoader(id, context, 'profileLoader');
      },
    },
    posts: {
      type: new GraphQLList(PostTypes),
      resolve: async ({ id }, _, context: IContext) => {
        return getLoader(id, context, 'postLoader');
      },
    },
    userSubscribedTo: {
      type: new GraphQLList(UserTypes),
      resolve: async ({ id }, _, context: IContext) => {
        const cache = context.loaders.cache;
        if (cache.size) {
          const thisUser = cache.get(id);
          return (thisUser && thisUser.userSubscribedTo) || [];
        }
        return getLoader(id, context, 'userSubscribedToLoader');
      },
    },
    subscribedToUser: {
      type: new GraphQLList(UserTypes),
      resolve: async ({ id }, _, context: IContext) => {
        const cache = context.loaders.cache;
        if (cache.size) {
          const thisUser = cache.get(id);
          return thisUser && thisUser.subscribedToUser;
        }
        return getLoader(id, context, 'subscribedToUserLoader');
      },
    },
  }),
});

//POST
export const CreatePostInputType = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  fields: {
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    authorId: { type: UUIDType },
  },
});
export const CreateUserInputType = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: {
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  },
});
export const CreateProfileInputType = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: {
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    userId: { type: UUIDType },
    memberTypeId: { type: MemberTypeId },
  },
});

//PATCH
export const ChangePostInputType = new GraphQLInputObjectType({
  name: 'ChangePostInput',
  fields: {
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    authorId: { type: UUIDType },
  },
});
export const ChangeUserInputType = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: {
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  },
});
export const ChangeProfileInputType = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: {
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    userId: { type: UUIDType },
    memberTypeId: { type: MemberTypeId },
  },
});
