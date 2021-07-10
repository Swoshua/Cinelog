module.exports = (app, conn) => {
    app.get('/api/v1/film/:filmid/image', getUserUploadImage(conn));
    app.get('/api/v1/film/:filmid/review', getUserUploadReview(conn));
    app.get('/api/v1/film/:filmid/synopsis', getUserUploadSynopsis(conn));
}

/**
 * This function will take a MySQL connection and return a handler
 * for the route involved with getting a specific film.
 *
 * @param {*mysql connection} conn 
 */
let getUserUploadImage = conn => {
    return (req, res) => {
        let f_id = req.params['filmid']
        console.log(f_id);
        if(!f_id || !parseInt(f_id))
            return missingParams(res, "Invalid I.D., ensure correct i.d.")
        
        let uploadQuery = `CALL GetImagesByFilm(${f_id})`;

        conn.query(uploadQuery, (err, upData, _) => {
            if (err) {
                res.status(404);
                res.send({'success': false, 'error': err});
                return;
            }
            res.status(200);
            let data = upData[0];
            data.forEach(e => {
                e.user_id = `/api/v1/user/${e.user_id}`;
                e.film_id = `/api/v1/film/${e.film_id}`;
            });
            res.send({'data': data});
        })
    }
}

/**
 * This function will take a MySQL connection and return a handler
 * for the route involved with getting a specific film.
 *
 * @param {*mysql connection} conn 
 */
let getUserUploadReview = conn => {
    return (req, res) => {
        let f_id = req.params['filmid']
        console.log(f_id);
        if(!f_id || !parseInt(f_id))
            return missingParams(res, "Invalid I.D., ensure correct i.d.")
        
        let uploadQuery = `CALL GetReviewByFilm(${f_id})`;

        conn.query(uploadQuery, (err, upData, _) => {
            if (err) {
                res.status(404);
                res.send({'success': false, 'error': err});
                return;
            }
            let data = upData[0];
            data.forEach(e => {
                e.user_id = `/api/v1/user/${e.user_id}`;
                e.film_id = `/api/v1/film/${e.film_id}`;
            });
            res.send({'data': data});
        })
    }
}

/**
 * This function will take a MySQL connection and return a handler
 * for the route involved with getting a specific film.
 *
 * @param {*mysql connection} conn 
 */
let getUserUploadSynopsis = conn => {
    return (req, res) => {
        let f_id = req.params['filmid']
        console.log(f_id);
        if(!f_id || !parseInt(f_id))
            return missingParams(res, "Invalid I.D., ensure correct i.d.")
        
        let uploadQuery = `CALL GetSynopsisByFilm(${f_id})`;

        conn.query(uploadQuery, (err, upData, _) => {
            if (err) {
                res.status(404);
                res.send({'success': false, 'error': err});
                return;
            }
            let data = upData[0];
            data.forEach(e => {
                e.user_id = `/api/v1/user/${e.user_id}`;
                e.film_id = `/api/v1/film/${e.film_id}`;
            });
            res.send({'data': data});
        })
    }
}