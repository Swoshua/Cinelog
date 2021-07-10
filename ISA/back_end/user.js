const bcrypt = require('bcrypt');
const saltRounds = 10;

let helperFuns = require('./helpers');
let errorHandler = helperFuns.errorHandler;
let logIn = require('./session').logIn;

console.log('error_handler: ', errorHandler);

module.exports = (app, conn) => {
    app.post('/api/v1/user', createUserHandler(conn));
    app.get('/api/v1/user/:userID', getUserHandler(conn));
    app.get('/api/v1/user/:userID/image', getAllUsersImagesHandler(conn));
    app.get('/api/v1/user/:userID/image/:imageID', getUsersSpecificImage(conn));
    app.get('/api/v1/user/:userID/review', getAllUsersReviewsHandler(conn));
    app.post('/api/v1/user/:userID/review', createReviewHandler(conn));
    app.put('/api/v1/user/:userID/review/:reviewID', editReviewHandler(conn));
    app.get('/api/v1/user/:userID/review/:reviewID', getUsersSpecificReview(conn));
    app.get('/api/v1/user/:userID/synopsis', getAllUserSynopsisHandler(conn));
    app.get('/api/v1/user/:userID/synopsis/:synopsisID', getAllUserSynopsisHandler(conn));

}

let handleUserDBReg = (res, email) => {
    return (err, data) => {
        console.log(err);
        if (err)
            return errorHandler(res, 500, 'sorry that email already exists.')
        
        id = data[0]['id'];
        email = email;

        let userData = {'id': id, 'email': email};
        logIn(res, userData);
    }
}

let createUserHandler = (conn) => {
    return (req, res) => {
        let email = req.body.email;
        let plaintext_pw = req.body.password;

        if (!email || !plaintext_pw)
            return errorHandler(res, 400, 'missing email or password');

        bcrypt.genSalt(saltRounds, (err, salt) => {
            bcrypt.hash(plaintext_pw, salt, (err, hash) => {
                console.log(err);
                if (err)
                    return errorHandler(res, 500, 'sorry, there has been an error, please try again.')

                let registrationQuery = `CALL AddUser('${email}', '${hash}')`;
                conn.query(registrationQuery, handleUserDBReg(res, email));
            });
        });
    }
}

let apiifyIDs = (data) => {
    data.forEach(e => {
        e.user = `/api/v1/user/${e.user}`;
        e.film = `/api/v1/film/${e.film}`; 
    });
}

let getUserHandler = conn => {
    return (req, res) => {
        let userID = req.params.userID;

        if (!parseInt(userID))
            return errorHandler(res, 400, 'please provide an ID that is an integer');

        let userQuery = `CALL GetUserEmail(${userID})`;
        let imagesQuery = `CALL GetAllUsersImages(${userID})`;
        let reviewQuery = `CALL GetAllUsersReviews(${userID})`;
        let synopsisQuery = `CALL GetAllUsersSynopsis(${userID})`;

        conn.query(userQuery, (err, data, _) => {
            if (err)
                return errorHandler(res, 500, 'sorry there was an error, please try again', err);
            let payload = data[0];
            conn.query(imagesQuery, (err, data, _) => {
                if (err)
                    return errorHandler(res, 500, 'sorry there was an error, please try again', err);
                let imageIds = data[0].reduce((acc, e) => acc.concat([`/api/v1/user/${userID}/image/${e.id}`]), []);
                conn.query(reviewQuery, (err, data, _) => {
                    if (err)
                        return errorHandler(res, 500, 'sorry there was an error, please try again', err);
        
                    let reviewIds = data[0].reduce((acc, e) => acc.concat([`/api/v1/user/${userID}/review/${e.id}`]), []);
                    conn.query(synopsisQuery, (err, data, _) => {
                        if (err)
                            return errorHandler(res, 500, 'sorry there was an error, please try again', err);

                        let synopsisIds = data[0].reduce((acc, e) => acc.concat([`/api/v1/user/${userID}/synopsis/${e.id}`]), []);
                        res.status(200);
                        try {
                            payload = payload[0];
                            payload.images = imageIds;
                            payload.synopsis = synopsisIds;
                            payload.reviews = reviewIds;
                        } catch (e) {
                            //payload empty
                        }
                        res.send({
                            "success": true,
                            "payload": payload
                        });
                    });
                });
            });
        });
    }
}

let getAllUsersImagesHandler = conn => {
    return (req, res) => {
        let userID = req.params.userID;

        if (!parseInt(userID))
            return errorHandler(res, 400, 'please provide an ID that is an integer');

        let imagesQuery = `CALL GetAllUsersImages(${userID})`;
        conn.query(imagesQuery, (err, data, _) => {
            if (err)
                return errorHandler(res, 500, 'sorry, there was an error, please try again.');
            
            let payload = data[0];

            apiifyIDs(payload);

            res.status(200);
            res.send({'success': true, 'payload': payload});
        });
    }
}

