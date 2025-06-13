import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc';

export const scorecardsRouter = createTRPCRouter({
  // Public procedures
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.scorecard.findMany({
      include: {
        user: true,
        fight: true,
        rounds: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }),

  getById: publicProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    return ctx.prisma.scorecard.findUnique({
      where: { id: input.id },
      include: {
        user: true,
        fight: true,
        rounds: true,
      },
    });
  }),

  getByFightId: publicProcedure
    .input(z.object({ fightId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.scorecard.findMany({
        where: { fightId: input.fightId },
        include: {
          user: true,
          rounds: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    }),

  // Protected procedures
  create: protectedProcedure
    .input(
      z.object({
        fightId: z.string(),
        rounds: z.array(
          z.object({
            roundNumber: z.number(),
            fighter1Score: z.number(),
            fighter2Score: z.number(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { fightId, rounds } = input;
      const userId = ctx.session.user.id;

      return ctx.prisma.scorecard.create({
        data: {
          userId,
          fightId,
          rounds: {
            create: rounds,
          },
        },
        include: {
          user: true,
          fight: true,
          rounds: true,
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        rounds: z.array(
          z.object({
            roundNumber: z.number(),
            fighter1Score: z.number(),
            fighter2Score: z.number(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, rounds } = input;

      // Delete existing rounds
      await ctx.prisma.round.deleteMany({
        where: { scorecardId: id },
      });

      // Update scorecard with new rounds
      return ctx.prisma.scorecard.update({
        where: { id },
        data: {
          rounds: {
            create: rounds,
          },
        },
        include: {
          user: true,
          fight: true,
          rounds: true,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.scorecard.delete({
        where: { id: input.id },
      });
    }),
});
