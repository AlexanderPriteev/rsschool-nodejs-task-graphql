import {
  GraphQLBoolean,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLObjectType,
} from 'graphql/index.js';
import { UUIDType } from '../types/uuid.js';
import { MemberTypeId, MemberTypes } from './member-types.js';
import { IContext } from '../types/interfaces.js';
import { getLoader } from '../modules/loaders.js';

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

export const CreateProfileInputType = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: {
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    userId: { type: UUIDType },
    memberTypeId: { type: MemberTypeId },
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
