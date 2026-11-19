const express = require('express')

// const databaseModels = require('../models/index')
const databaseModels = require('../models/') // { Feedback: the object that represents Feedback }
const Feedback = databaseModels.Feedback
const identifyDepartments = require('../services/message_sorter')

const router = express.Router()

router.get('/', function (req, res, next) {
    res.render('index', { title: 'Feedback app', author: 'Clara' })
})

router.get('/feedback-form', function (req, res, next) {
    res.render('student_feedback_form')
})



router.post('/submit-feedback', async function (req, res, next) {
    const formData = req.body
    console.log(formData)
    const comments = formData.comments
    let newFeedback
    let departmentList


    try {
        newFeedback = await Feedback.create(formData)
        res.render('thank_you', { ...formData })  // send user the thank you page and keep processing
    } catch (error) {
        console.error(`Error saving feedback because ${error}`, formData)
        return next(error)   // send control to the error handler and STOP processing in this function
    }

    try {
        departmentList = await identifyDepartments(formData.comments)
        console.log(`Departments are ${departmentList}`)
    } catch (error) {
        console.error(`Error identifying departments for comments ${comments} because ${error}`)
        return  // stop processing in this function
        // if this fails, do we tell the user? No - we can identify departments manually.
        // we do need to tell the developer
    }

    try {
        await Feedback.update(
            { departments: departmentList },   // what to change
            { where: { id: newFeedback.id } }   // which rows to change - only the row that matches the id
        )
    } catch (error) {
        console.error(`Error updating departments for comment ${comments} departments ${departmentList} because ${error}`)
    }

})




// router.post('/submit-feedback', function (req, res, next) {
//     const formData = req.body
//     console.log(formData)
//     // res.render('thank_you', {
//     //     name: formData.name,
//     //     email: formData.email,
//     //     comments: formData.comments,
//     //     isCurrentStudent: formData.isCurrentStudent
//     // })

//     Feedback.create(formData).then((newFeedback) => {    // this code will run if the feedback is saved
//         res.render('thank_you', { ...formData })
//         identifyDepartments(formData.comments).then(departmentList => {
//             // update the new feedback that was just saved and add the departments.
//             Feedback.update(
//                 { departments: departmentList },   // what to change
//                 { where: { id: newFeedback.id } }   // which rows to change - on
//             )
//         })

//     }).catch((error) => {
//         res.locals.message = 'Error saving feedback to database. Please try again later.'
//         next(error)
//     })

//     // TODO save and send the message to the relevant departments

// })

module.exports = router