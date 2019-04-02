
var express=require("express");
var router=express.Router();

var app = router;

var Charray = require("../models/Charray");
var Comment=require("../models/comment");

app.get("/char_page/:id/comments/new",isLoggedIn,function (req,res) {
    Charray.findById(req.params.id,function(err,char){
        if(err){
            console.log(err);
        }
        else{
            res.render("new_comment",{comments:char});
        }
    });

});

app.post("/char_page/:id/comments",isLoggedIn,function(req,res){
    Charray.findById(req.params.id,function(err,char){
        if(err){
            console.log(err);
            res.redirect("/char_page");
        }
        else{
            Comment.create(req.body.comment,function(err,com){
                if (err){
                    req.flash("error","Something went wrong");
                    console.log(err);
                }
                else{
                    //console.log(com);
                    com.Author.id=req.user._id;
                    com.Author.username=req.user.username;
                    com.save();
                    char.comments.push(com);
                    char.save();
                    req.flash("success","Comment Added...");
                    res.redirect("/char_page/"+char._id);
                }
            });
        }
    });
});

app.get("/char_page/:id/comments/:comment_id/edit",comment_ownership,function(req,res){
    Comment.findById(req.params.comment_id,function(err,foundComment){
       if(err){
           res.redirect("back");
       }
       else{
           res.render("comment_edit", {char_id:req.params.id, comment:foundComment})
       }
    });

});

app.put("/char_page/:id/comments/:comment_id",comment_ownership,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,UpdatedComment){
        if(err){
            res.redirect("back");
        }
        else{
            res.redirect("/char_page/"+req.params.id);
        }
    });

});

app.delete("/char_page/:id/comments/:comment_id",comment_ownership,function(req,res){
    Comment.findByIdAndDelete(req.params.comment_id,function(err){
        if (err) {
            res.redirect("back");
        }
        else{
            res.redirect("/char_page/"+req.params.id);
        }
    });
    //res.send("Delete Page");
});

function isLoggedIn(req,res,next){
    if (req.isAuthenticated()){
        return next();
    }
    req.flash("error","Please Login First");
    res.redirect("/login");
}

function comment_ownership(req,res,next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function (err, foundComment) {
            if (err) {
                res.redirect("back");
            }
            else {
                if (foundComment.Author.id.equals(req.user._id)) {
                    next();
                }
                else {
                    req.flash("error","You do not have permission!!");
                    res.redirect("back");
                }

            }
        });
    }
    else{
        res.redirect("back");
    }
}

module.exports=app;
