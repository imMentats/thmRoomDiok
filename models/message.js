'use strict'
const md5 = require("md5")

module.exports = (sequelize, DataTypes) => {
    const Message = sequelize.define('message', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        body: {
            type: DataTypes.STRING,
            allowNull: false
        },
        fromAdmin: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        },
        uid: {
            type: DataTypes.STRING,
            allowNull: false
        },
        visited: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        },
        url: {
            type: DataTypes.STRING,
            allowNull: true
        },
        relatedTo: {
            type: DataTypes.STRING,
            allowNull: true
        }
    });
    return Message;
};