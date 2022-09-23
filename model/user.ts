const user = (sequelize: any, DataTypes: any) => {
  const User = sequelize.define("user", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    telegram_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: true,
    },
    activ: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    command: {
      type: DataTypes.STRING,
    },
  });
  return User;
};
module.exports = user;
