// Import Express to create the routes
const express = require('express')

// Create a router for the admin page
const router = express.Router()

// Import the Feedback model from the models folder
const Feedback = require('../models').Feedback

// Handle GET requests to the admin page
router.get('/', async function (req, res, next) {
    // Retrieve all feedback records and display them on the admin page

    try {
        // Get all feedback records from the database
        const allFeedback = await Feedback.findAll()

        // Send the feedback data to the admin template
        res.render('admin', { feedback: allFeedback })

    } catch (error) {
        // Log an error if the feedback cannot be retrieved
        console.error(`Error fetching all feedback for the admin page`)

        // Pass the error to Express for handling
        return next(error)
    }

    // Another way to retrieve feedback using .then() instead of async/await
    // Feedback.findAll().then(allFeedback => {
    //     console.log(allFeedback)
    //     return res.render('admin', { feedback: allFeedback })
    // })
})

// Export the router so it can be used in the app
module.exports = router
