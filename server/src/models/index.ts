import { User } from './User';
import { Profile } from './Profile';
import { Interests } from './Interests';
import { Category } from './Category';
import { Match } from './Match';
import { Picture } from './Picture';
import { UserInterest } from './UserInterest';

import { applyAssociations } from './associations';

const models = {
  User,
  Profile,
  Interests,
  Category,
  Match,
  Picture,
  UserInterest,
};

function connectModels() {
  applyAssociations(models);
}

export {models, connectModels};