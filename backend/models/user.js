'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            models.User.hasMany(models.Post);
            models.User.hasMany(models.Like);
            models.Post.hasMany(models.Dislike);
            models.User.hasMany(models.Comment);
        }
    };
    User.init ({
        nom: DataTypes.STRING,
        prenom: DataTypes.STRING,
        email: DataTypes.STRING,
        password: DataTypes.STRING,
        image: DataTypes.STRING,
        role: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'User',
    });
    return User;
};