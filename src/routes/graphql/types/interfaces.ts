import { PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';

export type TLoaderCreator<T> = (
  prisma: PrismaClient,
) => DataLoader<string, T>;

export interface IContext {
  prisma: PrismaClient;
  loaders: ICreateLoaders;
}

export interface ICreateLoaders {
  cache: Map<string, any>;
  membersLoader: TLoaderCreator<unknown>;
  profileLoader: TLoaderCreator<unknown>;
  postLoader: TLoaderCreator<unknown>;
  userSubscribedToLoader: TLoaderCreator<unknown>;
  subscribedToUserLoader: TLoaderCreator<unknown>;
}
