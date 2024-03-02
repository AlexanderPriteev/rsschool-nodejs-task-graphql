import { GraphQLObjectType } from "graphql/index.js";
import { GraphQLNonNull } from "graphql";
import {
    CreatePostInputType,
    CreateProfileInputType,
    CreateUserInputType,
    PostTypes,
    ProfileTypes,
    UserTypes
} from "./schemas.js";
import {IContext} from "./types/interfaces.js";

export const rootMutation = new GraphQLObjectType({
    name: 'mutation',
    fields: {
        createPost: {
            type: PostTypes,
            args: {
                dto: { type: new GraphQLNonNull(CreatePostInputType) },
            },
            resolve: (_, { dto }, context: IContext) => context.prisma.post.create({ data: dto })
        },
        createUser: {
            type: UserTypes,
            args: {
                dto: { type: new GraphQLNonNull(CreateUserInputType) },
            },
            resolve: (_, { dto }, context: IContext) => context.prisma.user.create({ data: dto })
        },
        createProfile: {
            type: ProfileTypes,
            args: {
                dto: { type: new GraphQLNonNull(CreateProfileInputType) },
            },
            resolve: (_, { dto }, context: IContext) => context.prisma.profile.create({ data: dto })
        }
    }
})
