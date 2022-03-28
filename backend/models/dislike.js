'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Dislike extends Model {
        static associate(models) {
            models.Like.belongsTo(models.User, {
                foreignKey: {
                    allowNull: false
                },
                onDelete: 'CASCADE'
            }),
            models.Like.belongsTo(models.Post, {
                foreignKey: {
                    allowNull: false
                },
                onDelete: 'CASCADE'
            });
        };
    };
    Dislike.init({
        UserId: DataTypes.INTEGER,
        PostId: DataTypes.INTEGER
    }, 
    {
        sequelize,
        modelName: 'Dislike',
    });
    return Dislike;
};