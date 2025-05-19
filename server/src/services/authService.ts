import database from "../config/database";
import sequelize from "../config/sequalize";
import userRepository from "../repositories/userRepository";

export class AuthService {
  static async register(email: string, password: string): Promise<number | null> {
    const t = await sequelize.transaction();
    try {
      const candidate = await userRepository.getUserByEmail(email);

      if(candidate) {
        return null;
      }
      
      const userId = await userRepository.createUser({ email, password }, t);
      await t.commit();

      return userId;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  static async login(email: string, password: string): Promise<number> {
    const user = await userRepository.getUserByEmail(email);
    
    if (!user) {
      throw new Error("User not found");
    }

    if (user.password !== password) {
      throw new Error("Invalid password");
    }

    return user.id;
  }
}
