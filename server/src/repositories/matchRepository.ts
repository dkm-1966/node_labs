import { col, fn, literal, Sequelize } from "sequelize";
import { Op } from "sequelize";
import database from "../config/database";

export default class MatchRepository {
  //READ
  static async getMatchesProfiles(id: number) {
    const query = `SELECT 
                    profile.id, 
                    profile.name, 
                    profile.age, 
                    profile.info, 
                    profile.country, 
                    profile.city, 
                    match.status,
                    picture.picture_url
                  FROM profile
                  JOIN match 
                  ON (
                    (match.first_partner = profile.id AND match.second_partner = $1) OR 
                    (match.second_partner = profile.id AND match.first_partner = $1)
                  )
                  AND match.status = 'match'
                  LEFT JOIN picture ON picture.profile_id = profile.id
                  `;
    const values = [id];
    const result = await database.query(query, values);
    console.log("default sql:", result.rows);
    return result.rows;
  }

  static async getLikedProfiles(id: number) {
    const query = `SELECT 
                    profile.id, 
                    profile.name, 
                    profile.age, 
                    profile.info, 
                    profile.country, 
                    profile.city, 
                    match.status,
                    picture.picture_url
                  FROM match
                  JOIN profile ON profile.id = match.first_partner
                  LEFT JOIN picture ON picture.profile_id = profile.id
                  WHERE match.second_partner = $1 AND match.status = 'pending'
        `;
    const values = [id];
    const result = await database.query(query, values);
    return result.rows;
  }

  //Creating new match
  static async createMatch(id: number, partnerId: number) {
    const query = `INSERT INTO match (first_partner, second_partner, status)
                      VALUES ((SELECT id FROM profile WHERE user_id = $1), $2, 'pending')
        `;

    const values = [id, partnerId];
    const result = await database.query(query, values);

    return result.rows[0];
  }

  //UPDATE
  static async updateMatch(id: number, partnerId: number) {
    const query = `UPDATE match SET status = 'match' 
                        WHERE first_partner = $2 AND second_partner = $1
                        RETURNING match.id
        `;
    const values = [id, partnerId];
    const result = await database.query(query, values);

    return result.rows[0];
  }
}
