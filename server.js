var express=require("express");
var exphbs = require("express-handlebars");

var logger=require("morgan");
var mongoose=require("mongoose");
var axios=require("axios");
var cheerio=require("cheerio");
var db = require("./models");


var PORT = 3000;
var app = express();
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

mongoose.connect("mongodb://localhost/mongoscraper", {  useNewUrlParser: true });

  app.engine(
    "handlebars",
    exphbs({
      defaultLayout: "main"
    })
  );
  app.set("view engine", "handlebars");
  app.get("/scrape", function(req, res) {

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
        db.Article.deleteMany({}, function() {
          if(result.title && result.link && result.description ) {
            db.Article.create(result)
            .then(dbArticle =>{
              // View the added result in the console
              console.log(dbArticle);
              // res.render("articles",dbArticle);
  
            })
            .catch(function(err) {
              // If an error occurred, log it
              console.log(err.stack);
            });
          }
        });

        
      });
  
      // Send a message to the client
    });
  });
  app.get("/articles", function(req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
      .then(function(dbArticle) {
        // If we were able to successfully find Articles, send them back to the client
        res.render("articles",{dbArticle:dbArticle});
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        console.log(err);
      });
  });
  

  app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });
  
