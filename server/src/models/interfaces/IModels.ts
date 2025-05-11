import { CategoryType } from "../Category";
import { InterestsType } from "../Interests";
import { MatchType } from "../Match";
import { PictureType } from "../Picture";
import { ProfileType } from "../Profile";
import { UserType } from "../User";
import { UserInterestType } from "../UserInterest";

export default interface IModels {
  User: UserType;
  Profile: ProfileType;
  Interests: InterestsType;
  Category: CategoryType;
  Match: MatchType;
  Picture: PictureType;
  UserInterest: UserInterestType;
}