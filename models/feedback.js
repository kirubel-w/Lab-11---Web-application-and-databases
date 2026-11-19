// Define the Feedback model, which sets up the database table
// and determines how feedback data is structured

const { DataTypes } = require('sequelize')

module.exports = (sequelizeDatabase) => {

    const Feedback = sequelizeDatabase.define(
        'Feedback',  // Specify the table name
        {   // Define the fields (columns) for the Feedback table
            name: {
                type: DataTypes.STRING,
                allowNull: true
            },
            email: {
                type: DataTypes.STRING,
                allowNull: true
            },
            comments: {
                type: DataTypes.STRING,
                allowNull: false
            },

            isCurrentStudent: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
                get() {
                    // Return 'yes' if the stored value is true, otherwise return 'no'
                    if (this.getDataValue('isCurrentStudent')) {
                        return 'yes'
                    } else {
                        return 'no'
                    }
                },
                set(newValue) {
                    // Change 'yes' to true and 'no' to false before saving to the database
                    if (newValue === 'yes') {
                        this.setDataValue('isCurrentStudent', true)
                    } else {  // Handle the 'no' value
                        this.setDataValue('isCurrentStudent', false)
                    }
                }
            }
            ,
            departments: {
                type: DataTypes.JSON,
                allowNull: true,
                defaultValue: []
            }

            // Sequelize automatically adds an ID and a createdAt column
        }
    )

    Feedback.sync({ force: false }).then(() => console.log('Created Feedback table'))

    return Feedback  // Return the Feedback model so it can be used elsewhere in the app
}
