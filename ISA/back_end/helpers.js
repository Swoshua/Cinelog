let errorHandler = (res, status_code, errorMsg, err='') => {
    if (err)
        console.log(err);

    res.status(status_code); 
    res.send({'success': false, 'error': errorMsg});
}

module.exports = {

    'missingParams': (res, errorMsg) => {
        res.status(400); // bad request error i.e. missing params
        res.send({'success': false, 'error': errorMsg});
    },

    'errorHandler': errorHandler

}
