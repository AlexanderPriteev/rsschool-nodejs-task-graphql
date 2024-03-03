import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql/index.js';
import { UUIDType } from './types/uuid.js';
import {
  MemberTypeId,
  MemberTypes,
  PostTypes,
  ProfileTypes,
  UserTypes,
} from './schemas.js';
import { IContext } from './types/interfaces.js';
import {
  parseResolveInfo,
  ResolveTree,
  simplifyParsedResolveInfoFragmentWithType,
} from 'graphql-parse-resolve-info';

export const rootQuery = new GraphQLObjectType({
  name: 'query',
  fields: {
    users: {
      type: new GraphQLList(UserTypes),
      resolve: async (_, _args, context: IContext, resolveInfo) => {
        const info = parseResolveInfo(resolveInfo) as ResolveTree;
        const fieldList = Object.keys(
          simplifyParsedResolveInfoFragmentWithType(info, new GraphQLList(UserTypes))
            .fields,
        );

        if (context.loaders.cache.size) return caches;
        const users = await context.prisma.user.findMany({
          include: {
            profile: fieldList.includes('profile'),
            posts: fieldList.includes('posts'),
            userSubscribedTo: fieldList.includes('userSubscribedTo'),
            subscribedToUser: fieldList.includes('subscribedToUser'),
          },
        });
        users.forEach((user) => context.loaders.cache.set(user.id, user));

        return users;
      },
    },
    user: {
      type: UserTypes,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: (_, { id }, context: IContext) => {
        return context.prisma.user.findUnique({ where: { id } });
      },
    },

    memberTypes: {
      type: new GraphQLList(MemberTypes),
      resolve: (_, _args, context: IContext) => context.prisma.memberType.findMany(),
    },
    memberType: {
      type: MemberTypes,
      args: {
        id: { type: new GraphQLNonNull(MemberTypeId) },
      },
      resolve: (_, { id }, context: IContext) => {
        return context.prisma.memberType.findUnique({ where: { id } });
      },
    },
    posts: {
      type: new GraphQLList(PostTypes),
      resolve: (_, _args, context: IContext) => context.prisma.post.findMany(),
    },
    post: {
      type: PostTypes,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: (_, { id }, context: IContext) => {
        return context.prisma.post.findUnique({ where: { id } });
      },
    },

    profiles: {
      type: new GraphQLList(ProfileTypes),
      resolve: (_, _args, context: IContext) => context.prisma.profile.findMany(),
    },
    profile: {
      type: ProfileTypes,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: (_, { id }, context: IContext) => {
        return context.prisma.profile.findUnique({ where: { id } });
      },
    },
  },
});
