const bcrypt = require('bcrypt');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const db = require('../models/dbSetup');
const sequelize = db.sequelize;
const Users = db.Users;
const Posts = db.Posts;
const Comments = db.Comments;
const Op = db.Op;

exports.findAllPosts = (req, res, next) => {
    Posts.findAll({ where: null })
        .then((data) => {
            const sortedData = data.sort((post1, post2) => post2.dateCreated - post1.dateCreated);
            res.send({ allPosts: sortedData });
        })
        .catch((err) => {
            console.log(err);
            res.end();
        });
};

exports.findAllApprovedPosts = (req, res, next) => {
    Posts.findAll({ where: { approved: true } })
        .then((data) => {
            const sortedData = data.sort((post1, post2) => post2.dateCreated - post1.dateCreated);
            res.send({ allPosts: sortedData });
        })
        .catch((err) => {
            console.log(err);
            res.end();
        })

};

exports.findPostById = (req, res, next) => {
    const post_id = req.params.post_id
    Posts.findByPk(post_id)
        .then((data) => {

            res.send({ post: data });

        })
        .catch((err) => {
            console.log(err);
            res.end();
        });

};

exports.createPost = (req, res, next) => {

    const newPost = {
        title: req.body.title, body: req.body.body, userId: req.body.uid, author: req.body.username,
        dateCreated: new Date().toLocaleString()
    };
    Posts.create(newPost)
        .then((result) => {
            res.send({ msg: 'Post created successfully!' });
        }).catch((err) => {
            console.log(err);
            res.end();
        });

};

exports.updatePost = (req, res, next) => {
    Posts.update({ title: req.body.title, body: req.body.body }, { where: { pid: req.body.pid } })
        .then(num => {
            if (num == 1) {
                res.send({ msg: 'updated successfully' });
            }
            else {
                res.send({ msg: "Can't  update" });
            }
        })
        .catch((err) => {
            console.log(err);
            res.end();
        });

}

exports.approvePost = (req, res, next) => {
    Posts.update({ approved: true }, { where: { pid: req.body.pid } })
        .then(num => {
            if (num == 1) {
                res.send({ msg: 'Approved successfully' });
            }
            else {
                res.send({ msg: "Can't  update" });
            }
        })
        .catch((err) => {
            console.log(err);
            res.end();
        });

}

exports.deletePostComments = (req, res, next) => {
    Comments.destroy({ where: { postId: req.body.post_id } })
        .then(num => {
            if (num == 1) {
                res.send({ msg: "comments deleted" });
            }
            else {
                res.send({
                    message: "Can't  delete"
                });
            }
        })
        .catch((err) => {
            console.log(err);
            res.end();
        });

}

exports.deletePost = (req, res, next) => {
    const post_id = req.body.post_id;
    Posts.destroy({ where: { pid: post_id } })
        .then((num) => {
            res.send({ msg: "deleted" });
        })
        .catch((err) => {
            console.log(err);
            res.end();
        })

}



