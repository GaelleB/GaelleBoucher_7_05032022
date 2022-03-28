'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Like extends Model {
        static associate(models) {
            // define association here
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
        }
    };
    Like.init({
        UserId: DataTypes.INTEGER,
        PostId: DataTypes.INTEGER
    },
    {
        sequelize,
        modelName: 'Like',
    });
    return Like;
};