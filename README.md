This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Clerk authentication setup

# Install Clerk SDK inside your project

npm install @clerk/nextjs

In the layout.ts file in the app folder inside use this <ClerkProvider> provider given by clerk and Wrap your Html inside the provider

# Create .env file in the root folder

To store secret keys include this in .gitignore for not exposing the keys

Create clear account to generate api keys

Get the

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY

from you account and paste it into the .env file you created.

# Create a proxy.ts file in the root folder

For preventing the users from unAuthorized routes

Get the clerkMiddleware() code from clerk and paste it to the proxy.ts file.

# Create one folder auth for sign-in and sign-up pages

Inside auth create one folder sign-in inside the sign-in create one folder [[...sign-in]] for manage all routes for sign-in

Do the same steps for sign-up also.

## Prisma setup

# npm install prisma --save-dev

# npm prisma init

👆 this will create a prisma folder inside your project.

Go to vercel and login with your accout then go to the storage

Then click on create database choose postgres as the database and create it.

Open the database you created copy the

datasource db {
provider = "postgresql"
}

from the quickstart and paste it to the schema.prisma insdide the prisma folder.

Again copy these

DATABASE_URL
POSTGRES_URL
PRISMA_DATABASE_UR

keys from the .env.local tab in the same quickstart section then paste in on your .evn file.

Create tables inside the schema.prisma file

modals --> tables are defined

After creating modals run this commad

# npx prisma migrate dev

Enter the name for the new migration: init db

init db is the name of our db folder if you check you know

👆 this will create a migrations folder inside your prisma folder to migrate the modals you created.
It contains the db query you defined.

# npx prisma studio

👆 this will create a port to see our databases like localhost: 121212 you can chek on the port
