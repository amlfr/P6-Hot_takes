/* const { json } = require('express'); */
const jwt = require('jsonwebtoken');

/* Creating the authentification middleware who checks the user's id by using the dsdjsonwebtoken */

module.exports = (req, res , next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'amlfrOC6_6905412780');
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId
        };
    next();
    } catch(error) {
        res.status(401).json({ error });
    }
};