

const mongoose = require('mongoose')
const mongoDbUrL = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gqyqk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
exports.connect = () => {
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