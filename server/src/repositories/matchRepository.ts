import { col, fn, literal, Sequelize } from "sequelize";
import { Op } from "sequelize";
import database from "../config/database";

export default class MatchRepository {
  //READ
  static async getMatchesProfiles(id: number) {
    const query = `SELECT p.*, 
                    ARRAY_AGG(DISTINCT jsonb_build_object(
                                'interest', i.interest,
                                'category', c.category
                              )) AS interests,
                     pi.*
                    FROM profile p
                    JOIN match m 
                      ON (
                        (m.first_partner = p.id AND m.second_partner = $1) OR 
                        (m.second_partner = p.id AND m.first_partner = $1)
                      )
                      AND m.status = 'match'
                    LEFT JOIN user_interest ui ON ui.profile_id = p.id
                    LEFT JOIN interests i ON i.id = ui.interest_id
                    LEFT JOIN category c ON c.id = i.category_id
                    LEFT JOIN picture pi ON pi.profile_id = p.id
                    GROUP BY p.id, pi.id;
                  `;
    const values = [id];
    const result = await database.query(query, values);
    console.log("default sql:", result.rows);
    return result.rows;
  }

  static async getLikedProfiles(id: number) {
    const query = `SELECT * FROM match
                        JOIN profile ON profile.id = match.second_partner
                        LEFT JOIN user_interest ON user_interest.profile_id = profile.id
                        LEFT JOIN interests ON interests.id = user_interest.interest_id 
                        LEFT JOIN picture ON picture.profile_id = profile.id
                        WHERE second_partner = $1 AND status = 'pending'
        `;
    const values = [id];
    const result = await database.query(query, values);
    return result.rows;
  }

  //Creating new match
  static async createMatch(id: number, partnerId: number) {
    const query = `INSERT INTO match (first_partner, second_partner)
                      VALUES ((SELECT id FROM profile WHERE user_id = $1), $2)
        `;

    const values = [id, partnerId];
    const result = await database.query(query, values);

    return result.rows[0].id;
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
