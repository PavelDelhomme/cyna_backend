const jwt = require('jsonwebtoken')

function createToken() {
    var token = jwt.sign({}, process.env.JWT_SECRET, { expiresIn: "1h" });
    console.log("Token", token);
    return token;
}

function verifyAndDecodeToken(token) {
    const decodedToken =  jwt.verify(token, process.env.JWT_SECRET);
    return decodedToken
};

module.exports = {
    createToken,
    verifyAndDecodeToken,
}