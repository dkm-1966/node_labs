import database from "../config/database";
import fs from "fs/promises";
import path from "path";

import { IUser } from "../models/interfaces/User/IUser";

const filePath = path.join(__dirname, "../data/users.json");


export interface IUserWithId extends IUser {
  id: number;
}

export default class userRepository {
  static async createUser(data: IUser): Promise<number> {
    const users: IUserWithId[] = await this.readUsers();

    const newUser: IUserWithId = {
      id: users.length ? users[users.length - 1].id + 1 : 1,
      ...data,
    };

    users.push(newUser);
    await this.writeUsers(users);

    await this.createUserDB(data);

    return newUser.id;
  }

  static async getUserByEmail(email: string): Promise<IUserWithId | undefined> {
    const users: IUserWithId[] = await this.readUsers();
    return users.find((u) => u.email === email);
  }

  private static async readUsers(): Promise<IUserWithId[]> {
    try {
      const data = await fs.readFile(filePath, "utf-8");
      return JSON.parse(data) as IUserWithId[];
    } catch (err) {
      console.error("Error reading users.json", err);
      return [];
    }
  }

  private static async writeUsers(users: IUserWithId[]): Promise<void> {
    try {
      await fs.writeFile(filePath, JSON.stringify(users, null, 2), "utf-8");
    } catch (err) {
      console.error("Error writing users.json", err);
    }
  }

  private static async createUserDB(data: IUser): Promise<number> {
    const query = `INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id`;
    const values = [data.email, data.password];
    const result = await database.query(query, values);

    return result.rows[0].id;
  }
}
