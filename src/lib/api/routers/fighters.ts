import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc';

export const fightersRouter = createTRPCRouter({
  // Public procedures
  getAll: publicProcedure.query(async ({ ctx }) => {
    // Get all unique fighters from fights
    const fights = await ctx.prisma.fight.findMany({
      select: {
        fighter1: true,
        fighter2: true,
      },
    });

    // Extract unique fighters
    const fighters = new Set<string>();
    fights.forEach((fight) => {
      fighters.add(fight.fighter1);
      fighters.add(fight.fighter2);
    });

    return Array.from(fighters).sort();
  }),

  getFightsByFighter: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.fight.findMany({
        where: {
          OR: [{ fighter1: input.name }, { fighter2: input.name }],
        },
        include: {
          scorecards: {
            include: {
              user: true,
              rounds: true,
            },
          },
          judgeScores: true,
        },
        orderBy: {
          startTime: 'desc',
        },
      });
    }),

  // Protected procedures
  addFighter: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Create a new fight with the fighter to ensure they exist in the system
      // This is a workaround since we don't have a separate fighters table
      const existingFights = await ctx.prisma.fight.findFirst({
        where: {
          OR: [{ fighter1: input.name }, { fighter2: input.name }],
        },
      });

      if (existingFights) {
        return { success: true, message: 'Fighter already exists' };
      }

      // Create a placeholder fight that will be updated later
      await ctx.prisma.fight.create({
        data: {
          eventName: 'Fighter Registration',
          fighter1: input.name,
          fighter2: 'TBD',
          weightClass: 'TBD',
          status: 'upcoming',
        },
      });

      return { success: true, message: 'Fighter added successfully' };
    }),

  updateFighterName: protectedProcedure
    .input(z.object({ oldName: z.string(), newName: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Update all fights where the fighter appears
      await ctx.prisma.fight.updateMany({
        where: {
          fighter1: input.oldName,
        },
        data: {
          fighter1: input.newName,
        },
      });

      await ctx.prisma.fight.updateMany({
        where: {
          fighter2: input.oldName,
        },
        data: {
          fighter2: input.newName,
        },
      });

      return { success: true, message: 'Fighter name updated successfully' };
    }),
});
