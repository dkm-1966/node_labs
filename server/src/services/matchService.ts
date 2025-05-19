import database from "../config/database";
import sequelize from "../config/sequalize";
import { userDto } from "../dto/profileDto";
import MatchRepository from "../repositories/matchRepository";

export default class MatchService {
    static async getMatches( id: number): Promise<userDto[] | []>  {
        if (!id) {
            throw new Error("Error while getting matches: Id is required")
        }
        const matches = await MatchRepository.getMatchesProfiles(id);
        const profiles = matches?.map(match => new userDto(match))
        console.log(profiles)
        
        return profiles
    }

    static async getLikes( id: number): Promise<userDto[] | []> {
        if (!id) {
            throw new Error("Error while getting matches: Id is required")
        }
        const matches = await MatchRepository.getLikedProfiles(id);
        console.log("Matches in service", matches)
        const profiles = matches?.map(match => new userDto(match))

        console.log(profiles)

        return profiles
    }

    static async setLike(id: number, partnerId: number): Promise<number> {
        const t = await sequelize.transaction();
        try {
            const newMatchId = await MatchRepository.createMatch(id, partnerId, t);
            await t.commit()

            return newMatchId
        }catch (error) {
            await t.rollback();
            throw error
        }
        
    }

    static async setMatch(id: number, partnerId: number): Promise<boolean> {
        const t = await sequelize.transaction();
        try {
            const matchStatus = await MatchRepository.updateMatch(id, partnerId, t);
            await t.commit()
            
            return matchStatus
        } catch (error) {
          await t.rollback();
          throw error;
        }
    }
}