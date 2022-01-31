const UserModel = require('../model/User');
const cookieToken = require('../utils/CookieToken');
const  cloudinary = require('cloudinary').v2;
exports.signup = async (req, res) => {
    try {
        const { name, email, password, role, } = req.body;
        let responseImage;
    
      // checking if file is send 
        if (!req.files) {
          res.status(400).json({error: ' profileImage is missing'})
        }
 const file = req.files.profile
            console.log(file);
              responseImage = await cloudinary.uploader.upload(file.tempFilePath, {
            folder: "users",
            width: 150,
            crop: "scale"
        });
  
        //finding if any filed is pending
        if (!(name && email && password )) {
          
            res.status(404).json({
                success: false,
                error: "all fields are required"
            })
        }
  //finding if user is already register
        const existingUser = await UserModel.findOne({ email: email });
        if (existingUser) {
    
            res.status(404).send({ error: 'user already exists'})
        }
   //creating user in mongo db
        const user = await UserModel.create({
            name,
            email,
            password,
              profilePhoto: {
        id:responseImage.public_id ,
        secured_Url:  responseImage.secure_url,
        
    }

        });
//token creation function
     cookieToken(user,res)
console.log(user);

    
    } catch (error) {
console.log(error)  
    }


}


exports.Login = async (req, res) => {
    try {
        const { email, password } = req.body;
    
        //finding if any filed is pending
        if (!( email && password )) {
          
            res.status(404).json({
               
                error: "email or password is missing"
            })
        }
  //finding the user in database  using email
        const user = await UserModel.findOne({ email }).select("+password");
   //if user is not found
        if (!user) {
    
            res.status(404).send({ error: 'email or password incorrect'})
        }
        // checking  if enter password is correct
        const isPAsswordCorrect = await user.isPasswordValid(password)
        if (!isPAsswordCorrect) {
              res.status(404).send({ error: 'email or password incorrect'})
        }
   
//token creation function
     cookieToken(user,res)


    
    } catch (error) {
console.log(error)  
    }


}


// {
//     "name":"oneU" ,
//     "email" :"oneU@dev.com",
//      "password": "1234s5"    
     
// }
