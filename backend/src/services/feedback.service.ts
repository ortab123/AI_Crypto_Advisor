import prisma from "../db/prisma.client";

// A flat map of "contentType:contentId" -> value, used to pre-populate the UI
export type FeedbackMap = Record<string, string>;

export async function upsertFeedback(
  userId: string,
  contentType: string,
  contentId: string,
  value: string,
): Promise<void> {
  await prisma.feedback.upsert({
    where: { userId_contentType_contentId: { userId, contentType, contentId } },
    update: { value },
    create: { userId, contentType, contentId, value },
  });
}

export async function removeFeedback(
  userId: string,
  contentType: string,
  contentId: string,
): Promise<void> {
  await prisma.feedback.deleteMany({
    where: { userId, contentType, contentId },
  });
}

export async function getFeedbackMap(userId: string): Promise<FeedbackMap> {
  const items = await prisma.feedback.findMany({ where: { userId } });
  return Object.fromEntries(
    items.map((i) => [`${i.contentType}:${i.contentId}`, i.value]),
  );
}
