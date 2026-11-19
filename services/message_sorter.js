// Import Google GenAI and Type to work with the Gemini API
const { GoogleGenAI, Type } = require('@google/genai')

// Import the list of college departments from the JSON file
const departments = require('./departments.json')

// Convert the departments list into a JSON string
const departmentsString = JSON.stringify(departments)

// Create a Google GenAI instance
const genAI = new GoogleGenAI({})

// Export a function that identifies departments based on student feedback
module.exports = (feedbackComments) => {

    // Ask the LLM to find the departments that best match the feedback

    const prompt = `Return a list of the most likely college department or departments
    to handle these feedback comments. A list of possible departments and a description
    of their services is included.
    Only include departments that seem to be a good fit for the feedback comments.
    If there does not seem to be a good match, return an empty list.
    Feedback comments: ${feedbackComments}
    Department choices: ${departmentsString}`

    // Send the prompt to Gemini and request a JSON response
    return genAI.models.generateContent({
        model: 'gemini-3.5-flash-lite',
        contents: prompt,
        config: {
            // Specify that the response should be in JSON format
            responseMimeType: 'application/json',

            // Define the expected structure of the response
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.STRING
                }
            }
        }

    // Process the response returned by Gemini
    }).then(response => {

        // Convert the JSON response into a JavaScript array
        return JSON.parse(response.text)
    })
}

// Example test for checking which department handles elevator complaints
// sorter('the elevators are slow??').then(response => console.log(response))
