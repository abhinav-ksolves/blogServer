const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
    const token = req.cookies.userInfo ? JSON.parse(req.cookies.userInfo).token : null;

    if (!token) return res.status(401).json({ msg: "Unautherized access" });
    try {
        const verified = jwt.verify(token, process.env.SECRET);
        // console.log(verified);
        req.user = verified;
        next();
    }
    catch (err) {
        res.status(400).send('unauthorized token');
    }
}

module.exports = verifyToken;