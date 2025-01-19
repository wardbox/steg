import { type Goal, type GoalProgress } from "wasp/entities";
import { type GetGoals } from "wasp/server/operations";
import { HttpError } from "wasp/server";

export const getGoals = (async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, "You must be logged in to view goals");
  }

  try {
    const goals = await context.entities.Goal.findMany({
      where: {
        userId: context.user.id,
      },
      include: {
        progress: {
          orderBy: {
            date: "desc",
          },
          take: 1,
        },
      },
      orderBy: {
        endDate: "asc",
      },
    });
    return goals;
  } catch (error) {
    const err = error as Error;
    throw new HttpError(500, err.message);
  }
}) satisfies GetGoals<void, (Goal & { progress: GoalProgress[] })[]>;
