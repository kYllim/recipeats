Recipeats 
Application anonyme 

🛠 Stack Technique
Framework : Next.js 15 (App Router)

Langage : TypeScript

ORM : Prisma 7.8.0 (Driver Adapters activés)

Base de données : PostgreSQL (via Docker)

Runtime : Node.js v24+ (ESM natif)

🚀 Installation et Lancement
1. Pré-requis
Docker Desktop (lancé)

Node.js v24 ou supérieur

2. Configuration
Créez un fichier .env à la racine du projet :

Extrait de code
```bash
DB_USER=recipe_admin
DB_PASSWORD=dev_password_9070
DB_NAME=recipeats_prod

DATABASE_URL="postgresql://recipe_admin:dev_password_9070@localhost:5432/recipeats_prod?schema=public"
```
3. Lancement de l'infrastructure
Démarrez le conteneur PostgreSQL :

```Bash
docker-compose up -d
```

4. Initialisation de la Base de Données
Installez les dépendances, générez le client Prisma et synchronisez le schéma :

```Bash
npm install
npx prisma generate
npx prisma db push
```

5. Remplissage des données (Seed)
Utilisez le raccourci configuré pour injecter les données de test (Carbonara, etc.) :

```Bash
npm run seed
```

6. Lancement du serveur de développement
```Bash
npm run dev
```

Accédez à l'application sur http://localhost:3000.