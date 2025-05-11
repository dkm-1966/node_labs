import database from "../config/database";
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
        try {
            await database.query('BEGIN');
            const newMatchId = await MatchRepository.createMatch(id, partnerId);
            await database.query('COMMIT');

            return newMatchId
        }catch (error) {
            await database.query('ROLLBACK')
            throw error
        }
        
    }

    static async setMatch(id: number, partnerId: number): Promise<boolean> {
        try {
            await database.query('BEGIN');
            const matchStatus = await MatchRepository.updateMatch(id, partnerId);
            await database.query('COMMIT');
            
            return matchStatus
        } catch (error) {
          await database.query('ROLLBACK');
          throw error;
        }
    }
}