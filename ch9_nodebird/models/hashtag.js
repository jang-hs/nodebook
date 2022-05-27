const Sequelize = require('sequelize');
// 나중에 태그로 검색하기 위해서 추가함.
module.exports = class Hashtag extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      title: {
        type: Sequelize.STRING(15),
        allowNull: false,
        unique: true,
      },
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'Hashtag',
      tableName: 'hashtags',
      paranoid: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    });
  }
  static associate(db){
    // Post와 Hashtag는 N:M 관계
    db.Hashtag.belongsToMany(db.Post, { through: 'PostHashtag' });
  }
};