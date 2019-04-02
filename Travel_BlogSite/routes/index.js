
var express=require("express");
var router=express.Router();
var passport=require("passport");
var User=require("../models/user");

var app = router;

app.get("/",function(req,res){
    res.render("index");
});


///auth routes
app.get("/register",function(req,res){
    res.render("register");
});

app.post("/register",function (req,res) {
    var newuser = new User({username:req.body.username});
    User.register(newuser,req.body.password,function(err,user){
        if(err){
            req.flash("error",err.message);
            return res.render("register");
        }
        else{
            passport.authenticate("local")(req,res,function(){
                req.flash("success","Hello "+user.username);
                res.redirect("/char_page");
            });
        }
    });
});

//login..
app.get("/login",function (req,res) {
    //console.log(req.flash("error"));
    res.render("login");
});

app.post("/login",passport.authenticate("local",
    {
        successRedirect:"/char_page",
        failureRedirect:"/login"
    }
),function(req,res){

});

app.get("/logout",function(req,res){
    req.logout();
    req.flash("success","Logged Out Successfully...");
    res.redirect("/char_page");
});

function isLoggedIn(req,res,next){
    if (req.isAuthenticated()){
        return next();
    }
    req.flash("error","Please Login First");
    res.redirect("/login");
}

module.exports=app;