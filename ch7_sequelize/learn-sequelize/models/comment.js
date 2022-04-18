const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model { // Sequelize.Model 을 확장한 클래스로 선언
  // static init 에서는 테이블에 대한 설정
  static init(sequelize) {
    // sequelize는 알아서 id를 기본 키로 연결함.
    return super.init({
      comment: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.NOW,
      },
    }, {
      sequelize,
      timestamps: false, //true이면 createAt, updateAt 컬럼 추가.
      modelName: 'Comment', //모델 이름
      tableName: 'comments', //실제 데이터베이스 테이블 이름
      paranoid: false, //true이면 deletecAt 컬럼 생김.
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    });
  }
  // static associate 에서는 다른 모델과의 관계
  static associate(db) { // 다른 모델의 정보가 들어가는 테이블에 belongsTo를 사용.
    db.User.belongsTo(db.User, { foreignKey: 'commenter', targetKey: 'id'});
  }
}