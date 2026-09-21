import { getUserByEmail } from "@/server/repositories/user.repository";
import { verifyPassword } from "@/lib/security/password";

export async function loginAdmin(email: string, password: string) {
  const user = await getUserByEmail(email);

  if (!user) {
    return null;
  }

  const isValid = await verifyPassword(user.passwordHash, password);

  if (!isValid) {
    return null;
  }

  if (user.role !== "ADMIN") {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}