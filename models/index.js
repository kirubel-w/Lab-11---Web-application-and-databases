// Import Sequelize to connect to the database
const { Sequelize } = require('sequelize');

// Set up the SQLite database configuration
const configuration = {
    'storage': 'feedback.sqlite',
    'dialect': 'sqlite'
};

// Create a connection to the SQLite database
const sequelizeDatabase = new Sequelize(configuration);

// Import the function that creates the Feedback model
const createFeedbackTable = require('./feedback');

// Create the Feedback model using the database connection
const feedbackModel = createFeedbackTable(sequelizeDatabase);

// Create an empty object to store the models
const models = {}

// Get the name of the Feedback model
const feedbackModelName = feedbackModel.name;

// Add the Feedback model to the models object
models[feedbackModelName] = feedbackModel;

// Export the models so other files can use them
module.exports = models;
