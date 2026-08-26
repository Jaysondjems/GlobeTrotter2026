const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

const DEMO_PASSWORD = 'Password123!';

const destinationsData = [
  { name: 'Bali Beaches', country: 'Indonesia', city: 'Bali', category: 'beach', averageBudget: 900, popularityScore: 88, activities: ['surfing', 'snorkeling', 'yoga'], description: 'Tropical island famous for its beaches and temples.' },
  { name: 'Paris City Break', country: 'France', city: 'Paris', category: 'culture', averageBudget: 1800, popularityScore: 92, activities: ['museums', 'architecture', 'cuisine'], description: 'The City of Light, capital of art and gastronomy.' },
  { name: 'Kyoto Temples', country: 'Japan', city: 'Kyoto', category: 'culture', averageBudget: 1600, popularityScore: 85, activities: ['temples', 'gardens', 'tea ceremony'], description: 'Historic capital of Japan with thousands of temples.' },
  { name: 'Banff National Park', country: 'Canada', city: 'Banff', category: 'nature', averageBudget: 1400, popularityScore: 75, activities: ['hiking', 'wildlife watching', 'lakes'], description: 'Rocky Mountain wilderness with turquoise lakes.' },
  { name: 'Queenstown Adventures', country: 'New Zealand', city: 'Queenstown', category: 'adventure', averageBudget: 2000, popularityScore: 80, activities: ['bungee jumping', 'skiing', 'hiking'], description: 'Adventure capital of the world.' },
  { name: 'New York City Explorer', country: 'USA', city: 'New York', category: 'city', averageBudget: 2200, popularityScore: 95, activities: ['shopping', 'broadway', 'museums'], description: 'The city that never sleeps.' },
  { name: 'Maldives Overwater Villas', country: 'Maldives', city: "Male", category: 'luxury', averageBudget: 3500, popularityScore: 90, activities: ['diving', 'spa', 'private beach'], description: 'Luxury overwater bungalows in turquoise lagoons.' },
  { name: 'Cancun Beach Escape', country: 'Mexico', city: 'Cancun', category: 'beach', averageBudget: 1200, popularityScore: 78, activities: ['beach', 'nightlife', 'diving'], description: 'Caribbean beach resort town.' },
  { name: 'Rome Ancient Wonders', country: 'Italy', city: 'Rome', category: 'culture', averageBudget: 1700, popularityScore: 90, activities: ['ruins', 'museums', 'cuisine'], description: 'The Eternal City, cradle of Western civilization.' },
  { name: 'Reykjavik Northern Lights', country: 'Iceland', city: 'Reykjavik', category: 'nature', averageBudget: 2100, popularityScore: 72, activities: ['northern lights', 'hot springs', 'glaciers'], description: 'Land of fire and ice.' },
  { name: 'Cape Town Safari & Coast', country: 'South Africa', city: 'Cape Town', category: 'adventure', averageBudget: 1500, popularityScore: 76, activities: ['safari', 'hiking', 'wine tasting'], description: 'Where mountains meet the ocean.' },
  { name: 'Tokyo Metropolis', country: 'Japan', city: 'Tokyo', category: 'city', averageBudget: 1900, popularityScore: 93, activities: ['technology', 'shopping', 'nightlife'], description: 'Ultra-modern metropolis blending tradition and future.' },
  { name: 'Santorini Sunsets', country: 'Greece', city: 'Santorini', category: 'luxury', averageBudget: 2400, popularityScore: 87, activities: ['sunset views', 'wine', 'spa'], description: 'Iconic white and blue island in the Aegean Sea.' },
  { name: 'Phuket Island Life', country: 'Thailand', city: 'Phuket', category: 'beach', averageBudget: 800, popularityScore: 82, activities: ['beach', 'diving', 'nightlife'], description: "Thailand's largest island paradise." },
  { name: 'Machu Picchu Trek', country: 'Peru', city: 'Cusco', category: 'adventure', averageBudget: 1300, popularityScore: 79, activities: ['trekking', 'ruins', 'culture'], description: 'Legendary Inca citadel high in the Andes.' },
  { name: 'Barcelona Vibes', country: 'Spain', city: 'Barcelona', category: 'city', averageBudget: 1600, popularityScore: 88, activities: ['architecture', 'beach', 'nightlife'], description: 'Gaudi architecture meets Mediterranean beaches.' },
  { name: 'Serengeti Safari', country: 'Tanzania', city: 'Serengeti', category: 'nature', averageBudget: 2600, popularityScore: 74, activities: ['safari', 'wildlife', 'camping'], description: 'The great migration and endless plains.' },
  { name: 'Dubai Luxury Stay', country: 'UAE', city: 'Dubai', category: 'luxury', averageBudget: 3000, popularityScore: 89, activities: ['shopping', 'desert safari', 'skyscrapers'], description: 'Futuristic desert metropolis.' },
  { name: 'Marrakech Souks', country: 'Morocco', city: 'Marrakech', category: 'culture', averageBudget: 1000, popularityScore: 73, activities: ['souks', 'palaces', 'desert tours'], description: 'Vibrant imperial city at the gates of the Sahara.' },
  { name: 'Vancouver Wilderness', country: 'Canada', city: 'Vancouver', category: 'nature', averageBudget: 1500, popularityScore: 71, activities: ['mountains', 'kayaking', 'forests'], description: 'Where the city meets the rainforest.' },
  { name: 'Lisbon Old Town', country: 'Portugal', city: 'Lisbon', category: 'city', averageBudget: 1100, popularityScore: 77, activities: ['trams', 'food', 'viewpoints'], description: 'Hilly coastal capital full of charm.' },
  { name: 'Zanzibar Spice Coast', country: 'Tanzania', city: 'Zanzibar City', category: 'beach', averageBudget: 1000, popularityScore: 69, activities: ['beach', 'spice tours', 'diving'], description: 'Spice island with pristine beaches.' },
  { name: 'Swiss Alps Escape', country: 'Switzerland', city: 'Zermatt', category: 'adventure', averageBudget: 2500, popularityScore: 81, activities: ['skiing', 'hiking', 'cable cars'], description: 'Iconic alpine peaks and villages.' },
  { name: 'Bora Bora Paradise', country: 'French Polynesia', city: 'Bora Bora', category: 'luxury', averageBudget: 4000, popularityScore: 91, activities: ['overwater bungalows', 'diving', 'spa'], description: 'The ultimate honeymoon island.' },
  { name: 'Montreal Festival City', country: 'Canada', city: 'Montreal', category: 'city', averageBudget: 1000, popularityScore: 68, activities: ['festivals', 'food', 'history'], description: "North America's festival capital." },
];

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
  console.log('Seeding database...');

  await prisma.itineraryItem.deleteMany();
  await prisma.itinerary.deleteMany();
  await prisma.destination.deleteMany();
  await prisma.user.deleteMany();

  const destinationByName = {};
  for (const data of destinationsData) {
    const destination = await prisma.destination.create({ data });
    destinationByName[data.name] = destination;
  }

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
  const userByEmail = {};
  for (const data of usersData) {
    const user = await prisma.user.create({ data: { ...data, passwordHash } });
    userByEmail[data.email] = user;
  }

  // Alice: a past, completed beach trip (feeds the "similar to past" recommendation score)
  await prisma.itinerary.create({
    data: {
      userId: userByEmail['alice.martin@example.com'].id,
      title: 'Southeast Asia Beach Trip',
      description: 'A relaxing tour of Southeast Asian beaches.',
      startDate: new Date('2025-06-01'),
      endDate: new Date('2025-06-10'),
      status: 'COMPLETED',
      items: {
        create: [
          { destinationId: destinationByName['Bali Beaches'].id, date: new Date('2025-06-02'), notes: 'Surfing lesson in the morning', activities: ['surfing'] },
          { destinationId: destinationByName['Phuket Island Life'].id, date: new Date('2025-06-06'), notes: 'Island hopping', activities: ['boat tour'] },
        ],
      },
    },
  });

  // Bob: a past adventure trip
  await prisma.itinerary.create({
    data: {
      userId: userByEmail['bob.nguyen@example.com'].id,
      title: 'Andes Adventure',
      description: 'Trekking through Peru.',
      startDate: new Date('2025-03-10'),
      endDate: new Date('2025-03-18'),
      status: 'COMPLETED',
      items: {
        create: [
          { destinationId: destinationByName['Machu Picchu Trek'].id, date: new Date('2025-03-14'), notes: 'Sunrise hike', activities: ['trekking'] },
        ],
      },
    },
  });

  // Chloe: an upcoming, planned culture trip
  await prisma.itinerary.create({
    data: {
      userId: userByEmail['chloe.dubois@example.com'].id,
      title: 'European Culture Tour',
      description: 'Paris and Rome in two weeks.',
      startDate: new Date('2026-09-05'),
      endDate: new Date('2026-09-19'),
      status: 'PLANNED',
      shareToken: 'demo-share-chloe-europe',
      items: {
        create: [
          { destinationId: destinationByName['Paris City Break'].id, date: new Date('2026-09-06'), notes: 'Louvre + Eiffel Tower', activities: ['museum', 'sightseeing'] },
          { destinationId: destinationByName['Rome Ancient Wonders'].id, date: new Date('2026-09-13'), notes: 'Colosseum tour', activities: ['sightseeing'] },
        ],
      },
    },
  });

  console.log(`Seeded ${destinationsData.length} destinations, ${usersData.length} users, 3 itineraries.`);
  console.log(`Demo login password for every seeded user: ${DEMO_PASSWORD}`);
}

main()
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
