let express = require('express');
let multer = require('multer');
let mysql = require('mysql');
let path = require('path');
let bodyParser = require('body-parser');

const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb){
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
})

const upload = multer({
    storage: storage
}).single('pic_image');

// let upload = multer({ dest: 'movies/'});
const app = express();

const PORT = process.env.PORT || 8000;

console.log("path: " + (path.join(__dirname, '../images/posters')))

app.use('/images', express.static(path.join(__dirname,'../front_end/images')));
app.use('/html', express.static(path.join(__dirname, '../front_end/html')));
app.use('/css', express.static(path.join(__dirname, '../front_end/css')));
app.use('/js', express.static(path.join(__dirname, '../front_end/js')));
app.use('/img', express.static(path.join(__dirname, '../front_end/img')));
app.use('/vendor', express.static(path.join(__dirname, '../front_end/vendor')));

app.use(express.static('./public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let conn = mysql.createConnection({
    host: "jos-test.c4ztbtstxmqe.us-east-1.rds.amazonaws.com",
    user: "admin",
    password: "Jerome2020",
    database: "FilmCritic"
});

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('X-Content-Type-Options', 'nosniff');
    next();
});

app.use('/images', express.static(path.join(__dirname,'../images')));
app.use('/html', express.static(path.join(__dirname, '../front_end/html')));
app.use('/css', express.static(path.join(__dirname, '../front_end/css')));
app.use('/js', express.static(path.join(__dirname, '../front_end/js')));
app.use('/img', express.static(path.join(__dirname, '../front_end/img')));
app.use('/vendor', express.static(path.join(__dirname, '../front_end/vendor')));

app.use(express.static('./public'));


conn.connect((err) => {
    if (err) throw err;
    console.log("Connected!");
});

app.get('/hello-world', (req, res) => {
    res.send('hello');
});

/* Below lines of code set up multiple routes for us, each defined by the 
   relevant function, named after the RESTful resource they handle routes for. */
app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if(err){
            res.render('index');
        } else {
            if(req.file == undefined){
                res.send({'error': 'No file uploaded'})
            } else {
                res.send({'image_url' : `uploads/${req.file.filename}`});
            }
        }
    })
})

require('./film')(app, conn);
require('./session').setUpRoutes(app, conn);
require('./director')(app, conn);
require('./actor')(app, conn);
require('./user')(app, conn);
require('./upload')(app, conn);


app.listen(PORT, () => {
    console.log(`listening on port: ${PORT}`);
});
