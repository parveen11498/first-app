const bcrypt = require("bcryptjs");
const jwt=require("jsonwebtoken");

const { signInSchema,signUpSchema,validate,}=require("../shared/schema");
const db=require("../shared/mongo");


const emailFormat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
module.exports={
    async signIn(req, res){
        try {
            //request body validation
            const isError = await validate(signInSchema, req.body);
            if (isError) return res.status(400).json({ message: isError })
            //check user exists or not
            let user = await db.users.findOne({ email: req.body.email, active: true })
            if (!user)
                return res.status(401).json({ message: "user doesnt exists" })
                if (!user.active)
                return res.status(401).json({ message: "user is inactive" })
                //check passowrd
           const isValid = await bcrypt.compare(req.body.password,user.password)
            if (isValid) {
                delete user.password;
                console.log(user);
                const authToken=jwt.sign({_id: user._id}, process.env.JWT_SECRET,process.env.JWT_EXPIRES_IN)
                console.log(authToken);
                res.json({ message: " user signed in successfully" });
    
            }
             else {
                res.status(401).json({ message: " email and password doesnt match" })
            }
        } catch (err) {
            console.error(err);
            res.Status(500).json({ message: "error while signin" })
        }
    },

    async signUp(req, res){
        try {
            const isError = await validate(signUpSchema, req.body)
            if (isError) return res.status(400).json({ error: isError });
          
            let user = await db.users.findOne({ email: req.body.email })
    
            if (user)
                return res.status(400).json({ message: "user already exists" })
    
            //Encrypt the password
            req.body.password =await bcrypt.hash(
            req.body.password, 
            await bcrypt.genSalt()
            );
            
            delete req.body.cpassword;
    
            //insert into user collection
            user = await db.users.insertOne({...req.body, active:true, createdOn: new Date()});
            res.json({ message: "user signedup successfully!!" })
    
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "error while signup" })
        }
    
    
    },

  
}