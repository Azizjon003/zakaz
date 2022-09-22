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
      validate: {
        min: 5,
        max: 20,
      },
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        min: 5,
        max: 100,
        isUrl: true,
      },
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        min: 5,
        max: 100,
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
  });
  return news;
};
module.exports = news;
