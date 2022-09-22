const channel = (sequelize: any, DataTypes: any) => {
  const channel = sequelize.define("channel", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    telegram_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    news_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "news",
        key: "id",
      },
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
  });
  return channel;
};
module.exports = channel;