let getAllUsersReviewsHandler = conn => {
    return (req, res) => {
        let userID = req.params.userID;

        if (!parseInt(userID))
            return errorHandler(res, 400, 'please provide an ID that is an integer');

        let reviewQuery = `CALL GetAllUsersReviews(${userID})`;
        conn.query(reviewQuery, (err, data, _) => {
            if (err)
                return errorHandler(res, 500, 'sorry, there was an error, please try again.');
            
            let payload = data[0];

            apiifyIDs(payload);

            res.status(200);
            res.send({'success': true, 'payload': payload});
        });
    }
}

let getAllUserSynopsisHandler = conn => {
    return (req, res) => {
        let userID = req.params.userID;

        if (!parseInt(userID))
            return errorHandler(res, 400, 'please provide an ID that is an integer');

        let synopsisQuery = `CALL GetAllUsersSynopsis(${userID})`;
        conn.query(synopsisQuery, (err, data, _) => {
            if (err)
                return errorHandler(res, 500, 'sorry, there was an error, please try again.');
            
            let payload = data[0];

            apiifyIDs(payload);

            res.status(200);
            res.send({'success': true, 'payload': payload});
        });
    }
}

let specificResourceGrabber = (query, res, conn) => {
    conn.query(query, (err, data, _) => {
        if (err)
            return errorHandler(res, 500, 'sorry, there was an error, please try again', err);

        let payload = data[0];

        apiifyIDs(payload);

        try {
            payload = payload[0]; // we are only getting one row from the db, but there may not be any valid results.
        } catch (e) {
            payload = {};
        }

        if (!payload) {
            res.status(400);
            res.send({'success': false, 'error': `specified resource (of that user and that resource id) doesn't exist.`})
            return;
        }

        res.status(200);
        res.send({'success': true, 'payload': payload});
    });
}


let getUsersSpecificImage = conn => {
    return (req, res) => {
        console.log('req params: ', req.params)
        let userID = req.params.userID;
        let imageID = req.params.imageID;
        
        if (!parseInt(userID) || !parseInt(imageID))
            return errorHandler(res, 400, 'please provide IDs that are integers');
        
        let userQuery = `CALL GetUserSpecificImage(${userID}, ${imageID})`;
        specificResourceGrabber(userQuery, res, conn);
    }
}


let getUsersSpecificReview = conn => {
    return (req, res) => {
        let userID = req.params.userID;
        let reviewID = req.params.reviewID;

        if (!parseInt(userID) || !parseInt(reviewID))
            return errorHandler(res, 400, 'please provide IDs that are integers');

        console.log(req.params);

        let reviewQuery = `CALL GetUserSpecificReview(${userID}, ${reviewID})`;

        specificResourceGrabber(reviewQuery, res, conn);
    }
}


let getUsersSpecificSynopsis = conn => {
    return (req, res) => {
        let userID = req.params.userID;
        let synopsisID = req.params.synopsisID;

        if (!parseInt(userID) || !parseInt(synopsisID))
            return errorHandler(res, 400, 'please provide IDs that are integers');

        let synopsisQuery = `CALL GetUserSpecificSynopsis(${userID}, ${synopsisID})`;
        
        specificResourceGrabber(synopsisQuery, res, conn);    
    }
}


let createReviewHandler = conn => {
    return (req, res) => {
        let userID = req.params.userID;
        let filmID = req.body.filmID;
        let reviewText = req.body.review;
        
        if (!parseInt(userID) || !parseInt(filmID))
            return errorHandler(res, 400, 'please provide IDs that are integers');

        if (!reviewText)
            return errorHandler(res, 400, 'please provide a review to add!');

        let reviewQuery = `CALL AddReview('${reviewText}', ${userID}, ${filmID})`;
        conn.query(reviewQuery, (err, data, _) => {
            if (err)
                return errorHandler(res, 500, 'sorry, there has been an error. please try again.', err);
            let payload;
            try {
                let rev_id = data[1][0]['id'];
                payload = {id: `/api/v1/user/${userID}/review/${rev_id}`}
            } catch {
                payload = {}
            }

            res.send({success: true, payload: payload})
        });
    }
}


let editReviewHandler = conn => {
    return (req, res) => {
        let revID = req.params.reviewID;
        let userID = req.params.userID;
        let reviewText = req.body.reviewText;

        if (!parseInt(userID) || !parseInt(revID) || !reviewText)
            return errorHandler(res, 400, "there is a missing parameter or the review ID is not an integer.");

        let reviewQuery = `CALL EditReview(${revID}, '${reviewText}')`;
        conn.query(reviewQuery, (err, data, _) => {
            if (err)
                return errorHandler(res, 500, 'sorry, there has been an error. please try again', err);
            
            res.send({success: true, payload: {review: `/api/v1/user/${userID}/review/${revID}`}});
        
        });
    }
}

