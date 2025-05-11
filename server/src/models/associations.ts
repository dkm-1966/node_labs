import IModels from "./interfaces/IModels";

export function applyAssociations(models: IModels) {
  // User 1:1 Profile
  models.User.hasOne(models.Profile, { foreignKey: "user_id", onDelete: "CASCADE" });
  models.Profile.belongsTo(models.User, { foreignKey: "user_id", onDelete: "CASCADE" });

  // Profile N:M Interest через user_interest
  models.Profile.belongsToMany(models.Interests, {
    through: models.UserInterest,
    foreignKey: "profile_id",
    otherKey: "interest_id",
    onDelete: "CASCADE",
  });
  models.Interests.belongsToMany(models.Profile, {
    through: models.UserInterest,
    foreignKey: "interest_id",
    otherKey: "profile_id",
    onDelete: "CASCADE",
  });

  // Interest -> Category
  models.Interests.belongsTo(models.Category, {
    foreignKey: "category_id",
    onDelete: "CASCADE",
  });
  models.Category.hasMany(models.Interests, {
    foreignKey: "category_id",
    onDelete: "CASCADE",
  });

  // Profile 1:M Picture
  models.Profile.hasMany(models.Picture, { foreignKey: "profile_id", onDelete: "CASCADE" });
  models.Picture.belongsTo(models.Profile, { foreignKey: "profile_id", onDelete: "CASCADE" });

  //Profle N:M Match
  models.Match.belongsTo(models.Profile, {
    as: "FirstPartner",
    foreignKey: "first_partner",
    onDelete: "CASCADE",
  });
  models.Match.belongsTo(models.Profile, {
    as: "SecondPartner",
    foreignKey: "second_partner",
    onDelete: "CASCADE",
  });

  models.Profile.hasMany(models.Match, {
    as: "MatchesAsFirst",
    foreignKey: "first_partner",
    onDelete: "CASCADE",
  });
  models.Profile.hasMany(models.Match, {
    as: "MatchesAsSecond",
    foreignKey: "second_partner",
    onDelete: "CASCADE",
  });
}
