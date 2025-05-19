import { Transaction } from "sequelize";
import database from "../config/database";
import sequelize from "../config/sequalize";
import { userDto } from "../dto/profileDto";
import IInterest from "../models/interfaces/Profile/IInterests";
import IProfile from "../models/interfaces/Profile/IProfile";
import { profileRepository } from "../repositories/profileRepository";

export default class userService {
  static async create(data: IProfile, id: number): Promise<number | undefined> {
    const t = await sequelize.transaction();
    try {
      console.log("DATA", data)
      const profileId = await profileRepository.createProfile(data, id, t);
      if (data.picture_url) {
        await this.createPicture(profileId, data.picture_url, t)
      }

      if(data.interests && data.interests.length > 0) {
        await this.createInterests(profileId, data.interests, t)
      }

      await t.commit();

      return profileId;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  static async createPicture(id: number, picture_url: string, transaction: Transaction): Promise<number> {
    if (!picture_url) {
      throw new Error("Provide picture_url")
    } else if (!id) {
      throw new Error("Provide id")
    }

    try {
      const picture_id = await profileRepository.createPicture(id, picture_url, transaction);

      return picture_id;
    }catch (error) {
      throw error;
    }
  }

  static async createInterests(id: number, interests: IInterest[], transaction: Transaction): Promise<void> {
    try {
      for (const interest of interests) {
        await profileRepository.createInterests(id, interest.interest, transaction);
      }
    }catch (error) {
      throw error;
    }
  }

  static async get(id: number): Promise<userDto | undefined> 
  {
    if (!id) {
      throw new Error("User ID is required");
    }

    const userFromDb = await profileRepository.getProfile(id);
    if (!userFromDb) {
      throw new Error("User not found");
    }

    console.log("found user in service:", userFromDb)

    const user = new userDto(userFromDb)
    return user;
  }

  static async update(id: number, data: IProfile): Promise<boolean> {
    const t = await sequelize.transaction();
    try {
      console.log("Finding user with id:", id)
      const result = await profileRepository.updateProfile(id, data, t);
      const user = await this.get(id);
      console.log("Found user:", user)
      
      if (user?.interests?.length === 0 && data.interests && data.interests.length > 0) {
          console.log("creating interests first time")
          await this.createInterests(user.id, data.interests, t);
      } else if (user && data.interests) {
        await profileRepository.updateInterests(user.id, data.interests, t);
      }

      if (user?.picture_url === null  && data.picture_url) {
        await this.createPicture(user.id, data.picture_url, t)
      } else if(user && data.picture_url) {
        await profileRepository.updatePicture(user.id, data.picture_url, t);
      }

      await t.commit();
      return result;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  static async delete(id: number): Promise<number | undefined> {
    const t = await sequelize.transaction();
    try {
      const result = await profileRepository.deleteProfile(id, t);
      await t.commit();

      return result;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }
}
