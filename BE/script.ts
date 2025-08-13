import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

async function main() {
  // Example: Fetch all users
  const users = await prisma.user.findMany()
  console.log(users)

  // Example: Create a new user
  const newUser = await prisma.user.create({
    data: {
      name: "John abc",
      email: "john.doe111@example.com",
      password: "securePassword123",
      phone: "123-456-7890123",
      address: "123 Main Street"
    }
  })
  console.log("Created new user:", newUser)}
  main()
    .catch(e => {
    console.error(e.message)
    process.exit(1)
  })
    .finally(async () => {
        await prisma.$disconnect()
    })
