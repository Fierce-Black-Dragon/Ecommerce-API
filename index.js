const app = require('./app')
require('dotenv').config();

const PORT = process.env.PORT || 4000

// server start
app.listen(PORT, (req, res) => {
    console.log(`Server started listening on port :- ${PORT}   ............!!!!!!`)
})