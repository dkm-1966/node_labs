import { Transaction } from "sequelize";
import { IUser } from "../models/interfaces/User/IUser";
import { User } from "../models/User";

export interface IUserWithId extends IUser {
  id: number;
}

export default class userRepository {
  static async createUser(data: IUser, transaction: Transaction): Promise<number> {
    const user = await User.create({
      email: data.email,
      password: data.password,
    }, {transaction});

    return user.id;
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    const user = await User.findOne({
      where: { email },
    });

    return user;
  }
}
