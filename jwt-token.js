// after installing node jwt package



// this is to generate a jwt token usable on different Schemas and etc.. this example is from my Blog project
// which means it won't work on every code without tweaking and changing details


// after declaring ssecret key in .env file, we can proceed to making a jwt generating funciton 

userSchema.methods.generateAuthToken = function() { //schema name and function name can be modified
    const token = jwt.sign({
        email: this.email,
        userId: this._id,
        isAdmin: this.isAdmin
        // all the details which u want jwt to store
     }, 
        process.env.JWT_KEY
     ,
     {
        expiresIn:"15m" // anytime can be set
     });

    return token
}

// this is to generate a user token after it registers or logins on the web


const token = user.generateAuthToken();
   res.cookie('token', token, {
      httpOnly: true
   }).redirect('/blog/home');
     


// this is the middleware function which checks if the user is authenticated or not using jwt token stored in the browser

module.exports = function auth(req, res, next) {
    const token = req.cookies.token;
    if (!token) return res.status(401).send('Access denied. No token provided')

    try{
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.user = decoded;
        next();
    } catch (ex) {
        res.redirect('/user/login'); // any result can be put here
    }
}