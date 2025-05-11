import IInterest from "./IInterests";

export default interface IProfileWithoutBio{
    id: number;
    name: string | null;
    age: number | null;
    country: string | null;
    city: string | null;
    picture_url?: string;
    interests?: IInterest[];
}