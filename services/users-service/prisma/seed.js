const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();
const DEMO_PASSWORD = 'Password123!';

const usersData = [
  { firstName: 'Alice', lastName: 'Martin', email: 'alice.martin@example.com', country: 'Canada', budgetPreference: 2000, travelPreferences: ['beach', 'culture'] },
  { firstName: 'Bob', lastName: 'Nguyen', email: 'bob.nguyen@example.com', country: 'Vietnam', budgetPreference: 1200, travelPreferences: ['adventure', 'nature'] },
  { firstName: 'Chloe', lastName: 'Dubois', email: 'chloe.dubois@example.com', country: 'France', budgetPreference: 2500, travelPreferences: ['culture', 'luxury'] },
  { firstName: 'David', lastName: 'Kim', email: 'david.kim@example.com', country: 'South Korea', budgetPreference: 1800, travelPreferences: ['city', 'culture'] },
  { firstName: 'Emma', lastName: 'Silva', email: 'emma.silva@example.com', country: 'Brazil', budgetPreference: 1000, travelPreferences: ['beach', 'adventure'] },
  { firstName: 'Farid', lastName: 'Haddad', email: 'farid.haddad@example.com', country: 'Morocco', budgetPreference: 1500, travelPreferences: ['culture', 'nature'] },
  { firstName: 'Grace', lastName: 'Lee', email: 'grace.lee@example.com', country: 'USA', budgetPreference: 3000, travelPreferences: ['luxury', 'city'] },
  { firstName: 'Hassan', lastName: 'Traore', email: 'hassan.traore@example.com', country: 'Senegal', budgetPreference: 900, travelPreferences: ['nature', 'adventure'] },
];

async function main() {
  console.log('Seeding users-service database...');
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
  for (const data of usersData) {
    await prisma.user.create({ data: { ...data, passwordHash } });
  }

  console.log(`Seeded ${usersData.length} users. Demo password: ${DEMO_PASSWORD}`);
}

main()
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
