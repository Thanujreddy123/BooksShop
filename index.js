//These are the modules required comment
var express = require("express");
var http = require("http");
var path = require("path");
var exphbs = require('express-handlebars');

// Construct the actual express object we will use
var app = express();

// Set up handlebars
var handlebars = exphbs.create({defaultLayout: 'hellomain'});
app.engine('.handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.use(express.static('views'));

var support=require("./model/model");

// If home page requested, display the home page
app.get("/", function(request, response) { 
    response.render("home");
});

//This will display the books
app.get("/books", function(request, response) { 
    response.render("books",{books:support.getBooks()});
});


//This will display the order form 
app.get("/orderform", function(request, response) { 
    response.render("orderformerrorsall", {previous: support.getPrevious(null)});
});

//Creates an order with quantity and books from request query parameters for the "/order" endpoint
app.get("/order", function(request, response, next) {
    request.order = support.createOrder( 
                                        request.query.quantity, 
                                        request.query.book);

    next();
});

// books ordered.  Validate inputs
app.get("/order", function(request, response, next) {

    // Call support method to find errors in order
    var errors = support.validateOrder(request.order);

    if (Object.keys(errors).length === 0) { // No errors in object
        next(); // No errors, so continue normal route
    }
    else {
        request.errorlist = errors; // At least one error, so add object to request  
        next(new Error("order"));   // and follow error route
    }
});


//This is compute the cost of the books
app.get("/order", function(request, response, next) {
    request.order = support.addCost(request.order);
    next();
});

//This is will print the receipt 
app.get("/order", function(request, response){   
    response.render("receipt",{order:request.order});
});


//This will handle errors in the same page
    app.use("/order", function(err, request, response, next) {
        if (err.message.includes("order")) {
            response.render("orderformerrorsall", {previous: support.getPrevious(request.order),
                                                 errors: request.errorlist}); 
        }
        else {
            next(err); // If not an "order" error continue error routing
        }
        });

//This display the "404" if you cant find page or file
app.use(function(request,response){
    response.render("404");
});

//This will display when you have the server error
app.use(function(err, request, response, next) {
    console.log(err);
    response.writeHead(500, {'Content-Type': 'text/html'});
    response.end('<html><body><h2>Server error!</h2></body></html>');
});
//Listen on port 3000 for incoming connections
http.createServer(app).listen(3000);