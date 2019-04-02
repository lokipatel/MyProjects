var mongoose = require("mongoose");

var comment_schema= mongoose.Schema({
        text:String,
        Author:{
                id:{
                        type:mongoose.Schema.Types.ObjectId,
                        ref:"User"
                },
                username:String

        }
});

var Comment=mongoose.model("Comment",comment_schema);

module.exports=Comment;