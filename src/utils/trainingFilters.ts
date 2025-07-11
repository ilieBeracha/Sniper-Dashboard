import { TrainingSession } from "@/types/training";
import { parseISO, isToday, isPast, isFuture } from "date-fns";

export const filterTrainingsByDate = (trainings: TrainingSession[]) => {
  const todaySessions = trainings.filter((s) => isToday(parseISO(s.date)));

  const upcoming = trainings.filter((s) => {
    const sessionDate = parseISO(s.date);
    return isFuture(sessionDate) && !isToday(sessionDate);
  });

  const past = trainings
    .filter((s) => {
      const sessionDate = parseISO(s.date);
      const sessionDateEnd = new Date(sessionDate);
      sessionDateEnd.setHours(23, 59, 59, 999);
      return isPast(sessionDateEnd) && !isToday(sessionDate);
    })
    .reverse();

  return { todaySessions, upcoming, past };
};
