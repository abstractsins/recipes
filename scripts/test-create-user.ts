// scripts/test-create-user.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const newUser = await prisma.user.create({
    data: {
      email: "test2@example.com",
      password: "supersecurepassword", // In real apps, hash this
      nickname: "Tester2",
      lastLogin: new Date(),
    },
  })

  console.log("✅ Created user:", newUser)
}

main()
  .catch((e) => {
    console.error("❌ Error creating user:", e)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
