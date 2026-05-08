import { userRepository } from "@domains/user/user.repository";
import { hashPassword } from "@shared/utils/password";
import { logger, env } from "@shared/config";

const seedAdmin = async () => {
  const existing = await userRepository.findAdmin();
  if (existing) {
    logger.warn("Admin already exists, skipping.");
    process.exit(0);
  }

  const hashedPassword = await hashPassword(env.ADMIN_PASSWORD);
  await userRepository.create({
    username: "Super Admin",
    email: env.ADMIN_EMAIL,
    password: hashedPassword,
    role: "ADMIN",
  });

  logger.info("Admin created successfully");
  process.exit(0);
};

seedAdmin().catch((err) => {
  logger.error("Failed to seed admin:", err);
  process.exit(1);
});
