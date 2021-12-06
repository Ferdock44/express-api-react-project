let express = require('express')
let cors = require('cors')
let app = express()
const Sequelize = require('sequelize');

// instantiate the library for use, connecting to the sqlite database file
let sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'posts.sqlite'
})

// If port is set in environment variable use that port
// if not, use port 5000
const PORT = process.env.PORT || 5000

// Enable CORS middleware
app.use(cors());
// Enable receiving data in JSON format
app.use(express.json());
// Enable receiving data from HTML forms
app.use(express.urlencoded({ extended: false }));

// Start: Change only below this line

const Post = sequelize.import("./models/posts.js");

// View all posts
// Happy Path: returns all posts in an array in JSON format (Status 200)
// Sad Path: None
app.get("/posts", function(req, res){
    Post.findAll().then(function(posts){
        res.status(200);
        res.json(posts);
    });
});

// Create a post
// Happy Path: creates the post item (Status 201 - returns copy of created post)
// Sad Path: none
app.post("/posts", function(req, res){
    let new_post = Post.build({
        title: req.body.title,
        url: req.body.url,
    });
    new_post.save();
    res.status(201);
    res.json();
});

// Upvote a post
// Happy Path: upvote a post (Status 204 - empty JSON)
// Sad Path: post does not exist (Status 404 - empty JSON)
app.patch("/posts/:id/upvote", function(req, res){
    Post.findByPk(req.params.id).then(function(post){
        if(post != null){
            post.points += 1;
            post.save();
            res.status(204);
        }else res.status(404);
        res.json();
    });
});

// Downvote a post
// Happy Path: downvote a post (Status 204 - empty JSON)
// Sad Path: post does not exist (Status 404 - empty JSON)
app.patch("/posts/:id/downvote", function(req, res){
    Post.findByPk(req.params.id).then(function(post){
        if(post != null){
            if(post.points > 0) post.points -= 1;
            post.save();
            res.status(204);
        }else res.status(404);
        res.json();
    });
});

// STOP: Don't change anything below this line

app.listen(PORT, function () {
    console.log("Server started...")
});