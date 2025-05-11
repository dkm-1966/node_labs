import IInterest from "./IInterests";

export default interface IProfileDB {
    id: number,
    name: string,
    age: number,
    info?: string,
    country: string,
    city: string,
    user_id: number,
    profile_id?: number,
    interests?: IInterest[],
    picture_url?: string,
}