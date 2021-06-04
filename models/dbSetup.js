const { Sequelize, DataTypes, Op } = require('sequelize');
require('dotenv').config();

//connecting to postgres
const sequelize = new Sequelize(process.env.DB, process.env.USER, process.env.PASSWORD, {
    host: process.env.HOST,
    dialect: process.env.DIALECT,
    logging: false,
});


const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.Op = Op;

db.Users = require('./user')(sequelize, DataTypes);
db.Posts = require('./post')(sequelize, DataTypes);
db.Comments = require('./comment')(sequelize, DataTypes);

module.exports = db;