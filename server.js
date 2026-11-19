
 // Import Express to create the web server
const express = require('express');

// Import path to work with folder and file locations
const path = require('path');

// Import body-parser to read data submitted through forms
const bodyParser = require('body-parser');


// Import the routes for the home page and feedback form
const indexRouter = require('./routes/index');

// Import the routes for the admin page
const adminRouter = require('./routes/admin');

// Create the Express application
const app = express();

// Allow the app to read data submitted from HTML forms
app.use(bodyParser.urlencoded({ extended: false }));

// Set the location of the public folder
const staticFileLocation = path.join(__dirname, 'public');

// Allow Express to serve static files like CSS
app.use(express.static(staticFileLocation));

// Set the folder where the Handlebars templates are stored
app.set('views', path.join(__dirname, 'views'));

// Use Handlebars as the template engine
app.set('view engine', 'hbs');

// Use the index router for the home page and feedback form
app.use('/', indexRouter);

// Use the admin router for the admin page
app.use('/admin', adminRouter);

// Start the server on the assigned port or use 3000 by default
const server = app.listen(process.env.PORT || 3000, function () {
   // Display the port number when the server starts
   console.log('server running on port', server.address().port)
})
