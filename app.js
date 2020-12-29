//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const mongoose = require("mongoose");
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-Shubham:<K238@ahm>@cluster0.tdd8r.mongodb.net/<todolistDB>?retryWrites=true&w=majority", {
  useNewUrlParser: true
});

const itemsSchema = new mongoose.Schema({
  name: String,
});

const Item = mongoose.model("Item", itemsSchema);
const item1 = new Item({
  name: "Have to complete all tasks",
});

const defaultItems = [item1];

const listSchema = {
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);


app.get("/", function(req, res) {

  Item.find(function(err, foundItems) {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function(err) {
        if (err) console.log("Error");
        else console.log("Success");
      });
      res.redirect("/");
    } else {

      res.render("list", {
        listTitle: "Today",
        newListItems: foundItems
      });
    }

  });




});

app.post("/", function(req, res) {

  const itemName = req.body.newItem;
  const listName = req.body.list;
  const item = new Item({
    name: itemName
  });

  if (listName === "Today") {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({
      name: listName
    }, function(err, foundList) {
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    });
  }


});

app.post("/delete", function(req, res) {
  const itemid = req.body.checkbox;
    const listName = req.body.listName;

    if(listName==="Today"){
      Item.findByIdAndRemove(itemid, function(err) {
        if (err) console.log("error");
        else {
          console.log("Successfully Deleted");
          res.redirect("/");
        }
      });
    }
    else {
      List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: itemid}}}, function(err, foundList){
        if (!err){
          res.redirect("/" + listName);
        }
      });
    }

});

app.get("/:customListName", function(req, res) {
  const customListName = _.capitalize(req.params.customListName);
  List.findOne({
    name: customListName
  }, function(err, foundList) {
    if (!err) {
      if (!foundList) {
        const list = new List({
          name: customListName,
          items: defaultItems
        });
        list.save();
        res.redirect("/" + customListName);
      } else {
        res.render("list", {
          listTitle: foundList.name,
          newListItems: foundList.items
        })
      }
    }

  });
  const list = new List({
    name: customListName,
    items: defaultItems
  });
  list.save();
});

app.get("/about", function(req, res) {
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
