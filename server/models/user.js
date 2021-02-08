const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    pic:{
        type:String,
        default:"https://res.cloudinary.com/anamay/image/upload/v1612726614/109135379-stock-vector-photo-not-available-vector-icon-isolated-on-transparent-background-photo-not-available-logo-concept_a7rt9n.jpg"
    },
    followers:[{type:ObjectId,ref:"User"}],
    following:[{type:ObjectId,ref:"User"}]
})

mongoose.model("User",userSchema)