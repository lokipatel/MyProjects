var express = require("express"),
    app= express(),
    mongoose = require("mongoose")
    Charray= require("./models/Charray"),
    passport=require("passport"),
    LocalStrategy=require("passport-local"),
    User= require("./models/user"),
    SeedDB = require("./seeds"),
    methodOverride=require("method-override"),
    flash=require("connect-flash"),
    Comment = require("./models/comment")

var commentRoutes = require("./routes/comments"),
    char_arrayRoutes = require("./routes/char_page"),
    authRoutes=require("./routes/index")

//SeedDB();
mongoose.connect("mongodb://localhost/fighter",{ useNewUrlParser: true });
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());
var bodyParser=require("body-parser");

app.use(bodyParser.urlencoded({extended:true}));

app.use(require("express-session")({
    secret:"Dbz fighters are the best",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser=req.user;
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
    next();
});

app.use(commentRoutes);
app.use(char_arrayRoutes);
app.use(authRoutes);

app.listen(8888,function(){
    console.log("TravelBlog Server has started...");
});

