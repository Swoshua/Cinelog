let bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');
let errorHandler = require('./helpers').errorHandler;

const SEKRETKEY = '1sfw451bafvw614bkqiyyyttrebnjwviifyavvfasikfhbafdakyywbfsdjayw'

/**
 * The following function takes a MySQL connection
 * object and returns a handler function for an Expressjs route
 * @param {mysql connection object} conn 
 */
let createSessionHandler = conn => {
    return (req, res) => {
        let email = req.body.email;
        let plaintext_pw = req.body.password;

        if (!email || !plaintext_pw)
            return errorHandler(res, 400, "Missing email or password for logging in.");

        let getPHashQuery = `CALL GetUserPHash('${email}')`;
        conn.query(getPHashQuery, (err, data, _) => {
            if (err)
                return errorHandler(res, 500, 'it appears we made a mistake, please try again later...');
            
            if (!data.length)
                return errorHandler(res, 404, 'Invalid username or password.');

            let payload = data[0][0];
            bcrypt.compare(plaintext_pw, payload['password_hash'], (err, result) => {
                if (err || !result)
                    return errorHandler(res, 404, 'Invalid username or password');

                let userData = {id: payload['id'], email: email}
                logIn(res, userData);
            });
        });
    }
}


/**
 * This function takes a Node Response object and data to tokenize
 * as a JWT before finally sending it back to the requester.
 *
 * @param {NodeJS Response object} res 
 * @param {JavaScript Object} data 
 */
let logIn = (res, data) => {
    res.status(200);
    res.send({
        'success': true, 
        'token': jwt.sign(data, SEKRETKEY)
    });
}

/**
 * This function takes a request object, parses the JWT token in its header,
 * and verifies whether or not it is a proper object - it will return
 * the decoded JWT or false.
 *
 * @param {NodeJS Request object} req
 * @return boolean of false or javascript object 
 */
let authenticatorFun = req => {
    let token = req.headers.authorization.split(' ');
    
    if (req.headers && req.headers && token[0] === 'JWT')
        try {
            return jwt.verify(token[1], SEKRETKEY)
        } catch (err) {
            return false;
        }
}


module.exports = {

    'setUpRoutes': (app, conn) => {
        app.post('/api/v1/session', createSessionHandler(conn));   
    },

    'authenticator': authenticatorFun,

    'logIn': logIn


}
