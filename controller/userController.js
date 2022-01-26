const UserModel = require('../model/User');
const cookieToken = require('../utils/CookieToken');

exports.signup = async (req, res) => {
    try {
        const { name, email, password, confirmPassword, role, } = req.body;
        if (!(name && email && password && confirmPassword)) {
          
            res.status(404).send({
                success: false,
                error: "all fields are required"
            })
        }
        
        const existingUser = await UserModel.findOne({ email: email });
        if (existingUser) {
    
            res.status(404).send({ error: 'user already exists'})
        }
    
        const user = await UserModel.create({
            name,
            email,
            password,
        });

       cookieToken(user,res)


    
    } catch (error) {
      console.log (error)  
    }


}