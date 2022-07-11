const User = require('../model/user')
const Admin = require('../model/admin')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailer = require('nodemailer');
const mongoose = require('mongoose');

module.exports.Start = (req,res)=>{
    res.send({msg : "started"})
}


module.exports.userSignup = async (req, res) => {
    
    const new_user = new User({ ...req.body.user }) 
    const exituser = await User.findOne({ email: new_user.email })
    if (!exituser) {
        try {
            const string = await bcrypt.genSalt(6)
            new_user.password = await bcrypt.hash(new_user.password, string)
            var response = await new_user.save();
            res.send(response);
        }
        catch (err) {
            console.log(err)
            res.send({error:err});
        }
    }
    else {
        res.send("user already exists")
    }
}



module.exports.userLogin = async (req, res, next) => {
    try {
        const username = req.body.username
        const password = req.body.password
        let existuser = await User.findOne({email : username})
        if(!existuser){
            return res.send({error : "invalid username"})
        }
        let isvalid = await bcrypt.compare(password, existuser.password)
        if(!isvalid){
            return res.send({error :"invalid password"}) 
        }
        const token = jwt.sign({user:existuser}, process.env.SECRET_KEY,{expiresIn : '1hr'})
        res.send(token)
    }
    catch (err) {
        console.log(err)
        res.send({error : err})
    }

}    


module.exports.ForgetPassword = async (req, res, next) => {
    try {
        
        const email = req.body.email
        const user = await User.findOne({ email: email })
       
        if (user) {
            const randomString = await bcrypt.genSalt(7)
            
            let user_update =await User.findOneAndUpdate(
                {_id : user._id},
                {$set:{randomString : randomString}}
            )
            let result = await user_update.save()
            var transporter = mailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'office@gmail.com',
                    pass: 'office@123'
                }
            });
            let info = await transporter.sendMail({
                from: 'office@gmail.com', 
                to: email, 
                subject: "Password Reset", 
                text: `${process.env.backend_url}/user/verify/${user._id}/?s=${randomString}`, 
            }, function (error, info) {
                if (error) {
                    console.log(error);
                }
            });
            res.status(200).send({msg :"success"})
        }
        else {
            res.send({error :"not matched"})  
        }
    }
    catch (err) {
        console.log(err)
        res.send({error:err})
    }

}


module.exports.ForgetPasswordVerify = async (req, res, next) => {
    try {
        const tokenFromUser = req.query.s
        const user = await User.findById({ _id: mongoose.Types.ObjectId(req.params.id) })
        
        if (tokenFromUser === user.rndString) {
            res.redirect(`${process.env.frontend_url}/resetpassword/${req.params.id}/?s=${req.query.s}`)
        }
        else{
            res.send({error:"Token Not Matched / Token Expired"})
        }
    }
    catch (err) {
        res.send({error:err})
    }
}


module.exports.savePassword = async (req, res, next) => {
    
    try{
        const string = await bcrypt.genSalt(6)
        
        const hashPassword = await bcrypt.hash(req.body.password, string)
        await User.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(req.params.id) }, { $set: { password: hashPassword } })
        await User.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(req.params.id) }, { $unset: { randomString: '' } })
        res.send({msg: "saved successfully"})
    }
    catch(err){
        console.log(err)
        res.send({error :err})
    }
}


module.exports.EmailVerificationSent = async(req,res)=>{
    try {
        let user = await User.findOne({_id : mongoose.Types.ObjectId(req.params.id)})

        var transporter = mailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'office@gmail.com',
                pass: 'office@123'
            }
        });
        let info = await transporter.sendMail({
            from: 'office@gmail.com', 
            to: user.email, 
            subject: "Account Verification", 
            text: `${process.env.backend_url}/user/account/verify/${req.params.id}`, 
        }, function (error, info) {
            if (error) {
                console.log(error);
            } 
        });
    } catch (error) {
        res.send({error :error})
    }
}

module.exports.EmailVerify = async (req, res, next) => {
    try{
        let response = await User.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(req.params.id)},{$set : {verification: "yes"}})
        res.redirect(`${process.env.frontend_url}/activated`)
    }
    catch (err) {
        res.send({error:err})
    }
}

