const news = (sequelize: any, DataTypes: any) => {
  const news = sequelize.define("new", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {},
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: true,
      },
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: true,
      },
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true,
      },
    },
    turi: {
      type: DataTypes.ENUM,
      values: ["3", "2", "1"],
      allowNull: false,
    },
    titleStr: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  });
  return news;
};
module.exports = news;
