var express = require('express');

var app = express();

app.disable('x-powered-by');

var handlebars = require('express-handlebars').create({defaultLayout:'main'});

 app.engine('handlebars', handlebars.engine);

app.set('view engine','handlebars');

// MORE IMPORTS HERE


app.set('port', process.env.PORT || 3000);

app.use(express.static(__dirname + '/public'));

// Define some routes. app.get receives a path and a
// function and it defines our routes. The path isn't
// case sensitive and doesn't care about trailing path
// information.
// The req object represents the HTTP request and
// contains the query string, parameters, body, header
// The res object is the response Express sends
// when it receives a request
app.get('/', function(req, res){

  // Point at the home.handlebars view
  res.render('home');
});

// This is an example of middleware It receives a request
// object, response object and the next function
// As we look for the correct information to serve it executes
// and then next() says to continue down the pipeline
app.use(function(req, res, next){
  console.log('Looking for URL : ' + req.url);
  next();
});

// You can also report and throw errors
app.get('/junk', function(req, res, next){
  console.log('Tried to access /junk');
  throw new Error('/junk does\'t exist');
});

// Catches the error and logs it and then continues
// down the pipeline
app.use(function(err, req, res, next){
  console.log('Error : ' + err.message);
  next();
});

// If we want /about/contact we'd have to define it
// before this route
app.get('/about', function(req, res){
  // Point at the about.handlebars view
  // Allow for the test specified in tests-about.js
  res.render('about');
});


// Defines a custom 404 Page and we use app.use because
// the request didn't match a route (Must follow the routes)
app.use(function(req, res) {
 // Define the content type
 res.type('text/html');

 // The default status is 200
 res.status(404);

 // Point at the 404.handlebars view
 res.render('404');
});

// Custom 500 Page
app.use(function(err, req, res, next) {
 console.error(err.stack);
 res.status(500);

 // Point at the 500.handlebars view
 res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started press Cctrl-c to terminate');
});
