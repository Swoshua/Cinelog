missingParams = require('./helpers').missingParams;


module.exports = (app, conn) => {

    console.log('setting up routes for film routes');

    app.get('/api/v1/film/:id', getFilmHandler(conn));
    app.delete('/api/v1/film/:id', deleteFilmHandler(conn));
    
}


/**
 * This function will take a MySQL connection and return a handler
 * for the route involved with getting a specific film.
 *
 * @param {*mysql connection} conn 
 */
let getFilmHandler = conn => {
    return (req, res) => {
        let id = req.params['id'];
        console.log(id);
        if (!id || !parseInt(id))
            return missingParams(res, "Invalid I.D., please provide it and ensure it is an integer.");

        let filmQuery = `CALL GetFilm(${id})`;
        let actorQuery = `CALL GetFilmsActors(${id})`;

        conn.query(filmQuery, (err, filmData, _) => {
            if (err) {
                res.status(404);
                console.log(err);
                res.send({'success': false, 'error': err});
                return;
            }

            conn.query(actorQuery, (err, actData, _) => { 
                if (err) {
                    res.status(404);
                    console.log(err);
                    res.send({'success': false, 'error': err});
                    return;
                }
                
                let reviewQuery = `CALL GetAllReviews(${id})`
                conn.query(reviewQuery, (err, revData, _) => {
                    res.status(200);
                    console.log(filmData);
                    console.log(revData);
                    filmDetails = filmData[0][0];
                    let name = filmDetails['name'];
                    let poster_url = filmDetails['poster_url'];
                    let director = filmDetails['director'];
                    revData[0].forEach(e => e.user = `/api/v1/user/${e.user}`);
                    res.send({'name': name, 'director': director, 'poster_url': poster_url, 'cast': actData[0], 'reviews': revData[0]});
                });
            });
        });
    }
}


/**
 * This function will take a MySQL connection and return a handler
 * for the route involved with deleting a specific film.
 *
 * @param {*mysql connection} conn 
 */
let deleteFilmHandler = conn => {
    return (req, res) => {
        let id = req.params['id'];

        if (!id || !parseInt(id))
            return missingParams(res, "Invalid I.D., please provide it and ensure it is an integer.");

        let deleteQuery = `CALL DeleteFilm(${id})`;
        conn.query(deleteQuery, (err, data, _) => {
            if (err) {
                res.status(404);
                return res.send({'success': false, 'error': err});
            }
            
            res.status(200);
            res.send({'success': true});
        });
    }
}

