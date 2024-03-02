import { Type } from '@fastify/type-provider-typebox';
import {
    GraphQLBoolean,
    GraphQLEnumType,
    GraphQLFloat,
    GraphQLInt,
    GraphQLObjectType,
    GraphQLString
} from "graphql/index.js";
import {UUIDType} from "./types/uuid.js";
import {GraphQLList} from "graphql";
import {IContext} from "./types/interfaces.js";

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
        memberTypeId: { type: UUIDType },
        memberType: {
            type: MemberTypes,
            resolve: (parent, _, context: IContext) => {
                try {
                    return context.prisma.memberType.findUnique({
                        where: { id: parent.memberTypeId }
                    });
                } catch {
                    return null;
                }
            }
        }
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
            resolve: (parent, _, context: IContext) => {
                try {
                    return context.prisma.profile.findUnique({
                        where: { userId: parent.id }
                    });
                } catch {
                    return null;
                }
            }
        },
        posts: {
            type: new GraphQLList(PostTypes),
            resolve: (parent, _, context: IContext) => {
                try {
                    return context.prisma.post.findMany({
                        where: { authorId: parent.id }
                    });
                } catch {
                    return [];
                }
            }
        },
        userSubscribedTo: {
            type: new GraphQLList(UserTypes),
            resolve: (parent, _, context: IContext) => {
                try {
                    return  context.prisma.user.findMany({
                        where: { subscribedToUser: { some: { subscriberId: parent.id } } }
                    });
                } catch (error) {
                    return [];
                }
            }
        },
        subscribedToUser: {
            type: new GraphQLList(UserTypes),
            resolve: (parent, _, context: IContext) => {
                try {
                    return  context.prisma.user.findMany({
                        where: { userSubscribedTo: {some: {authorId: parent.id }} }}
                    );
                } catch (error) {
                    return [];
                }
            }
        },
    }),
});