module.exports.adminSignup = async (req, res, next) => {
    const new_admin = new Admin({ ...req.body.admin })
    const exitadmin = await Admin.findOne({ email: new_admin.email })
    if (!exitadmin) {
        try {
            const salt = await bcrypt.genSalt(6)
            new_admin.password = await bcrypt.hash(new_admin.password, salt)
            var response = await new_admin.save();
            res.send(response);
        }
        catch (err) {
            res.send({error:err});
        }
    }
    else {
        res.send({error:"admin already exists"})
    }


}

module.exports.AdminEmailVerificationSent = async(req,res)=>{
    try {
        let Main_admin = await Admin.findOne({role:"main"})
        let admin = await Admin.findOne({_id : mongoose.Types.ObjectId(req.params.id)})
        var transporter = mailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'office@gmail.com',
                pass: 'office@123'
            }
        });
        let info = await transporter.sendMail({
            from: 'office@gmail.com', 
            to: Main_admin.email, 
            subject: "Account Verification", 
            text: `${process.env.backend_url}/admin/account/verify/${admin._id}`, 
        }, function (error, info) {
            if (error) {
                console.log(error);
            } 
        });
    } catch (error) {
        
        res.send({error:error})
    }
}

module.exports.AdminEmailVerify = async (req, res, next) => {
    try{
        let response = await Admin.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(req.params.id)},{$set : {verification: "yes"}})
        res.redirect(`${process.env.frontend_url}/activated`)
    }
    catch (err) {
        res.send({error:err})
    }
}

module.exports.adminLogin = async (req, res, next) => {
    try {
        const username = req.body.username
        const password = req.body.password
        
        let existadmin = await Admin.findOne({username : username})
        
        if(!existadmin){
            return res.send({msg : "invalid username"})
        }
        let isvalid = await bcrypt.compare(password, existadmin.password)
        if(!isvalid){
            return res.send({msg :"invalid password"})
        }
        const token = jwt.sign({admin : existadmin}, process.env.SECRET_KEY,{expiresIn : '1hr'})
        res.send(token) 
    }
    catch (err) {
        console.log(err)
        res.send({msg : err})
    }

}

module.exports.adminForgetPassword = async (req, res, next) =>{
    try {
       
        const email = req.body.email
        const admin = await Admin.findOne({ email: email })
        
        if (admin) {
            const rndString = await bcrypt.genSalt(6)
            let admin_update =await Admin.findOneAndUpdate(
                {_id : mongoose.Types.ObjectId(admin._id)},
                {$set :{randomString : rndString }},
                {new:true}
            )
            var transporter = mailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'office@gmail.com',
                    pass: 'password'
                }
            });
            let info = await transporter.sendMail({
                from: 'office@gmail.com', 
                to: admin.email, 
                subject: "Password Reset",
                text: `${process.env.frontend_url}/admin/verify/${admin._id}/?${randomString}`, 
            }, function (error, info) {
                if (error) {
                    console.log(error);
                } 
            });
            res.status(200).send(admin_update)
        }
        else {
            res.send({error:"not matched"})
        }
    }
    catch (err) {
        res.send({error:err})
    }
}

module.exports.adminForgetPasswordVerify = async (req, res, next) => {
    try {
        const tokenFromAdmin = req.query.s
        const admin = await Admin.findById({ _id: mongoose.Types.ObjectId(req.params.id) })
        if (tokenFromAdmin === admin.randomString) {
            res.redirect(`${process.env.frontend_url}/admin/resetpassword/${req.params.id}/?s=${req.query.s}`)
        }
        else{
            res.send({error:"Token Not Matched / Token Expired"})
        }
    }
    catch (err) {
        res.send({error:err})
    }
}

module.exports.adminsavePassword = async (req, res, next) => {
    
    try{
        const string = await bcrypt.genSalt(6)
       
        const hashPassword = await bcrypt.hash(req.body.password, string)
        await Admin.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(req.params.id) }, { $set: { password: hashPassword } })
        await Admin.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(req.params.id) }, { $unset: { randomString: '' } })
        res.send({msg : "saved successfully"})
    }
    catch(err){
        res.send({error:err})
    }
}