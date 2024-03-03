import { GraphQLBoolean, GraphQLObjectType } from 'graphql/index.js';
import { GraphQLNonNull } from 'graphql';
import {
  ChangePostInputType,
  ChangeProfileInputType,
  ChangeUserInputType,
  CreatePostInputType,
  CreateProfileInputType,
  CreateUserInputType,
  PostTypes,
  ProfileTypes,
  UserTypes,
} from './schemas.js';
import { IContext } from './types/interfaces.js';
import { UUIDType } from './types/uuid.js';

export const rootMutation = new GraphQLObjectType({
  name: 'mutation',
  fields: {
    createPost: {
      type: PostTypes,
      args: {
        dto: { type: new GraphQLNonNull(CreatePostInputType) },
      },
      resolve: (_, { dto }, context: IContext) =>
        context.prisma.post.create({ data: dto }),
    },
    deletePost: {
      type: GraphQLBoolean,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, { id }, context: IContext) => {
        try {
          await context.prisma.post.delete({ where: { id: id } });
          return true;
        } catch {
          return false;
        }
      },
    },
    changePost: {
      type: PostTypes,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangePostInputType) },
      },
      resolve: (_, { id, dto }, context: IContext) =>
        context.prisma.post.update({
          where: { id: id },
          data: dto,
        }),
    },

    createUser: {
      type: UserTypes,
      args: {
        dto: { type: new GraphQLNonNull(CreateUserInputType) },
      },
      resolve: (_, { dto }, context: IContext) =>
        context.prisma.user.create({ data: dto }),
    },
    deleteUser: {
      type: GraphQLBoolean,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, { id }, context: IContext) => {
        try {
          await context.prisma.user.delete({ where: { id: id } });
          return true;
        } catch {
          return false;
        }
      },
    },
    changeUser: {
      type: UserTypes,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeUserInputType) },
      },
      resolve: (_, { id, dto }, context: IContext) =>
        context.prisma.user.update({
          where: { id: id },
          data: dto,
        }),
    },

    createProfile: {
      type: ProfileTypes,
      args: {
        dto: { type: new GraphQLNonNull(CreateProfileInputType) },
      },
      resolve: (_, { dto }, context: IContext) =>
        context.prisma.profile.create({ data: dto }),
    },
    deleteProfile: {
      type: GraphQLBoolean,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, { id }, context: IContext) => {
        try {
          await context.prisma.profile.delete({ where: { id: id } });
          return true;
        } catch {
          return false;
        }
      },
    },
    changeProfile: {
      type: ProfileTypes,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeProfileInputType) },
      },
      resolve: async (_, { id, dto }, context: IContext) => {
        try {
          return await context.prisma.profile.update({
            where: { id: id },
            data: dto,
          });
        } catch {
          throw new Error(
            `Field \"userId\" is not defined by type \"ChangeProfileInput\"`,
          );
        }
      },
    },

    subscribeTo: {
      type: UserTypes,
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, { userId, authorId }, context: IContext) =>
        context.prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            userSubscribedTo: {
              create: {
                authorId: authorId,
              },
            },
          },
        }),
    },
    unsubscribeFrom: {
      type: GraphQLBoolean,
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, { userId, authorId }, context: IContext) => {
        try {
          await context.prisma.subscribersOnAuthors.delete({
            where: {
              subscriberId_authorId: {
                subscriberId: userId,
                authorId: authorId,
              },
            },
          });
          return true;
        } catch {
          return false;
        }
      },
    },
  },
});
