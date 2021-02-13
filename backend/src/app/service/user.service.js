const config = require('../../environments/environment');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require("crypto");
const userDao = require('../dao/user.dao');

module.exports = {
    authenticate,
    getUsers,
    getUserById,
};

async function getUserById(id) {
    const users = await userDao.getUserById(id);

    if (!users || users.length <= 0) {
        throw 'No User Found';
    }

    return users[0];
}

async function getUsers() {
    const users = await userDao.getAllUsers();

    if (!users || users.length <= 0) {
        throw 'No User Found';
    }

    return users;
}

async function authenticate({ username, password, ipAddress }) {
    const user = await userDao.getUserByUsername(username);

    if (!user || user.length <= 0 || !bcrypt.compareSync(password, user[0].password)) {
        throw 'Username or password is incorrect';
    }

    // authentication successful so generate jwt and refresh tokens
    const jwtToken = generateJwtToken(user[0]);
    const refreshToken = generateRefreshToken(user[0], ipAddress);

    // return basic details and tokens
    return { 
        ...basicDetails(user[0]),
        jwtToken,
        refreshToken: refreshToken.token
    };
}

function generateJwtToken(user) {
    // create a jwt token containing the user id that expires in 15 minutes
    return jwt.sign({ sub: user.id, id: user.id }, config.secret, { expiresIn: '15m' });
}

function generateRefreshToken(user, ipAddress) {
    // create a refresh token that expires in 7 days
    return {
        user: user.id,
        token: randomTokenString(),
        expires: new Date(Date.now() + 7*24*60*60*1000),
        createdByIp: ipAddress
    };
}

function randomTokenString() {
    return crypto.randomBytes(40).toString('hex');
}

function basicDetails(user) {
    const { id, first_name, last_name, username, role_id } = user;
    return { id, first_name, last_name, username, role_id };
}
