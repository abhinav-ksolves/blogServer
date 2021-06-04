module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define("Comment", {
        cid: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        comment: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        author: {
            type: DataTypes.STRING,
            references: {
                model: { tableName: 'Users' },
                key: 'username',
                as: 'author'
            }
        },
        replies: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            defaultValue: []
        },
        userId: {
            type: DataTypes.INTEGER,
            references: {
                model: { tableName: 'Users' },
                key: 'uid',
                as: 'userId'
            }
        },
        postId: {
            type: DataTypes.INTEGER,
            references: {
                model: { tableName: 'Posts' },
                key: 'pid',
                as: 'postId'
            }
        },
        dateCreated: {
            type: DataTypes.DATE,
            allowNull: false
        },


    }, { timestamps: false });

    return Comment;
}