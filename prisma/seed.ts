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
  console.log('Suppression des anciennes données...');
  await prisma.ingredient.deleteMany();
  await prisma.recipe.deleteMany();

  // il faut ajouter le domaine de l'image (ou juste les urls externes) dans next.config.ts pour que Next puisse les charger

  const recipesData = [
    {
      title: "Pâtes Carbonara",
      description: "La véritable recette italienne au pecorino et guanciale.",
      prepTime: 15,
      coverImage: "https://images.unsplash.com/photo-1612874742237-6526221588e3?q=80&w=1000&auto=format&fit=crop",
      instructions: "1. Cuire les pâtes... 2. Mélanger œufs et fromage... 3. Assembler avec le guanciale.",
      ingredients: {
        create: [
          { name: "Spaghetti", quantity: 400, unit: "g" },
          { name: "Guanciale", quantity: 150, unit: "g" },
          { name: "Jaunes d'œufs", quantity: 4, unit: "pcs" },
          { name: "Pecorino Romano", quantity: 50, unit: "g" },
        ]
      }
    },
    {
      title: "Risotto aux Champignons",
      description: "Un classique crémeux aux saveurs de sous-bois.",
      prepTime: 35,
      coverImage: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?q=80&w=1000&auto=format&fit=crop",
      instructions: "1. Nacrer le riz... 2. Verser le bouillon louche par louche... 3. Lier au parmesan.",
      ingredients: {
        create: [
          { name: "Riz", quantity: 300, unit: "g" },
          { name: "Champignons", quantity: 200, unit: "g" },
          { name: "Bouillon de légumes", quantity: 1, unit: "L" },
          { name: "Parmesan", quantity: 50, unit: "g" },
        ]
      }
    },
    {
      title: "Quiche Lorraine",
      description: "Le grand classique de la cuisine française, onctueux et croustillant.",
      prepTime: 45,
      coverImage: "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?q=80&w=1000&auto=format&fit=crop",
      instructions: "1. Préparer l'appareil (œufs/crème)... 2. Garnir la pâte... 3. Enfourner à 180°C.",
      ingredients: {
        create: [
          { name: "Pâte brisée", quantity: 1, unit: "pc" },
          { name: "Lardons fumés", quantity: 200, unit: "g" },
          { name: "Crème fraîche liquide", quantity: 20, unit: "cl" },
          { name: "Œufs", quantity: 3, unit: "pcs" },
        ]
      }
    },
    {
      title: "Poulet à la Moambe",
      description: "Plat national congolais onctueux à base de noix de palme.",
      prepTime: 60,
      coverImage: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=1000&auto=format&fit=crop",
      instructions: "1. Faire dorer le poulet... 2. Mijoter dans la sauce moambe... 3. Servir avec du riz ou fufu.",
      ingredients: {
        create: [
          { name: "Poulet", quantity: 500, unit: "g" },
          { name: "Noix de palme", quantity: 100, unit: "g" },
          { name: "Tomates", quantity: 200, unit: "g" },
          { name: "Oignons", quantity: 100, unit: "g" },
        ]
      }
    },
    {
      title: "Liboke de Poisson",
      description: "Poisson mariné et cuit en papillote dans des feuilles de bananier.",
      prepTime: 40,
      coverImage: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=1000&auto=format&fit=crop",
      instructions: "1. Mariner le poisson... 2. Emballer hermétiquement... 3. Cuire à la vapeur ou braise.",
      ingredients: {
        create: [
          { name: "Poisson (Capitaine)", quantity: 600, unit: "g" },
          { name: "Feuilles de bananier", quantity: 2, unit: "pcs" },
          { name: "Citron vert", quantity: 2, unit: "pcs" },
          { name: "Oignon rouge", quantity: 1, unit: "pc" },
        ]
      }
    },
    {
      title: "Bokit Poulet Boucané",
      description: "Le célèbre sandwich antillais frit, garni de poulet fumé.",
      prepTime: 30,
      coverImage: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1000&auto=format&fit=crop",
      instructions: "1. Frire la pâte à bokit... 2. Effilocher le poulet... 3. Ajouter la sauce chien.",
      ingredients: {
        create: [
          { name: "Pâte à bokit", quantity: 1, unit: "pc" },
          { name: "Poulet", quantity: 500, unit: "g" },
          { name: "Sauce chien", quantity: 100, unit: "ml" },
        ]
      }
    },
    {
      title: "Colombo de Porc",
      description: "Un ragoût épicé emblématique des Antilles aux saveurs douces.",
      prepTime: 90,
      coverImage: "https://images.unsplash.com/photo-1544124499-58912cbddaad?q=80&w=1000&auto=format&fit=crop",
      instructions: "1. Mariner la viande au citron... 2. Faire roussir avec les épices... 3. Mijoter.",
      ingredients: {
        create: [
          { name: "Échine de porc", quantity: 1, unit: "kg" },
          { name: "Poudre à colombo", quantity: 4, unit: "c.à.s" },
          { name: "Pommes de terre", quantity: 3, unit: "pcs" },
          { name: "Graine de bois d'Inde", quantity: 1, unit: "pincée" },
        ]
      }
    },
    {
      title: "Couscous au Poisson",
      description: "Spécialité tunisienne parfumée au cumin et au piment.",
      prepTime: 70,
      //coverImage: "https://images.unsplash.com/photo-1585937421612-70a0f2455f75?q=80&w=1000&auto=format&fit=crop",
      instructions: "1. Préparer la graine... 2. Cuire le poisson dans le bouillon... 3. Servir chaud.",
      ingredients: {
        create: [
          { name: "Couscous", quantity: 300, unit: "g" },
          { name: "Poisson", quantity: 500, unit: "g" },
          { name: "Bouillon de poisson", quantity: 1, unit: "L" },
          { name: "Persil", quantity: 1, unit: "botte" },
        ]
      }
    },
    {
      title: "Ojja aux Merguez",
      description: "Une poêlée de tomates, poivrons et œufs, pimentée à l'harissa.",
      prepTime: 20,
      coverImage: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?q=80&w=1000&auto=format&fit=crop",
      instructions: "1. Griller les merguez... 2. Faire réduire la sauce tomate... 3. Pocher les œufs.",
      ingredients: {
        create: [
          { name: "Merguez", quantity: 200, unit: "g" },
          { name: "Tomates", quantity: 200, unit: "g" },
          { name: "Poivrons", quantity: 100, unit: "g" },
          { name: "Œufs", quantity: 3, unit: "pcs" },
        ]
      }
    }
  ];

  for (const data of recipesData) {
    await prisma.recipe.create({ data });
  }

  console.log('Seeding terminé : 9 recettes internationales créées !');
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })