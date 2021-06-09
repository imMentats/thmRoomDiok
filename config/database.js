const Sequelize = require('sequelize');
const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "testERM.sqlite",
    define: {
        underscored: true
    }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

//Models/tables
db.users = require('../models/user.js')(sequelize, Sequelize);
db.notes = require('../models/note.js')(sequelize, Sequelize);
db.messages = require('../models/message.js')(sequelize, Sequelize);

module.exports = db;