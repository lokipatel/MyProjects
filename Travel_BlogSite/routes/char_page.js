

var express=require("express");
var router=express.Router();
var NodeGeocoder=require("node-geocoder");


var options = {
    provider: 'google',
    httpAdapter: 'https',
    apiKey: 'AIzaSyA4muniDWVKXNWxn4nFIclF9uLiDUXDn0I',
    formatter: null
};

var geocoder = NodeGeocoder(options);
var app = router;

var Charray = require("../models/Charray");


app.get("/char_page",function(req,res){
    //console.log(req.user);
    //res.render("char_page.ejs",{characters:ch_array});
    Charray.find({},function(err,char){
        if (err){
            console.log("cannot find");
        }
        else{
            res.render("char_page",{characters:char,currentUser:req.user});
        }
    });

});

// app.post("/char_page/new",isLoggedIn,function(req,res){
//     var name=req.body.name;
//     var url=req.body.url;
//     var desc=req.body.Description;
//     var author={
//         id:req.user._id,
//         username:req.user.username
//     }
//     Charray.create({
//             name: name,
//             url:url,
//             Description:desc,
//             author:author
//         },
//         function(err,char){
//             if (err){
//                 console.log("Error occurred...");
//             }
//             else{
//                 console.log(char.name," has been added...");
//                 res.redirect("/char_page");
//             }
//         }
//     );
//
// });

//CREATE - add new campground to DB
app.post("/char_page/new", isLoggedIn, function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var url = req.body.url;
    var desc = req.body.Description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    geocoder.geocode(req.body.location, function (err, data) {
        if (err || !data.length) {
            console.log(err);
            req.flash('error', 'Invalid address');
            return res.redirect('back');
        }
        var lat = data[0].latitude;
        var lng = data[0].longitude;
        var location = data[0].formattedAddress;
        var newChar = {
            name: name,
            url: url,
            description: desc,
            author:author,
            location: location,
            lat: lat,
            lng: lng
        };
        // Create a new campground and save to DB
        Charray.create(newChar, function(err, char){
            if(err){
                console.log(err);
            } else {
                //redirect back to campgrounds page
                console.log(char.name+" has been added...");
                res.redirect("/char_page");
            }
        });
    });
});

app.get("/char_page/new",isLoggedIn,function(req,res){
    res.render("new.ejs");
});

app.get("/char_page/:id",function (req,res) {
    Charray.findById(req.params.id).populate("comments").exec(function(err,char){
        if (err){
            console.log("Error occurred in id");
        }
        else{
            res.render("show",{characters:char});
        }
    });

});

app.get("/char_page/:id/edit",check_ownership,function(req,res){

        Charray.findById(req.params.id,function(err,char){

                    res.render("edit",{char: char});
        });

});

// app.put("/char_page/:id",check_ownership,function(req,res){
//     Charray.findByIdAndUpdate(req.params.id,req.body.char,function(err,updatedchar){
//         if(err){
//             res.redirect("/char_page");
//         }
//         else{
//             res.redirect("/char_page/"+ updatedchar._id);
//         }
//     })
// });

// UPDATE CAMPGROUND ROUTE
app.put("/char_page/:id", check_ownership, function(req, res){
    geocoder.geocode(req.body.location, function (err, data) {
        if (err || !data.length) {
            console.log("You are here..\n");
            console.log(err);
            req.flash('error', 'Invalid address');
            return res.redirect('back');
        }
        req.body.char.lat = data[0].latitude;
        req.body.char.lng = data[0].longitude;
        req.body.char.location = data[0].formattedAddress;

        Charray.findByIdAndUpdate(req.params.id, req.body.char, function(err, char){
            if(err){
                req.flash("error", err.message);
                console.log(err);
                res.redirect("back");
            } else {
                req.flash("success","Successfully Updated!");
                res.redirect("/char_page/" + char._id);
            }
        });
    });
});

app.delete("/char_page/:id",check_ownership,function(req,res){
    Charray.findByIdAndDelete(req.params.id,function (err) {
        if(err){
            res.redirect("/char_page");
        }
        else{
            req.flash("success","Successfully Deleted!");
            res.redirect("/char_page");
        }
    })
});

function isLoggedIn(req,res,next){
    if (req.isAuthenticated()){
        return next();
    }
    req.flash("error","Please Login First");
    res.redirect("/login");
}

function check_ownership(req,res,next) {
    if (req.isAuthenticated()) {
        Charray.findById(req.params.id, function (err, char) {
            if (err) {
                req.flash("error","Campground not found");
                res.redirect("back");
            }
            else {
                if (char.author.id.equals(req.user._id)) {
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
        req.flash("error","You need to be logged in!!");
        res.redirect("back");
    }
}

module.exports=app;