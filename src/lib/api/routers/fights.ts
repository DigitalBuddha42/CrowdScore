import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc';
import { FightStatus } from '@prisma/client';

export const fightsRouter = createTRPCRouter({
  // Public procedures
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.fight.findMany({
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

  getById: publicProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    return ctx.prisma.fight.findUnique({
      where: { id: input.id },
      include: {
        scorecards: {
          include: {
            user: true,
            rounds: true,
          },
        },
        judgeScores: true,
      },
    });
  }),

  // Protected procedures
  create: protectedProcedure
    .input(
      z.object({
        eventName: z.string(),
        fighter1: z.string(),
        fighter2: z.string(),
        weightClass: z.string(),
        rounds: z.number().default(3),
        status: z.nativeEnum(FightStatus).default(FightStatus.upcoming),
        startTime: z.date().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.fight.create({
        data: input,
        include: {
          scorecards: {
            include: {
              user: true,
              rounds: true,
            },
          },
          judgeScores: true,
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        eventName: z.string().optional(),
        fighter1: z.string().optional(),
        fighter2: z.string().optional(),
        weightClass: z.string().optional(),
        rounds: z.number().optional(),
        status: z.nativeEnum(FightStatus).optional(),
        startTime: z.date().optional(),
        endTime: z.date().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.prisma.fight.update({
        where: { id },
        data,
        include: {
          scorecards: {
            include: {
              user: true,
              rounds: true,
            },
          },
          judgeScores: true,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.fight.delete({
        where: { id: input.id },
      });
    }),
});
