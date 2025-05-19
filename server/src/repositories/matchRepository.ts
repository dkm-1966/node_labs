import { Op, Transaction } from "sequelize";
import { models } from "../models";
import { Profile } from "../models/Profile";

export default class MatchRepository {
  //READ
  static async getMatchesProfiles(id: number): Promise<Profile[] | []> {
    const matches = await models.Profile.findAll({
      include: [
        {
          model: models.Match,
          as: "MatchesAsFirst",
          required: false,
          where: {
            second_partner: id,
            status: "match",
          },
        },
        {
          model: models.Match,
          as: "MatchesAsSecond",
          required: false,
          where: {
            first_partner: id,
            status: "match",
          },
        },
        {
          model: models.Picture,
          required: false,
        },
        {
          model: models.Interests,
          required: false,
          include: [
            {
              model: models.Category,
              required: false,
            },
          ],
        },
      ],
      where: {
        [Op.or]: [
          { "$MatchesAsFirst.second_partner$": id },
          { "$MatchesAsSecond.first_partner$": id },
        ],
      },
    });
    return matches;
  }

  static async getLikedProfiles(id: number): Promise<Profile[] | []> {
    const likes = models.Profile.findAll({
      include: [
        {
          model: models.Match,
          as: "MatchesAsFirst",
          where: {
            [Op.and]: {
              second_partner: id,
              [Op.not]: {
                first_partner: id,
              },
            },
            status: "pending",
          },
        },
        {
          model: models.Interests,
          required: false,
          include: [
            {
              model: models.Category,
              required: false,
            },
          ],
        },
        {
          model: models.Picture,
          required: false,
        },
      ],
    });
    return likes;
  }

  //CREATE
  static async createMatch(id: number, partnerId: number, transaction: Transaction): Promise<number> {
    const firstProfile = await models.Profile.findOne({
      where: {
        user_id: id,
      },
    });

    const plainProfile = firstProfile?.get({ plain: true });

    if (!plainProfile) {
      throw new Error("Profile not found for user");
    }

    const match = await models.Match.create({
      first_partner: plainProfile.id,
      second_partner: partnerId,
      status: "pending"
    }, {transaction});

    return match.id;
  }

  //UPDATE
  static async updateMatch(id: number, partnerId: number, transaction: Transaction): Promise<boolean> {
    console.log("Updating match")
    const updatedMatch = await models.Match.update(
      {
        status: "match",
      },
      {
        where: {
          first_partner: partnerId,
          second_partner: id,
        },
        transaction
      }
    );
    console.log("updatedMatch", updatedMatch);

    return Boolean(updatedMatch);
  }
}
