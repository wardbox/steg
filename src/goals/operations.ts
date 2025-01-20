import { type Goal, type GoalProgress } from "wasp/entities";
import {
  type CreateGoal,
  type DeleteGoal,
  type GetGoals,
  type UpdateGoalProgress,
} from "wasp/server/operations";
import { HttpError } from "wasp/server";

function getStartOfPeriod(
  frequency: string,
  date: Date = new Date(),
  cycleLength?: number,
  cycleUnit?: string,
  startDate?: Date,
) {
  const d = new Date(date);
  switch (frequency) {
    case "DAILY":
      d.setHours(0, 0, 0, 0);
      return d;
    case "WEEKLY":
      d.setDate(d.getDate() - d.getDay()); // Start of week (Sunday)
      d.setHours(0, 0, 0, 0);
      return d;
    case "MONTHLY":
      d.setDate(1); // Start of month
      d.setHours(0, 0, 0, 0);
      return d;
    case "ANNUAL":
      d.setMonth(0, 1); // Start of year
      d.setHours(0, 0, 0, 0);
      return d;
    case "CUSTOM":
      if (!cycleLength || !cycleUnit || !startDate) return d;

      // Calculate the start of the current cycle
      const now = new Date(date);
      const msPerDay = 24 * 60 * 60 * 1000;
      let cycleDuration: number;

      switch (cycleUnit) {
        case "days":
          cycleDuration = cycleLength * msPerDay;
          break;
        case "weeks":
          cycleDuration = cycleLength * 7 * msPerDay;
          break;
        case "months":
          // Approximate months as 30.44 days
          cycleDuration = cycleLength * 30.44 * msPerDay;
          break;
        default:
          return d;
      }

      const timeSinceStart = now.getTime() - startDate.getTime();
      const cyclesSinceStart = Math.floor(timeSinceStart / cycleDuration);
      const cycleStart = new Date(
        startDate.getTime() + cyclesSinceStart * cycleDuration,
      );
      cycleStart.setHours(0, 0, 0, 0);
      return cycleStart;
    default:
      return d;
  }
}

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
          where: {
            date: {
              gte: getStartOfPeriod("DAILY"), // Default to showing today's progress
            },
          },
          orderBy: {
            date: "desc",
          },
          take: 1,
        },
      },
      orderBy: [
        {
          endDate: "asc",
        },
        {
          name: "asc",
        },
      ],
    });
    return goals;
  } catch (error) {
    const err = error as Error;
    throw new HttpError(500, err.message);
  }
}) satisfies GetGoals<void, (Goal & { progress: GoalProgress[] })[]>;

type GoalType = "COUNTABLE" | "YES_NO";
type GoalFrequency =
  | "ONE_TIME"
  | "DAILY"
  | "WEEKLY"
  | "MONTHLY"
  | "ANNUAL"
  | "CUSTOM";
type GoalCategory =
  | "HEALTH"
  | "FINANCE"
  | "CAREER"
  | "EDUCATION"
  | "PERSONAL"
  | "SOCIAL"
  | "CREATIVE"
  | "OTHER";

type CreateGoalInput = {
  name: string;
  type: GoalType;
  category: GoalCategory;
  frequency: GoalFrequency;
  cycleLength?: number;
  cycleUnit?: "days" | "weeks" | "months";
  startDate: Date;
  targetValue: number | null;
  isReverse: boolean;
  endDate?: Date;
};

type UpdateGoalProgressInput = {
  goalId: string;
  value: number;
  date: Date;
};

export const createGoal: CreateGoal<CreateGoalInput, Goal> = async (
  args,
  context,
) => {
  if (!context.user) {
    throw new HttpError(401, "You must be logged in to create goals");
  }

  try {
    const goal = await context.entities.Goal.create({
      data: {
        name: args.name,
        type: args.type,
        category: args.category,
        frequency: args.frequency,
        cycleLength: args.cycleLength,
        cycleUnit: args.cycleUnit,
        startDate: args.startDate,
        targetValue: args.targetValue,
        isReverse: args.isReverse,
        endDate: args.endDate,
        userId: context.user.id,
      },
    });
    return goal;
  } catch (error) {
    const err = error as Error;
    throw new HttpError(500, err.message);
  }
};

export const updateGoalProgress: UpdateGoalProgress<
  UpdateGoalProgressInput,
  GoalProgress
> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, "You must be logged in to update goals");
  }

  try {
    // Verify the goal belongs to the user
    const goal = await context.entities.Goal.findUnique({
      where: { id: args.goalId },
    });

    if (!goal) {
      throw new HttpError(404, "Goal not found");
    }

    if (goal.userId !== context.user.id) {
      throw new HttpError(403, "You can only update your own goals");
    }

    // Get the current period's progress if it exists
    const currentProgress = await context.entities.GoalProgress.findFirst({
      where: {
        goalId: args.goalId,
        date: {
          gte: getStartOfPeriod(
            goal.frequency,
            new Date(),
            goal.cycleLength || undefined,
            goal.cycleUnit || undefined,
            goal.startDate,
          ),
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    // Update existing progress or create new one
    const progress = await context.entities.GoalProgress.upsert({
      where: {
        id: currentProgress?.id || "",
      },
      update: {
        value: args.value,
        date: args.date,
      },
      create: {
        goalId: args.goalId,
        value: args.value,
        date: args.date,
      },
    });

    return progress;
  } catch (error) {
    const err = error as Error;
    throw new HttpError(500, err.message);
  }
};

export const deleteGoal: DeleteGoal<{ id: string }, void> = async (
  { id },
  context,
) => {
  if (!context.user) {
    throw new HttpError(401, "You must be logged in to delete goals");
  }

  try {
    // Verify the goal belongs to the user
    const goal = await context.entities.Goal.findUnique({
      where: { id },
    });

    if (!goal) {
      throw new HttpError(404, "Goal not found");
    }

    if (goal.userId !== context.user.id) {
      throw new HttpError(403, "You can only delete your own goals");
    }

    await context.entities.Goal.delete({
      where: { id },
    });
  } catch (error) {
    const err = error as Error;
    throw new HttpError(500, err.message);
  }
};
