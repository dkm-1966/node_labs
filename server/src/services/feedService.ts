import { userDto } from "../dto/profileDto";
import IProfileWithoutBio from "../models/interfaces/Profile/IProfileWithoutBio";
import { profileRepository } from "../repositories/profileRepository";

export default class feedService {
    static async get(limit: number, offset: number, id: number, interests: string[]): Promise<IProfileWithoutBio[]> {
        console.log("servise", interests )
        let profiles;

        if (interests.length > 0) {
            profiles = await profileRepository.getProfilesByInterest(limit, offset, id, interests);
        } else {
            console.log("12")
            profiles = await profileRepository.getProfiles(limit, offset, id);
        }

        const profileWithoutBio = profiles.map(profile => {
            const user = new userDto(profile)
            const {info, ...rest} = user

            return rest
        })
        return profileWithoutBio
    }

    static async getById(id: number): Promise<IProfileWithoutBio> {
        if (!id) {
            throw new Error("Id is required")
        }

        const profile = await profileRepository.getProfile(id);

        if (!profile) {
            throw new Error("User not found");
        } 

        const FormattedProfile = new userDto(profile);
        const {info, ...rest} = FormattedProfile

        return rest;
    }
}