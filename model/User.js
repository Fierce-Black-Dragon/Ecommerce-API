const mongoose = require('mongoose')
const validator = require('validator')
const bycrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength:[40,' max 40 character']
    },
    email: {
        type: String,
        required: [true, 'Please enter the email address'],
        unique: true,
        validate:[validator.isEmail,'Please enter a valid email address' ]
    },
    password: {
        type: String,
        required: [true, 'Please enter the password'],
        minlength:[6, 'Please enter password greater than or equal to 6 char'], 
    },
    role: {
        type: String,
        default: 'user'
    },
    profilePhoto: {
        id: {
            type: String,
           
        },
        secured_Url: {
            type: String,
        }
    },
    forgotPasswordToken: {
        type: String,

    },
    forgotPasswordTokenExpiry: {
        
    }
// more fields will be added when required



});


// mongoose hooks
//encrypt password



module.exports = mongoose.model('User',userSchema)