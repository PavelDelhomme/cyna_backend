function authMiddleWare(req, res, next) {
    console.log('Auth Middleware');
    console.log(req.headers.authorization);

    const { verifyAndDecodeToken } = require('../utils/jwt');

    if (!req.headers.authorization) {
        return res.status(401).json({ error: "No parameters" });
    }

    const Token = req.headers?.authorization.split(' ')[1];
    verifyAndDecodeToken(Token);
    next();
}

module.exports = { authMiddleWare };