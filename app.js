const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/wikiDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const articleSchema = {
    title: String,
    content: String
}

const Article = mongoose.model("Article", articleSchema)

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

app.route("/articles")
    .get(function (req, res) {
        Article.find(function (err, result) {
            if (!err) {
                res.send(result);
            } else {
                res.send(err)
            }
        })
    })
    .post(function (req, res) {

        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        })
        newArticle.save(function (err) {
            if (!err) {
                res.send("Successfully added a new item");
            }
        })
    })
    .delete(function (req, res) {
        Article.deleteMany(function (err) {
            if (!err) {
                res.send("Successfully deleted all the items");
            } else {
                res.send(err);
            }
        })
    });

app.route("/articles/:articleTopic")
    .get(function (req, res) {
        Article.findOne({
            title: req.params.articleTopic
        }, function (err, result) {
            if (!err) {
                res.send(result)
            } else {
                res.send("requested data is not found");
            }
        })
    })
    .put(function (req, res) {
        Article.update({
            title: req.params.articleTopic
        }, {
            title: req.body.title,
            content: req.body.content
        }, {
            overwrite: true
        }, function (err) {
            if (!err) {
                res.send("successfully updated")
            } else {
                res.send(err)
            }
        })
    })
    .patch(function (req, res) {
        Article.update({
            title: req.params.articleTopic
        }, {
            $set: req.body
        }, function (err) {
            if (!err) {
                res.send("Successfully updated the selected item");
            } else {
                res.send(err);
            }
        })
    })
    .delete(function (req, res) {
        Article.deleteOne({
            title: req.params.articleTopic
        }, function (err) {
            if (!err) {
                res.send("successfully deleted the selected item")
            } else {
                res.send(err)
            }
        })
    });

app.listen(3000, function () {
    console.log("Server started on port 3000");
});