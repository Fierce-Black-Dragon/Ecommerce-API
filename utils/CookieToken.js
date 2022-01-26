const cookieToken = (user, res) => {
     const token = user.jwtTokenCreation();
           const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            };
            res.status(200).cookie("auth_token", token, options).json({
                success: true,
                email: user.email, 
                userId: user._id,
               
             })
}
module.exports = cookieToken;