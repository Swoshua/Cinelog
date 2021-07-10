
module.exports = (app, conn) => {

    console.log('setting up routes for director routes');

    app.get('/api/v1/director/:id', getDirectorHandler(conn));
    app.get('/api/v1/director/:id/films', getFilmsByDirector(conn));
    
}

/**
 * This function will take a MySQL connection and return a handler
 * for the route involved with getting a specific film.
 *
 * @param {*mysql connection} conn 
 */
let getDirectorHandler = conn => {
    return (req, res) => {
        let id = req.params['id'];
        console.log(id);
        if (!id || !parseInt(id))
            return missingParams(res, "Invalid I.D., ensure its an integer");
        
        let dirQuery = `CALL GetDirector(${id})`;

        conn.query(dirQuery, (err, dirData, _) => {
            if (err) {
                res.status(404);
                res.send({'success': false, 'error': err});
                return;
            }
            res.status(200);
            dirName = dirData[0][0];
            name = dirName['name']
            res.send({'name': name});
        })
    }
}

let getFilmsByDirector = conn => {
    return (req, res) => {
        let id = req.params['id'];
        if (!id || !parseInt(id))
            return missingParams(res, "Invalid I.D., please ensure appropriate id");

        let filmQuery = `CALL GetFilmsByDirector(${id})`;

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