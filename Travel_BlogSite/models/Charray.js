var mongoose = require("mongoose")

var dbzschema=new mongoose.Schema({
    name:String,
    url:String,
    Description:String,
    location:String,
    lat:Number,
    lng:Number,
    author:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username:String
    },
    comments:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Comment"
        }
    ]
});

var Charray=mongoose.model("Charray",dbzschema);

module.exports=Charray;