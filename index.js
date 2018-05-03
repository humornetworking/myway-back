var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');



// configure app to use bodyParser()
// this will let us get the data from a POSTx
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



app.post('/create-book', function(req, res){
	var obj = {};
	var titulo = req.body.titulo;
	var texto = req.body.texto;
	var checkoutID = req.body.checkoutID;
	

	
	
	res.send(req.body);
});

app.use('/', express.static(__dirname + '/public'));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);