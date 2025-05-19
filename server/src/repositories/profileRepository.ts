import { literal, Op, QueryTypes, Transaction, where } from "sequelize";
import database from "../config/database";
import { models } from "../models";
import IInterest from "../models/interfaces/Profile/IInterests";
import IProfile from "../models/interfaces/Profile/IProfile";
import IProfileDB from "../models/interfaces/Profile/IProfileDB";
import { Profile } from "../models/Profile";
import sequelize from "../config/sequalize";

export class profileRepository {
  //CREATE
  static async createProfile(data: IProfile, id: number, transaction: Transaction): Promise<number> {
    console.log("createProfile", data);
    const profile = await models.Profile.create({
      name: data.name,
      age: data.age,
      info: data.info,
      country: data.country,
      city: data.city,
      user_id: id
    }, { transaction })

    console.log("createProfile result:", profile);

    return profile.id;
  }

  static async createInterests(
    profileId: number,
    interest: string, 
    transaction: Transaction
  ): Promise<void> {
    console.log("createInterests", profileId, interest);
    const foundInterest = await models.Interests.findOne({
      where: {
        interest: interest
      }
    })

    if (!foundInterest) {
      throw new Error("Profile not found for user");
    }

    const plainInterest = foundInterest?.get({ plain: true });

    await models.UserInterest.create({
      profile_id: profileId,
      interest_id: plainInterest.id
    }, {transaction})
  }

  static async createPicture(
    profileId: number,
    picture: string,
    transaction: Transaction
  ): Promise<number> {
    console.log("createPicture", profileId, picture);

    const createdPicture = await models.Picture.create({
      profile_id: profileId,
      picture_url: picture
    }, {transaction})

    return createdPicture.id;
  }

  //READ
  static async getProfile(id: number): Promise<Profile | null> {
    console.log("getProfile", id);
    const profile = await models.Profile.findOne({
      where: { user_id: id },
      attributes: [
        'id', 'name', 'age', 'info', 'country', 'city', 'user_id',
      ],
      include: [
        {
          model: models.Interests,
          required: false,
          include: [
            {
              model: models.Category
            },
          ]
        },
        {
          model: models.Picture,
          required: false
        }
      ]
    })

    return profile;
  }

  static async getProfiles(limit: number, offset: number, id: number) {
    console.log("getProfiles", id, limit);

    const profileIds = await Profile.findAll({
      attributes: ['id'],
      where: {
        user_id: { [Op.ne]: id },
        id: {
          [Op.notIn]: literal(`(
            SELECT first_partner FROM match WHERE first_partner = ${id} OR second_partner = ${id}
            UNION
            SELECT second_partner FROM match WHERE first_partner = ${id} OR second_partner = ${id}
          )`)
        }
      },
      limit,
      offset,
      raw: true
    });

    const fullProfiles = await Profile.findAll({
      where: { id: profileIds.map(p => p.id) },
      include: [
        {
          model: models.Interests,
          include: [{ model: models.Category, required: false }],
          required: false
        },
        { model: models.Picture, required: false },
      ]
    });

    console.log("profilesprofilesprofiles", fullProfiles)

    return fullProfiles
  }

  static async getProfilesByInterest(
    limit: number,
    offset: number,
    id: number,
    interests: string[]
  ) {
    console.log("REPOS",id,interests )
    const profiles = await Profile.findAll({
      where: {
        user_id: { [Op.ne]: id },
        id: {
          [Op.notIn]: literal(`(
            SELECT first_partner FROM match WHERE first_partner = ${id} OR second_partner = ${id}
            UNION
            SELECT second_partner FROM match WHERE first_partner = ${id} OR second_partner = ${id}
          )`)
        }
      },
      include: [
        {
          model: models.Interests,
          where: {
            interest: { [Op.in]: interests },
          },
          through: { attributes: [] },
          include: [
            {
              model: models.Category,
              required: false
            }
          ],
          required: true
        },
        {
          model: models.Picture,
          required: false
        }
      ],
      limit,
      offset,
      subQuery: false,
      distinct: true
    } as any);

    console.log("KJGHKJLHJ", profiles)

    return profiles;
  }

  //UPDATE
  static async updateProfile(
    id: number,
    data: IProfile,
    transaction: Transaction
  ): Promise<boolean> {
    console.log("updateProfile", id, data);
    const updatedProfile = await models.Profile.update({
      name: data.name,
      age: data.age,
      info: data.info,
      country: data.country,
      city: data.city,
    }, {
      where: {
        user_id: id
      },
      transaction
    })

    console.log("updateProfile result", updatedProfile);

    return Boolean(updatedProfile[0]);
  }

  static async updateInterests(
    profileId: number,
    interests: IInterest[],
    transaction: Transaction
  ): Promise<void> {
    console.log("updateInterests", profileId, interests);

    await models.UserInterest.destroy({
      where: {
        profile_id: profileId
      }, 
      transaction
    })

    for (const interest of interests) {
      await this.createInterests(profileId, interest.interest, transaction);
    }
  }

  static async updatePicture(
    profileId: number,
    picture: string,
    transaction: Transaction
  ): Promise<void> {
    console.log("updatePicture", profileId, picture);

    await models.Picture.destroy({
      where: {
        profile_id: profileId
      }, 
      transaction
    })

    await this.createPicture(profileId, picture, transaction);
  }

  //DELETE
  static async deleteProfile(id: number, transaction: Transaction): Promise<number> {
    console.log("deleteProfile", id);

    const deletedProfile = await models.Profile.destroy({
      where: {
        user_id: id 
      },
      transaction
    })

    return deletedProfile;
  }
}
