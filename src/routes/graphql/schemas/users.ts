import {
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql/index.js';
import { UUIDType } from '../types/uuid.js';
import { IContext } from '../types/interfaces.js';
import { getLoader } from '../modules/loaders.js';
import { ProfileTypes } from './profiles.js';
import { PostTypes } from './posts.js';

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

export const CreateUserInputType = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: {
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  },
});

export const ChangeUserInputType = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: {
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  },
});
