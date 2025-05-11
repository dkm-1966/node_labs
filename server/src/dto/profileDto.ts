import { Profile } from "../models/Profile";
import {
  ExtededProfileWithAssociations,
} from "../models/interfaces/SequelizeTypes/Profile";
import IInterest from "../models/interfaces/Profile/IInterests";

export class userDto {
  id: number;
  name: string | null;
  age: number | null;
  country: string | null;
  city: string | null;
  picture_url?: string;
  interests?: IInterest[];
  info?: string;
  

  constructor(userFromDb: Profile) {
    let plain: ExtededProfileWithAssociations;

    if (userFromDb instanceof Profile) {
      plain = userFromDb.get({ plain: true });
      plain["interests"] = [];

      if (plain.Interests) {
        for (const i of plain.Interests) {
          plain["interests"].push({category: i.Category.category, interest: i.interest});
        }
      } else {
        plain["interests"] = undefined;
      }

      if (plain.Pictures && plain.Pictures.length > 0) {
        plain["picture_url"] = plain.Pictures[0].picture_url
      } else {
        plain["picture_url"] = undefined
      }
    } else {
      plain = userFromDb;
    }

    const { MatchesAsFirst, MatchesAsSecond, Interests, Pictures, ...rest } =
      plain;

    this.info = rest.info;
    this.name = rest.name;
    this.id = rest.id;
    this.age = rest.age;
    this.country = rest.country;
    this.city = rest.city;
    this.picture_url = rest.picture_url;
    if (rest.interests?.length === 1 && rest.interests[0] === null) {
      this.interests = [];
    } else {
      this.interests = rest.interests;
    }
  }
}
