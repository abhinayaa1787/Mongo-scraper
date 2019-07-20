var express=require("express");
var exphbs = require("express-handlebars");

var logger=require("morgan");
var mongoose=require("mongoose");
var axios=require("axios");
var cheerio=require("cheerio");
var db = require("./models");


var PORT = process.env.PORT || 3000;
var app = express();
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoscraper";

mongoose.connect(MONGODB_URI);

// mongoose.connect("mongodb://localhost/mongoscraper", {  useNewUrlParser: true });

  app.engine(
    "handlebars",
    exphbs({
      defaultLayout: "main"
    })
  );
  app.set("view engine", "handlebars");
  app.get("/", function(req, res) {
    res.render("index");
  });


  app.get("/scrape", function(req, res) {
    var promiseArray = [];
    db.Article.deleteMany({}, function() {
    
    // First, we grab the body of the html with axios
      axios.get("http://www.nytimes.com/").then(function(response) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);
        // Now, we grab every h2 within an article tag, and do the following:
        $("article.css-8atqhb a").each(function(i, element) {
          // Save an empty result object
          var result = {};
          // Add the text and href of every link, and save them as properties of the result object
            result.title = $(this).children("div").find("h2").text();
            result.link = $(this).attr("href");
            result.description=$(this).children("p").text();
            // console.log($(this).children("p").text());
    // console.log(result);
          // Create a new Article using the `result` object built from scraping
          if(result.title && result.link && result.description ) {
            promiseArray.push(db.Article.create(result))
            // console.log(promiseArray.length + 'in');
          }
          

          
        });
        // console.log(promiseArray.length + 'out');
        Promise.all(promiseArray).then(dbArticle =>{
          // View the added result in the console
  res.render("articles",{data:dbArticle}) ;

  }).catch(function(err) {
    // If an error occurred, log it
    console.log(err.stack);
  });
    
        // Send a message to the client
      });
    });
  });
  app.get("/articles", function(req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
      .then(function(dbArticle) {
        // If we were able to successfully find Articles, send them back to the client
        // res.render("index",{dbArticle:dbArticle});
        res.json(dbArticle)              // res.render("articles",dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        console.log(err);
      });
  });
  app.get("/articles/:id", function(req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    console.log(req.params.id)
    db.Article.findOne({_id:req.params.id})     // ..and populate all of the notes associated with it
      // .populate("note")
      .then(function(dbArticle) {
        // If we were able to successfully find an Article with the given id, send it back to the client

        res.json(dbArticle);
        console.log(dbArticle)
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
  app.post("/articles/:id", function(req, res) {
    // Create a new note and pass the req.body to the entry
    db.Note.create(req.body)
      .then(function(dbNote) {
        // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
        // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
        // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
      })
      .then(function(dbArticle) {
        // If we were able to successfully update an Article, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
  
  
  
app.get("/saved",function(req,res){
  db.Saved.find({})
  .then(function(dbSaved){
    res.render("savedarticles",{data:dbSaved});
  });
});
  app.post("/saved",function(req,res){
    var saved={
      title:req.body.title,
      link:req.body.link,
      description:req.body.description
    };
    console.log(req.body);
    db.Saved.create(saved)
    .then(function(dbSaved){
        // If we were able to successfully update an Article, send it back to the client
        res.json(dbSaved);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  
    })
    app.get("/saved/:id", function(req, res) {
      console.log(req.params.id)
      db.Saved.deleteOne({ _id: req.params.id })
        .catch(function(err) {
          // If an error occurred, send it to the client
          res.json(err);
        });
    });
    
app.get("/delete",function(){
  db.Article.deleteMany({},function(err)
  {
    if (err){console.log(err)}
  });
})
  app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });
  
