import z from "$zod";

export const DateSchema = z.union([
  z.string(),
  z.date(),
  z.number(),
]).transform(
  (date: string | Date | number) => new Date(date),
);
