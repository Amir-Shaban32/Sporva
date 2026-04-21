import { userRepository } from "../repositories";
import { hashPassword } from "../utils/password";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

const seedAdmin = async () => {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error("Missing ADMIN_EMAIL or ADMIN_PASSWORD in environment");
    process.exit(1);
  }

  const existing = await userRepository.findAdmin();
  if (existing) {
    console.log("Admin already exists, skipping.");
    process.exit(0);
  }

  const hashedPassword = await hashPassword(ADMIN_PASSWORD);
  await userRepository.create({
    username: "Super Admin",
    email: ADMIN_EMAIL,
    password: hashedPassword,
    role: "ADMIN",
  });

  console.log("Admin created successfully");
  process.exit(0);
};

seedAdmin().catch((err) => {
  console.error("Failed to seed admin:", err);
  process.exit(1);
});
