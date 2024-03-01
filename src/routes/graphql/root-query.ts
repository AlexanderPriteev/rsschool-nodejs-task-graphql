import {GraphQLList, GraphQLNonNull, GraphQLObjectType} from "graphql/index.js";
import {UUIDType} from "./types/uuid.js";
import {MemberTypeId, MemberTypes, PostTypes, ProfileTypes, UserTypes} from "./schemas.js";
import {IContext} from "./types/interfaces.js";

export const rootQuery = new GraphQLObjectType({
    name: 'query',
    fields: {
        memberTypes: {
            type: new GraphQLList(MemberTypes),
            resolve: (_, _args, context: IContext) => context.prisma.memberType.findMany()
        },
        memberType: {
            type: MemberTypes,
            args: {
                id: { type: new  GraphQLNonNull(MemberTypeId) }
            },
            resolve: (_, { id }, context: IContext) => {
                return  context.prisma.memberType.findUnique({ where: { id } })
            }
        },
        posts: {
            type: new GraphQLList(PostTypes),
            resolve: (_, _args, context: IContext) => context.prisma.post.findMany()
        },
        post: {
            type: PostTypes,
            args: {
                id: { type: new  GraphQLNonNull(UUIDType) }
            },
            resolve: (_, { id }, context: IContext) => {
                return  context.prisma.post.findUnique({ where: { id } })
            }
        },
        users: {
            type: new GraphQLList(UserTypes),
            resolve: (_, _args, context: IContext) => context.prisma.user.findMany()
        },
        user: {
            type: UserTypes,
            args: {
                id: { type: new GraphQLNonNull(UUIDType) }
            },
            resolve: (_, { id }, context: IContext) => {
                return  context.prisma.user.findUnique({ where: { id } })
            }
        },
        profiles: {
            type: new GraphQLList(ProfileTypes),
            resolve: (_, _args, context: IContext) => context.prisma.profile.findMany()
        },
        profile: {
            type: ProfileTypes,
            args: {
                id: { type: new GraphQLNonNull(UUIDType) }
            },
            resolve: async (_, { id }, context: IContext) => {
                return  context.prisma.profile.findUnique({ where: { id } })
            }
        },
    }
})

