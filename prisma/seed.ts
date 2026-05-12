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
  await prisma.comment.deleteMany();
  await prisma.ingredient.deleteMany();
  await prisma.recipe.deleteMany();

  // il faut ajouter le domaine de l'image (ou juste les urls externes) dans next.config.ts pour que Next puisse les charger

  const recipesData = [
    {
      title: "Pâtes Carbonara",
      description: "La véritable recette italienne au pecorino et guanciale.",
      prepTime: 15,
      image: "https://images.unsplash.com/photo-1588013273468-315fd88ea34c?q=80&w=1738&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      instructions: "1. Cuire les pâtes... 2. Mélanger œufs et fromage... 3. Assembler avec le guanciale.",
      ingredients: {
        create: [
          { name: "Spaghetti", quantity: 400, unit: "g" },
          { name: "Guanciale", quantity: 150, unit: "g" },
          { name: "Jaunes d'œufs", quantity: 4, unit: "pcs" },
          { name: "Pecorino Romano", quantity: 50, unit: "g" },
        ]
      },
      comments: {
        create: [
          { content: "Une tuerie ! J'ai adoré.", rating: 5, author: "Karen" },
          { content: "Vraiment pas mal !", rating: 4, author: "Aziz" }
        ]
      }
      
    },
    {
      title: "Risotto aux Champignons",
      description: "Un classique crémeux aux saveurs de sous-bois.",
      prepTime: 35,
      image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?q=80&w=1000&auto=format&fit=crop",
      instructions: "Nacrer le riz. \nVerser le bouillon louche par louche. \nLier au parmesan.",
      ingredients: {
        create: [
          { name: "Riz", quantity: 300, unit: "g" },
          { name: "Champignons", quantity: 200, unit: "g" },
          { name: "Bouillon de légumes", quantity: 1, unit: "L" },
          { name: "Parmesan", quantity: 50, unit: "g" },
        ]
      },
      comments: {
        create: [
          { content: "Parfait pour une soirée cosy !", rating: 5, author: "Sophie" },
          { content: "Un peu trop salé à mon goût.", rating: 3, author: "Liam" }
        ]
      }
    },
    {
      title: "Quiche Lorraine",
      description: "Le grand classique de la cuisine française, onctueux et croustillant.",
      prepTime: 45,
      image: "https://images.unsplash.com/photo-1650844010413-3f24dc1c182b?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      instructions: "Préparer la pâte (œufs/crème). \nGarnir la pâte. \nEnfourner à 180°C.",
      ingredients: {
        create: [
          { name: "Pâte brisée", quantity: 1, unit: "pc" },
          { name: "Lardons fumés", quantity: 200, unit: "g" },
          { name: "Crème fraîche liquide", quantity: 20, unit: "cl" },
          { name: "Œufs", quantity: 3, unit: "pcs" },
        ]
      },
      comments: {
        create: [
          { content: "JE NE RECOMMANDE PAS ! AFFREUX !", rating: 1, author: "Dane" },
          { content: "Très bon, mais un peu trop gras pour moi.", rating: 4, author: "Jean" }
        ]
      }
    },
    {
      title: "Poulet à la Moambe",
      description: "Plat national congolais onctueux à base de noix de palme.",
      prepTime: 60,
      image: "https://images.unsplash.com/photo-1764304733301-3a9f335f0c67?q=80&w=1450&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      instructions: "1. Faire dorer le poulet. \nMijoter dans la sauce moambe. \nServir avec du riz ou fufu.",
      ingredients: {
        create: [
          { name: "Poulet", quantity: 500, unit: "g" },
          { name: "Noix de palme", quantity: 100, unit: "g" },
          { name: "Tomates", quantity: 200, unit: "g" },
          { name: "Oignons", quantity: 100, unit: "g" },
        ]
      },
      comments: {
        create: [
          { content: "Un voyage culinaire en Afrique !", rating: 5, author: "Amina" },
          { content: "Pas mal, mais je préfère le poulet yassa.", rating: 4, author: "David" },
          { content: "Je n'ai pas du tout aimé, la sauce était trop grasse.", rating: 2, author: "Sophie" },
          { content: "Une révélation ! Je n'avais jamais goûté ça avant.", rating: 5, author: "Omar" }
        ]
      }
    },
    {
      title: "Liboke de Poisson",
      description: "Poisson mariné et cuit en papillote dans des feuilles de bananier.",
      prepTime: 40,
      image: "https://images.unsplash.com/photo-1723744910399-6fa2951a68b5?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      instructions: "Mariner le poisson. \nEmballer hermétiquement. \nCuire à la vapeur ou braise.",
      ingredients: {
        create: [
          { name: "Poisson (Capitaine)", quantity: 600, unit: "g" },
          { name: "Feuilles de bananier", quantity: 2, unit: "pcs" },
          { name: "Citron vert", quantity: 2, unit: "pcs" },
          { name: "Oignon rouge", quantity: 1, unit: "pc" },
        ]
      },
      comments: {
        create: [
          { content: "Délicieux et parfumé !", rating: 5, author: "Isabelle" },
        ]
      }
    },
    {
      title: "Bokit Poulet Boucané",
      description: "Le célèbre sandwich antillais frit, garni de poulet fumé.",
      prepTime: 30,
      image: "https://images.unsplash.com/photo-1667506999146-805370d013f4?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      instructions: "Frire la pâte à bokit. \nEffilocher le poulet. \nAjouter la sauce chien.",
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
      image: "https://images.unsplash.com/photo-1667506997090-5e5ffc128711?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      instructions: "Mariner la viande au citron. \nFaire roussir avec les épices. \n Mijoter.",
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
      image: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?q=80&w=1466&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      instructions: "Préparer la graine. \nCuire le poisson dans le bouillon. \nServir chaud.",
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
      image: "https://images.unsplash.com/photo-1542895364-1f38d277f031?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      instructions: "Griller les merguez. \nFaire réduire la sauce tomate. \nPocher les œufs.",
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

  console.log('Seeding terminé : 9 recettes créées !');
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })