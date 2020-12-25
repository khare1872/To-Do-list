const express = require("express");
const app = express();
const bodyparser = require("body-parser");

var items = ["Wake Up Early :))"];
app.set('view engine','ejs');

app.use(bodyparser.urlencoded({extended: true}));
app.use(express.static("public"));
app.get("/",function(req,res){
  var today = new Date;
  var options = {
    weekday:"long",
    day:"numeric",
    month:"long"
  };

  var day = today.toLocaleDateString("en-US", options);


res.render("index",{kindOfDay:day, newItem: items});
});

app.post("/",function(req,res){
  var item = req.body.newItem;
  items.push(item);
  res.redirect("/");
})


app.listen(3000,function(){
  console.log("server is up")
});
