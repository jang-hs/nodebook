const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model { // Sequelize.Model 을 확장한 클래스로 선언
  // static init 에서는 테이블에 대한 설정
  static init(sequelize) {
    // sequelize는 알아서 id를 기본 키로 연결함.
    return super.init({
      name: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true,
      },
      age: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
      },
      married : {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      comment: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    }, {
      sequelize,
      timestamps: false, //true이면 createAt, updateAt 컬럼 추가.
      underscored: false, //캐멀케이스(createdAt) -> 스네이크케이스(created_at)
      modelName: 'User', //모델 이름
      tableName: 'users', //실제 데이터베이스 테이블 이름
      paranoid: false, //true이면 deletecAt 컬럼 생김.
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }
  // static associate 에서는 다른 모델과의 관계
  static associate(db) { // 1:N 관계
    db.User.hasMany(db.Comment, { foreignKey: 'commenter', sourceKey: 'id'});
  }
}