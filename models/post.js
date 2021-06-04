module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define("Post", {
        pid: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING, //varchar(255)
            allowNull: false,
        },
        body: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            references: {
                model: { tableName: 'Users' },
                key: 'uid',
                as: 'userId'
            }
        },
        author: {
            type: DataTypes.STRING,
            references: {
                model: { tableName: 'Users' },
                key: 'username',
                as: 'author'
            }

        },
        approved: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        dateCreated: {
            type: DataTypes.DATE,
            allowNull: false
        },
        likeUserId: {
            type: DataTypes.ARRAY(DataTypes.INTEGER),
            defaultValue: []
        },
        likes: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }

    }, { timestamps: false });

    return Post;
}