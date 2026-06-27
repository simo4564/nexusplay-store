const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  await prisma.game.createMany({
    data: [
      {
        title: "Neon Overdrive",
        description: "A fast-paced sci-fi anti-gravity racing game with stunning neon tracks and high octane action.",
        price: 39.99,
        imageUrl: "/images/sci_fi_racing_game.jpg",
        genre: "Racing",
        releaseDate: new Date("2026-10-15"),
        developer: "Velocity Studios"
      },
      {
        title: "Dragon's Fall",
        description: "An epic dark fantasy RPG where you battle massive dragons in ruined gothic landscapes.",
        price: 59.99,
        imageUrl: "/images/dark_fantasy_rpg.jpg",
        genre: "RPG",
        releaseDate: new Date("2026-08-20"),
        developer: "Mythic Forge"
      },
      {
        title: "Cyber City 2088",
        description: "Explore a neon-lit cyberpunk city, uncover secrets, and survive in this stunning open-world adventure.",
        price: 49.99,
        imageUrl: "/images/hero_cyberpunk_game.jpg",
        genre: "Action Adventure",
        releaseDate: new Date("2027-01-10"),
        developer: "FutureVision Games"
      }
    ]
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