exports.putLikes = (req, res, next) => {
    Posts.findByPk(req.body.pid)
        .then((post) => {
            if (!post.likeUserId.includes(req.body.user_id)) {
                Posts.update({ likeUserId: sequelize.fn('array_append', sequelize.col('likeUserId'), req.body.user_id), likes: sequelize.literal('likes + 1') },
                    { where: { pid: req.body.pid } })
                    .then((num) => {
                        if (num == 1) {
                            res.send({ updateCount: num });
                        }
                        else {
                            res.send({ msg: "Can't  update" });
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                        res.end();
                    })
            }
            else {
                console.log("you already given like on this post");
            }
        })

}

//comment controllers
exports.createComment = (req, res, next) => {
    const newComment = {
        comment: req.body.comment, userId: req.body.user_id,
        author: req.body.username, postId: req.body.post_id, dateCreated: new Date().toLocaleString()
    }
    Comments.create(newComment)
        .then((result) => {
            res.send({ msg: "succecssfuuly created comment" });
        }).catch((err) => {
            console.log(err);
            res.end();
        });

};

exports.putReply = (req, res, next) => {
    const userAndReply = req.body.username + "-" + req.body.reply;
    Comments.update({ replies: sequelize.fn('array_append', sequelize.col('replies'), userAndReply) }
        , { where: { cid: req.body.cid } })
        .then((num) => {
            if (num == 1) {
                res.send({ updateCount: num });
            }
            else {
                res.send({ msg: "Can't  update" });
            }
        })
        .catch((err) => {
            console.log(err);
            res.end();
        })

}



exports.deleteComment = (req, res, next) => {
    Comments.destroy({ where: { cid: req.body.comment_id } })
        .then((num) => {
            if (num === 1) {
                res.send({ msg: "successfuly deleted" });
            }
            else {
                res.send({ msg: "can not delete" });
            }
        })
        .catch((err) => {
            console.log(err);
            res.end();
        })

}

exports.findAllPostComments = (req, res, next) => {
    Comments.findAll({ where: { postId: req.params.post_id } })
        .then((data) => {
            res.send({ allComments: data });
        })
        .catch((err) => {
            console.log(err);
            res.end();
        })

};

//user

exports.createUser = (req, res, next) => {
    const { username, email, password, confirmPassword } = req.body;
    if (!username || !email || !password || !confirmPassword) {
        res.send({ msg: "All fields are mandatory!" });
    }
    else if (password !== confirmPassword) {
        res.send({ msg: "password and confirm password should be same" });
    }
    else {
        Users.findOne({ where: { username: username } })
            .then((user) => {
                if (user) {
                    res.send({ msg: "Username Already exist!" });
                }
                else {
                    Users.findOne({ where: { email: email } })
                        .then((user) => {
                            if (user) {
                                res.send({ msg: "Email Already exist!" });
                            }
                            else {
                                bcrypt.hash(password, 10, (err, hashedPassword) => {
                                    if (err) {
                                        console.log('error ocurred while hashing password', err);
                                        throw err;
                                    }
                                    else {
                                        const newUser = { username: username, email: email, password: hashedPassword, dateCreated: new Date().toLocaleString() }
                                        Users.create(newUser)
                                            .then((result) => {
                                                res.send({ msg: "successfully registered login Now!" });
                                            })
                                            .catch((err) => {
                                                console.log(err);
                                                res.end();
                                            })

                                    }
                                });
                            }
                        })
                }
            })

    }
}

exports.findUser = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {

        res.send({ msg: "All fields are mandatory!" })
    }
    else {
        Users.findOne({ where: { email: email } })
            .then((user) => {
                if (!user) {
                    res.send({ msg: "User not exist with this email" });
                }
                else {
                    bcrypt.compare(password, user.password, (err, matched) => {
                        if (err) {
                            console.log('something wrong!');
                            res.end();
                        }
                        else {
                            if (matched) {
                                //creating token
                                const token = jwt.sign({ uid: user.uid, username: user.username, email: user.email, isAdmin: user.isAdmin }, process.env.SECRET, {
                                    expiresIn: 86400 //expires in 24 hours
                                });


                                res.cookie('userInfo',
                                    JSON.stringify({ uid: user.uid, username: user.username, email: user.email, isAdmin: user.isAdmin, token: token }));

                                res.send({ msg: "login successful" });
                            }
                            else {
                                res.send({ msg: "invalid Password" });
                            }
                        }
                    })
                }
            })
            .catch((err) => {
                console.log(err);
                res.end();
            })

    }

}

exports.findUserPosts = (req, res, next) => {
    Posts.findAll({ where: { userId: req.params.userId } })
        .then((data) => {
            const sortedData = data.sort((post1, post2) => post2.dateCreated - post1.dateCreated)
            res.send({ posts: sortedData });
        })
        .catch((err) => {
            console.log(err);
            res.end();
        });

};




