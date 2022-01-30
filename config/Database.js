

const mongoose = require('mongoose')
const mongoDbUrL = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gqyqk.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
const connectionWithDB = () => {
     mongoose.connect(mongoDbUrL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
       
    })
        .then(() => {
            console.log('Connected to mongoDB');
        })
        .catch(err => {
            console.log(err);
        })
}
module.exports = connectionWithDB;