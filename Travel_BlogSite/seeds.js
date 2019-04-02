var mongoose = require("mongoose");
var Charray= require("./models/Charray");
var Comment=require("./models/comment");

var data = [
    {
        name: "Goku and Hit",
        url:"https://cdn.vox-cdn.com/thumbor/JT_Yum7WOdkIxNT-lHt7akmiiHU=/0x0:640x360/1200x0/filters:focal(0x0:640x360):no_upscale()/cdn.vox-cdn.com/uploads/chorus_asset/file/13681798/Hit_and_Goku.png",
        Description:"As the two power up to fight again, we see Hit use his time skip technique again on Goku as he does another Killer Instinct-like combo. Goku looks like he’s out but he powers up again to punch Hit in the face. There is a funny moment where Hit crashes into Champa portrait. Beerus is laughing while Champa is not too happy about it"

    },
    {
        url:"https://pm1.narvii.com/6480/83fe70009b0292a60f5a185ec3e3ccb99514fbfd_hq.jpg",
        name:"Goku",
        Description:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum"
    }
]

function SeedDB(){
    Charray.remove({},function (err) {
        if (err){
            console.log(err);
        }
        else{
            console.log("Removed fighters");
            data.forEach(function(seed){
               Charray.create(seed,function(err,data){
                   if(err){
                        console.log(err);
                   }
                   else{
                        console.log("Added a fighter!!");
                        //comments
                       Comment.create({
                           text:"This fighter is awesome!!",
                           Author:"Loki"
                       },function (err,comment) {
                           if (err){
                               console.log(err);
                           }
                           else{
                               data.comments.push(comment);
                               data.save();
                               console.log("Created a new comment");
                           }
                       });
                   }
               })
            });
        }
    });
}

module.exports=SeedDB;

