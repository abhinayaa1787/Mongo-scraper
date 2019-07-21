# Mongo Scraper
## Scrape the latest news from NYT and save your favorite articles


### Node packages installed in this 
* Express
* Express-handlebars
* Cheerio
* Axios
* Mongoose


Before running the server.js use terminal to install the above mentioned packages using the command ```` npm i ````


##### The index page has buttons and links to scrape articles from the NYT website. With axios and cheerio npm packges data is scraped!

#####After scraping the data is saved in mongoDb with mongoose

##### By clicking the save article button, the selected article will be saved

##### Under saved artcles section, all the saved articles from the scraped page are listed 

##### Each saved article has two buttons, one to delete it and the other one is a note taker button

##### Each article has a note and this can be edited and updated and the note will be saved in the db aswell

### Happy Web scraping and enjoy reading articles from NYT!