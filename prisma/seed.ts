import { PrismaClient, DegreeType } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not defined in .env file');
}

// Set up pg connection pool and Prisma driver adapter
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding Neon database...');

  // Clear existing records
  await prisma.cutoff.deleteMany();
  await prisma.course.deleteMany();
  await prisma.placement.deleteMany();
  await prisma.review.deleteMany();
  await prisma.college.deleteMany();

  // 1. NIT Agartala
  await prisma.college.create({
    data: {
      name: 'National Institute of Technology Agartala',
      slug: 'nit-agartala',
      description: 'A premier public technical and research university located in Agartala, Tripura.',
      city: 'Agartala',
      state: 'Tripura',
      nirfRank: 91,
      accreditation: 'NAAC A+',
      avgRating: 4.3,
      totalReviews: 128,
      courses: {
        create: [
          {
            title: 'Computer Science and Engineering',
            type: DegreeType.BACHELORS,
            duration: 4,
            tuitionFee: 550000,
            cutoffs: {
              create: [
                { examName: 'JEE Main', year: 2025, category: 'General', openingRank: 12000, closingRank: 19500 },
                { examName: 'JEE Main', year: 2025, category: 'OBC', openingRank: 5000, closingRank: 7200 },
              ],
            },
          },
          {
            title: 'Electronics and Communication Engineering',
            type: DegreeType.BACHELORS,
            duration: 4,
            tuitionFee: 550000,
            cutoffs: {
              create: [
                { examName: 'JEE Main', year: 2025, category: 'General', openingRank: 20000, closingRank: 28000 },
              ],
            },
          },
        ],
      },
      placements: {
        create: {
          year: 2025,
          highestPackage: 52.0,
          avgPackage: 11.5,
          medianPackage: 9.0,
          placementRate: 88.5,
        },
      },
      reviews: {
        create: [
          { author: 'Rahul Sharma', rating: 5, comment: 'Great campus life and strong CSE placements.' },
          { author: 'Priya Verma', rating: 4, comment: 'Good infrastructure and faculty.' },
        ],
      },
    },
  });

  // 2. IIT Bombay
  await prisma.college.create({
    data: {
      name: 'Indian Institute of Technology Bombay',
      slug: 'iit-bombay',
      description: 'One of the top autonomous public technical universities located in Powai, Mumbai.',
      city: 'Mumbai',
      state: 'Maharashtra',
      nirfRank: 3,
      accreditation: 'NAAC A++',
      avgRating: 4.8,
      totalReviews: 450,
      courses: {
        create: [
          {
            title: 'Computer Science and Engineering',
            type: DegreeType.BACHELORS,
            duration: 4,
            tuitionFee: 800000,
            cutoffs: {
              create: [
                { examName: 'JEE Advanced', year: 2025, category: 'General', openingRank: 1, closingRank: 68 },
              ],
            },
          },
        ],
      },
      placements: {
        create: {
          year: 2025,
          highestPackage: 120.0,
          avgPackage: 23.5,
          medianPackage: 18.0,
          placementRate: 96.0,
        },
      },
      reviews: {
        create: [
          { author: 'Aman Gupta', rating: 5, comment: 'World class research and unmatched peer group.' },
        ],
      },
    },
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });