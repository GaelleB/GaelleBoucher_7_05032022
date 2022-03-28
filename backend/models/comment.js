'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Comment extends Model {
        static associate(models) {
            models.Comment.belongsTo(models.User, 
                { foreignKey: {
                    allowNull: false
                
                },
                onDelete:'CASCADE',
                }),
            models.Comment.belongsTo(models.Post, 
                { foreignKey: {
                    allowNull: false,
                    
                }, onDelete:'CASCADE',
                })
        }
        
    };
    Comment.init({
        userId: DataTypes.INTEGER,
        postId: DataTypes.INTEGER,
        content: DataTypes.STRING,
    },
    {
        sequelize,
        modelName: 'Comment',
    });
    return Comment;
};