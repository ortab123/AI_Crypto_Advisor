import prisma from '../db/prisma.client';
import { OnboardingData, UserPreferences } from '../types/onboarding.types';

export async function savePreferences(
  userId: string,
  data: OnboardingData
): Promise<UserPreferences> {
  return prisma.userPreferences.upsert({
    where: { userId },
    update: data,
    create: { userId, ...data },
  });
}

export async function getPreferences(userId: string): Promise<UserPreferences | null> {
  return prisma.userPreferences.findUnique({ where: { userId } });
}
