'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Post extends Model {
        static associate(models) {
            models.Post.belongsTo(models.User, {
                foreignKey:{
                    allowNull: false
                },
                onDelete: 'CASCADE'
            });
            models.Post.hasMany(models.Like);
            models.Post.hasMany(models.Dislike);
            models.Post.hasMany(models.Comment);
        }
    };
    Post.init ({
        userId : DataTypes.INTEGER,
        title: DataTypes.STRING,
        content: DataTypes.STRING,
        image: DataTypes.STRING,
    },
    {
        sequelize,
        modelName: 'Post',
    });
    return Post;
};