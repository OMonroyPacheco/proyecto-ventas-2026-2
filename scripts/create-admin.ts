import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("Admin123456", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Administrador",
      email: "admin@empresa.com",
      password,
      role: "admin",
    },
  });

  console.log("Admin creado:", admin.email);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });