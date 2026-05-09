/* eslint-disable */
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'


const pool = new pg.Pool({ 
  connectionString: process.env.DATABASE_URL 
})

const adapter = new PrismaPg(pool)

const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Début du seeding avec images...')

  const recipe = await prisma.recipe.create({
    data: {
      title: "Pâtes carbonara",
      description: "Une recette classique italienne de pâtes à la carbonara, simple et délicieuse.",
      instructions: "1. Faites cuire les pâtes dans une grande casserole d'eau bouillante salée jusqu'à ce qu'elles soient al dente. Égouttez-les en réservant un peu d'eau de cuisson.\n2. Pendant ce temps, faites revenir les lardons dans une poêle jusqu'à ce qu'ils soient croustillants. Retirez-les de la poêle et réservez.\n3. Dans un bol, battez les œufs avec",
      prepTime: 15,
      image: "/recipes/carbonara/main.jpg",
      coverImage: "/recipes/carbonara/cover.jpg",
      ingredients: {
        create: [
          { name: "Pâtes", quantity: 200, unit: "g" },
          { name: "Œufs", quantity: 3, unit: "pcs" },
          { name: "Pecorino", quantity: 50, unit: "g" }
        ]
      }
    }
  })

  console.log('Recette créée avec succès !')
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })