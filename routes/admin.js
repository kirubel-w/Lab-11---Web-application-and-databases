const express = require('express')
const router = express.Router()
const Feedback = require('../models').Feedback

router.get('/', async function (req, res, next) {
    // Get all the feedback and display on a page

    try {
        const allFeedback = await Feedback.findAll()
        res.render('admin', { feedback: allFeedback })
    } catch (error) {
        console.error(`Error fetching all feedback for the admin page`)
        return next(error)
    }

    // Feedback.findAll().then(allFeedback => {
    //     console.log(allFeedback)
    //     return res.render('admin', { feedback: allFeedback })
    // })
})

module.exports = router