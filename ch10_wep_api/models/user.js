const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      email: {
        type: Sequelize.STRING(40),
        allowNull: true,
        unique: true,
      },
      nick: {
        type: Sequelize.STRING(15),
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      provider: {
        type: Sequelize.STRING(10),
        allowNull: false,
        // 기본값 지정.
        defaultValue: 'local',
      },
      snsId: {
        type: Sequelize.STRING(30),
        allowNull: true,
      },
    }, {
      //timestamps, paranoid true -> createAt, updatedAt, deleteAt 컬럼도 생성됨.
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'User',
      tableName: 'users',
      paranoid: true,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }

  static associate(db) {
    // user 와 post 는 1:N 관계
    db.User.hasMany(db.Post);
    // 같은 모델 끼리도 N:M 관계를 가질 수 있음. 사용자 한 명이 여러 팔로워를 갖거나, 한 사람이 여러명을 팔로워하는 경우
    // 팔로워(Followers)를 찾으려면 먼저 팔로잉하는 사람의 Id(followingId)를 찾아야 함.
    db.User.belongsToMany(db.User, {
      foreignKey: 'followingId',
      as: 'Followers',
      through: 'Follow', // 생성 모델 명
    });
    db.User.belongsToMany(db.User, {
      foreignKey: 'followerId',
      as: 'Followings',
      through: 'Follow',  // 생성 모델 명
    });
    db.User.hasMany(db.Domain);
  }
};