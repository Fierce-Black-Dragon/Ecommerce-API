const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

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



//encrypt password before save -- mongoose Hook
userSchema.pre('save', async function (next) {
    //to prevent over-encryption of password
    if (!(this.isModified('password'))) { return next(); }
    //encrypt
    this.password = await bcrypt.hash(this.password, 10);
})
// Mongoose Methods
//user password validate method
userSchema.methods.isPasswordValid =  async function (senderPassword) {

    return await bcrypt.compare(senderPassword,this.password)
    
}

module.exports = mongoose.model('User',userSchema)