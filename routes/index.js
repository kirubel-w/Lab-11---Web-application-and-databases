// Import Express to handle routes
const express = require('express')

// const databaseModels = require('../models/index')

// Import the database models, including the Feedback model
const databaseModels = require('../models/') // Contains the Feedback model
const Feedback = databaseModels.Feedback

// Import the function that uses the LLM to identify departments
const identifyDepartments = require('../services/message_sorter')

// Create an Express router
const router = express.Router()

// Display the home page
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Feedback app', author: 'Clara' })
})

// Display the student feedback form
router.get('/feedback-form', function (req, res, next) {
    res.render('student_feedback_form')
})



// Handle feedback submitted through the form
router.post('/submit-feedback', async function (req, res, next) {

    // Get the submitted form data
    const formData = req.body
    console.log(formData)

    // Get the student's comments
    const comments = formData.comments

    // Declare variables for the saved feedback and departments
    let newFeedback
    let departmentList


    try {
        // Save the submitted feedback to the database
        newFeedback = await Feedback.create(formData)

        // Show the thank-you page while the remaining tasks continue
        res.render('thank_you', { ...formData })

    } catch (error) {
        // Log an error if saving the feedback fails
        console.error(`Error saving feedback because ${error}`, formData)

        // Pass the error to Express and stop processing
        return next(error)
    }

    try {
        // Use the LLM to identify departments based on the comments
        departmentList = await identifyDepartments(formData.comments)

        // Display the identified departments in the console
        console.log(`Departments are ${departmentList}`)

    } catch (error) {
        // Log an error if the LLM cannot identify departments
        console.error(`Error identifying departments for comments ${comments} because ${error}`)

        // Stop processing if department identification fails
        return

        // The feedback is already saved, so departments can be assigned manually
        // The developer should still be informed about the error
    }

    try {
        // Update the saved feedback with the identified departments
        await Feedback.update(
            { departments: departmentList },   // Set the departments field
            { where: { id: newFeedback.id } }   // Update only the matching feedback record
        )

    } catch (error) {
        // Log an error if updating the departments fails
        console.error(`Error updating departments for comment ${comments} departments ${departmentList} because ${error}`)
    }

})




// Alternative way to handle feedback using promises instead of async/await
// router.post('/submit-feedback', function (req, res, next) {
//     const formData = req.body
//     console.log(formData)

//     // Display the thank-you page with the submitted information
//     // res.render('thank_you', {
//     //     name: formData.name,
//     //     email: formData.email,
//     //     comments: formData.comments,
//     //     isCurrentStudent: formData.isCurrentStudent
//     // })

//     // Save the feedback and continue once it is saved
//     Feedback.create(formData).then((newFeedback) => {
//         res.render('thank_you', { ...formData })

//         // Identify departments using the submitted comments
//         identifyDepartments(formData.comments).then(departmentList => {

//             // Add the identified departments to the saved feedback
//             Feedback.update(
//                 { departments: departmentList },   // Set the departments field
//                 { where: { id: newFeedback.id } }   // Update the record with the matching ID
//             )
//         })

//     }).catch((error) => {
//         // Show an error message if saving the feedback fails
//         res.locals.message = 'Error saving feedback to database. Please try again later.'
//         next(error)
//     })

//     // TODO: Save feedback and forward it to the appropriate departments

// })

// Export the router so the application can use it
module.exports = router
