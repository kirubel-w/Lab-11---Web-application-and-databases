const { Sequelize } = require('sequelize');

const configuration = {
    'storage': 'feedback.sqlite',
    'dialect': 'sqlite'
};

const sequelizeDatabase = new Sequelize(configuration);

const createFeedbackTable = require('./feedback');
const feedbackModel = createFeedbackTable(sequelizeDatabase);

const models = {}
const feedbackModelName = feedbackModel.name;

models[feedbackModelName] = feedbackModel;

module.exports = models;