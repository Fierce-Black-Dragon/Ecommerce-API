const UserModel = require('../model/User');
const cookieToken = require('../utils/CookieToken');
const  cloudinary = require('cloudinary').v2;
exports.signup = async (req, res) => {
    try {
        const { name, email, password, role, } = req.body;
        let responseImage;
        console.log(req.files);
        if (req.files) {
            const file = req.files.profile
            console.log(file);
              responseImage = await cloudinary.uploader.upload(file.tempFilePath, {
            folder: "users",
            width: 150,
            crop: "scale"
        });
  
             }
        if (!(name && email && password )) {
          
            res.status(404).json({
                success: false,
                error: "all fields are required"
            })
        }
       console.log(responseImage);
        const existingUser = await UserModel.findOne({ email: email });
        if (existingUser) {
    
            res.status(404).send({ error: 'user already exists'})
        }
    console.log(password)
        const user = await UserModel.create({
            name,
            email,
            password,
              profilePhoto: {
        id:responseImage.public_id ,
        secured_Url:  responseImage.secure_url,
        
    }

        });

     cookieToken(user,res)
console.log(user);

    
    } catch (error) {
console.log(error)  
    }


}



