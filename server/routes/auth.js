const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../keys')
const requireLogin = require('../middleware/requireLogin')



    router.post('/signup', (req, res) => {
        const { name, email, password, pic } = req.body
        if (!email || !name || !password) {
            return res.status(422).json({ error: "Please enter the required fields" })
        }
        bcrypt.hash(password, 12)
            .then(hashedpassword => {
                User.findOne({ email: email })
                    .then((savedUser) => {
                        if (savedUser) {
                            return res.status(422).json({ error: "User already exsist" })
                        }
                    })
                const user = new User({
                    email,
                    name,
                    password: hashedpassword,
                    pic
                })

                user.save()
                    .then(user => {
                        res.json({ message: "Saved Successfully" })
                    })
                    .catch(err => {
                        console.log(err)
                    })

            })
            .catch(err => {
                console.log(err)
            })
    })

router.post('/signin', (req,res)=>{
    const {email,password} = req.body 
    if(!email || !password){
        return res.status(422).json({error:"Please fill the relevant field"})
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
            return res.status(422).json({error:"Invalid Email or password"})
        }
        bcrypt.compare(password,savedUser.password)
        .then(doMatch=>{
            if(doMatch){
            //    res.json("Successfully signed in")
                const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
                const{_id,name,email,followers,following,pic} = savedUser
                res.json({token,user:{_id,name,email,followers,following,pic}})
        }
            else{
                res.status(422).json("Invalid Email or Password")
            }
        })
        .catch(err=>{
            console.log(err)
        })
    })
})

module.exports = router
