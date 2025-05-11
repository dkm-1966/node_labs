import IProfileDB from "../models/interfaces/Profile/IProfileDB";
import ProfileWithoutBioDto from "./profileWithoutBioDto";

export class userDto extends ProfileWithoutBioDto {
  info: string | null;
  status: string | null;

  constructor(userFromDb: IProfileDB | IProfileDB) {
    super(userFromDb);

    this.info = this.info = userFromDb.info;
    this.status = userFromDb.status
  }
}
