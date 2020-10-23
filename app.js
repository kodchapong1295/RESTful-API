const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const e = require('express');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true, useUnifiedTopology: true });

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema); //Article in double quote should be singular form and it will be our collection name.

///////////////////////////////// Requests Targetting all Articles /////////////////////////////

app.route("/articles")

.get((req, res) => {
    Article.find({}, (err, foundArticles) => {
        if (!err) {
            res.send(foundArticles);
        } else {
            res.send(err);
        }

    })
})

.post((req, res) => {

    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });

    newArticle.save((err) => {
        if (!err) {
            req.send("Successfully added a new article.");
        } else {
            req.send(err);
        }
    });
})

.delete((req, res) => {
    Article.deleteMany({}, (err) => {
        if (!err) {
            res.send("Successfully deleted all articles")
        } else {
            res.send(err);
        }
    })
});

///////////////////////////////// Requests Targetting a specific Articles /////////////////////////////

app.route("/articles/:articleTitle")
.get((req,res)=>{
    Article.findOne({title: req.params.articleTitle}, (err,foundArticle)=>{
        if (foundArticle) {
            res.send(foundArticle)
        }else{
            res.send("No articles matching that article was found");
        }
    })
})

.put((req,res)=>{
    Article.update(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        {overwrite: true},
        (err)=>{
            if(!err){
                res.send("Successfully updated  article.")
            }else{
                res.send(err)
            }
        })
})

.patch((req,res)=>{
    Article.update(
        {title: req.params.articleTitle},
        {$set: req.body},
        (err)=>{
            if(!err){
                res.send("Successfully updated  article.")
            }else{
                res.send(err)
            }
        })
})

.delete((req,res)=>{
    Article.deleteOne({title: req.params.articleTitle}, (err)=>{
        if (!err) {
            res.send("Successfully deleted the corresponding articles")
        } else {
            res.send(err);
        }
    })
});


app.listen(3000, function () {
    console.log("Server started on port 3000");
});

