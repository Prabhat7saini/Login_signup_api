require('dotenv').config();
require('dotenv').config();

const Mail_user = process.env.Mail_user;
const Mail_password = process.env.Mail_password;
const Mail_host = process.env.Mail_host;
const JWT_SECRET = process.env.JWT_SECRET;
const PORT=process.env.PORT;

module.exports = {
    Mail_user,
    Mail_password,
    Mail_host,
    JWT_SECRET,
    PORT
};
