import DataLoader from 'dataloader';
import { PrismaClient } from '@prisma/client';
import { IContext } from '../types/interfaces.js';

const membersLoader = (prisma: PrismaClient) =>
  new DataLoader(async (keys) => {
    const memberTypes = await prisma.memberType.findMany({
      where: { id: { in: keys as string[] } },
    });
    return keys.map((key) => memberTypes.find((type) => type.id === key));
  });

const profileLoader = (prisma: PrismaClient) =>
  new DataLoader(async (keys) => {
    const profiles = await prisma.profile.findMany({
      where: { userId: { in: keys as string[] } },
    });
    return keys.map((key) => profiles.find((profile) => profile.userId === key));
  });

const postLoader = (prisma: PrismaClient) =>
  new DataLoader(async (keys) => {
    const posts = await prisma.post.findMany({
      where: { authorId: { in: keys as string[] } },
    });
    return keys.map((key) => posts.filter((post) => post.authorId === key));
  });

const userSubscribedToLoader = (prisma: PrismaClient) =>
  new DataLoader(async (keys) => {
    const subscriptions = await prisma.user.findMany({
      where: { subscribedToUser: { some: { subscriberId: { in: keys as string[] } } } },
    });
    return [subscriptions];
  });

const subscribedToUserLoader = (prisma: PrismaClient) =>
  new DataLoader(async (keys) => {
    const subscriptions = await prisma.user.findMany({
      where: { userSubscribedTo: { some: { authorId: { in: keys as string[] } } } },
    });
    return [subscriptions];
  });

export const createLoaders = (prisma: PrismaClient) => {
  return {
    cache: new Map(),
    membersLoader: membersLoader(prisma),
    profileLoader: profileLoader(prisma),
    postLoader: postLoader(prisma),
    userSubscribedToLoader: userSubscribedToLoader(prisma),
    subscribedToUserLoader: subscribedToUserLoader(prisma),
  };
};

export const getLoader = <T>(
  id: string,
  context: IContext,
  loaderCreator: string,
): DataLoader<string, T> | null => {
  return context.loaders[loaderCreator].load(id);
};
