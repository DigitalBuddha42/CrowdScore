import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      hashedPassword: adminPassword,
      role: 'admin',
      isAdmin: true,
    },
  });

  // Create test user
  const userPassword = await hash('user123', 12);
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: 'Test User',
      hashedPassword: userPassword,
      role: 'user',
    },
  });

  // Create sample fight
  const fight = await prisma.fight.create({
    data: {
      eventName: 'UFC 300',
      fighter1: 'Jon Jones',
      fighter2: 'Francis Ngannou',
      weightClass: 'Heavyweight',
      rounds: 5,
      status: 'upcoming',
      startTime: new Date('2024-04-13T23:00:00Z'),
    },
  });

  // Create sample scorecard
  const scorecard = await prisma.scorecard.create({
    data: {
      userId: user.id,
      fightId: fight.id,
      rounds: {
        create: [
          {
            roundNumber: 1,
            fighter1Score: 10,
            fighter2Score: 9,
          },
          {
            roundNumber: 2,
            fighter1Score: 9,
            fighter2Score: 10,
          },
          {
            roundNumber: 3,
            fighter1Score: 10,
            fighter2Score: 9,
          },
        ],
      },
    },
  });

  // Create sample judge scores
  await prisma.judgeScore.createMany({
    data: [
      {
        fightId: fight.id,
        judgeName: 'Judge 1',
        roundNumber: 1,
        fighter1Score: 10,
        fighter2Score: 9,
      },
      {
        fightId: fight.id,
        judgeName: 'Judge 1',
        roundNumber: 2,
        fighter1Score: 9,
        fighter2Score: 10,
      },
      {
        fightId: fight.id,
        judgeName: 'Judge 1',
        roundNumber: 3,
        fighter1Score: 10,
        fighter2Score: 9,
      },
    ],
  });

  console.log({ admin, user, fight, scorecard });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
