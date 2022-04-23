// sequelize 연결
const Sequelize = require('sequelize');
const User = require('./users');
const Comment = require('./comment');

const env = process.env.NODE_ENV || 'development';
// 연동할 때에는 config/config.json의 정보를 사용함.
const config = require('../config/config')[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;

db.User = User;
db.Comment = Comment;

User.init(sequelize);
Comment.init(sequelize);

User.associate(db);
Comment.associate(db);

module.exports = db;
