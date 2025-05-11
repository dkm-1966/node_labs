import IInterest from "../Profile/IInterests";

type Match = {
  id: number;
  first_partner: number;
  second_partner: number;
  status: string;
};

type Picture = {
  id: number;
  picture_url: string;
  profile_id: number;
};

type Category = {
  id: number;
  category: string;
};

type Interest = {
  id: number;
  interest: string;
  category_id: number;
  Category: Category;
};

export type ProfileWithAssociations = {
  id: number;
  name: string;
  age: number;
  info?: string;
  country: string;
  city: string;
  user_id: number;
  MatchesAsFirst?: Match[];
  MatchesAsSecond?: Match[];
  Pictures?: Picture[];
  Interests?: Interest[];
};

export type ExtededProfileWithAssociations = {
    interests?: IInterest[];
    picture_url?: string;
} & ProfileWithAssociations