// sequelize 연결
const Sequelize = require('sequelize');

const env = process.env.NODE_ENV || 'development';
// 연동할 때에는 config/config.json의 정보를 사용함.
const config = require(__dirname + '/../config/config')[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;

module.exports = db;
