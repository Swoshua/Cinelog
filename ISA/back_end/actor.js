module.exports = (app, conn) => {
    app.get('/api/v1/actor/:id', getActorHandler(conn));
    app.get('/api/v1/actor/:id/films', getFilmsByActor(conn));
}

/**
 * This function will take a MySQL connection and return a handler
 * for the route involved with getting a specific film.
 *
 * @param {*mysql connection} conn 
 */
let getActorHandler = conn => {
    return (req, res) => {
        let id = req.params['id'];
        console.log(id);
        if (!id || !parseInt(id))
            return missingParams(res, "Invalid I.D., ensure its an integer");
        
        let actQuery = `CALL GetActor(${id})`;

        conn.query(actQuery, (err, actData, _) => {
            if (err) {
                res.status(404);
                res.send({'success': false, 'error': err});
                return;
            }
            res.status(200);
            let actDetails = actData[0][0];
            let name = actDetails['name'];
            let pic_url = actDetails['profile_url'];

            res.send({'name': name, 'profile_url': pic_url});
        })
    }
}


/**
 * This function will take a MySQL connection and return a handler
 * for the route involved with getting a specific film.
 *
 * @param {*mysql connection} conn 
 */
let getFilmsByActor = conn => {
    return (req, res) => {
        let id = req.params['id'];
        if (!id || !parseInt(id))
            return missingParams(res, "Invalid I.D., please ensure appropriate id");

        let filmQuery = `CALL GetFilmsByActor(${id})`;

        conn.query(filmQuery, (err, filmData, _) => {
            if (err) {
                res.status(404);
                console.log(err);
                res.send({'success': false, 'error': err});
                return;
            }

            res.status(200);
            console.log(filmData);
            res.send({'film': filmData[0]})
        })
    }
}

let missingParams = (res, errorMsg) => {
    res.status(400); // bad request error i.e. missing params
    res.send({'success': false, 'error': errorMsg});
}
