//jshint esversion:6
//require('dotenv').config();
//import "./public/css/styles.css";
const express = require("express");

const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const $ = require("jquery");
const mongoose = require("mongoose");
//Image upload, manipulation, and storage dependencies
const multer = require("multer");
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");

// Configuring cloudinary to transfrom
// height, and width, and make sure only JPG
// and PNG are uploaded.
// require(".env").config();
cloudinary.config({
  cloud_name: "jacobsiler-com", //process.env.CLOUD_NAME,
  api_key: "657732323917648", //process.env.API_KEY,
  api_secret: "9ZqyGz1DBHy7twuxgfvXIyvvUzI" //process.env.API_SECRET
});
const storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: "SilerGuitars",
  allowedFormats: ["jpg", "png"],
  transformation: [{ width: 500, height: 500, crop: "limit" }]
});
const parser = multer({ storage: storage });

const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();
const router = express.Router();

app.set("view engine", "ejs");

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("./public"));

mongoose.connect("mongodb://localhost:27017/blogDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

//Defining the Image Schema
const imageSchema = {
  url: String,
  id: String
};

const Image = new mongoose.model("Image", imageSchema);

//Defining the Post Schema
const postSchema = {
  title: String,
  content: String,
  imageUrls: [String]
};

const Post = new mongoose.model("Post", postSchema);

//Routes
//GET Routes
app.get("/", function(req, res) {
  Post.find({}, function(err, posts) {
    let foundImages = posts[0].imageUrls;
    // console.log(posts[0].imageUrls);
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts,
      images: foundImages
    });
  });
});

app.get("/about", function(req, res) {
  res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", function(req, res) {
  res.render("contact", { contactContent: contactContent });
});

//Edit GET Routes
app.get("/edit", function(req, res) {
  var requestedPostId;
  const imagesSelected = [];

  Post.find({}, function(err, posts) {
    Image.find({}, function(err, images) {
      res.render("edit", {
        postID: requestedPostId,
        posts: posts,
        images: images
      });
    });
  });
});

app.get("/edit/:postId", function(req, res) {
  const requestedPostId = req.params.postId;
  Post.find({ _id: requestedPostId }, function(err, posts) {
    //TODO find the post requested and save it's images to a variable to pass to the ejs.]
    //console.log(requestedPostId);
    let postimages;
    posts.forEach(post => {
      //console.log(post.imageUrls);
      postImages = post.imageUrls;
    });
    Image.find({}, function(err, images) {
      res.render("edit", {
        postID: requestedPostId,
        posts: posts,
        postImages: postImages,
        images: images
      });
    });
  });
});

app.get("/edit-post/:postId", function(req, res) {
  const requestedPostId = req.params.postId;
  Post.find({ _id: requestedPostId }, function(err, foundPosts) {
    //TODO find the post requested and save it's images to a variable to pass to the ejs.]
    //console.log(foundPosts);
    let title;
    let content;
    let images;
    foundPosts.forEach(post => {
      //console.log(post.imageUrls);
      title = post.title;
      content = post.content;
      images = post.imageUrls;
    });
    res.render("edit-post", {
      postID: requestedPostId,
      title: title,
      content: content,
      images: images
    });
  });
});

app.get("/posts/:postId", function(req, res) {
  const requestedPostId = req.params.postId;
  Post.find({ _id: requestedPostId }, function(err, foundPosts) {
    //TODO find the post requested and save it's images to a variable to pass to the ejs.]
    //console.log(foundPosts);
    let title;
    let content;
    let images;
    foundPosts.forEach(post => {
      //console.log(post.imageUrls);
      title = post.title;
      content = post.content;
      images = post.imageUrls;
    });
    res.render("post", {
      postID: requestedPostId,
      title: title,
      content: content,
      images: images
    });
  });
});

app.get("/compose", function(req, res) {
  res.render("compose");
});

//One single requested post.
/*app.get("/edit/:postId", function(req, res) {
  const requestedPostId = req.params.postId;

  Post.find({}, function(err, posts) {
    const currentPost = Post.find({ _id: requestedPostId });
    const currentImages = Post.find({ _id: requestedPostId, imageUrls: $all });
    console.log(currentPost.schema.obj.imageUrls.Function);
    //TODO Add a mongoose query to get the post's currently attached images
    Image.find({}, function(err, images) {
      res.render("edit", {
        postID: requestedPostId,
        posts: posts,
        images: images,
        currentImages: [
          "http://res.cloudinary.com/jacobsiler-com/image/upload/v1574344201/SilerGuitars/lfxwkq8xhhkyxn85oyna.jpg",
          "http://res.cloudinary.com/jacobsiler-com/image/upload/v1574344215/SilerGuitars/f8q5d4kedss1tpmhxmwg.jpg",
          "http://res.cloudinary.com/jacobsiler-com/image/upload/v1574344227/SilerGuitars/fveajqk0ehwy5mxywysa.jpg",
          "http://res.cloudinary.com/jacobsiler-com/image/upload/v1574413641/SilerGuitars/fudxzu5dcg1gnzmk1kut.jpg"
        ]
      });
    });
  });
});*/

// General Edit/upload image screen.
app.get("/uploads", function(req, res) {
  var requestedPostId;
  const imagesSelected = [];

  Post.find({}, function(err, posts) {
    Image.find({}, function(err, images) {
      res.render("uploads", {
        postID: requestedPostId,
        posts: posts,
        images: images
      });
    });
  });
});

//POST Routes
//When someone picks images.
app.post("/post-images", (req, res) => {
  var postImages = req.body;
  const postID = postImages.shift();
  console.log(postImages);
  Post.updateOne(
    { _id: postID },
    { $push: { imageUrls: postImages } },
    function(err, foundPost) {
      if (!err) {
        console.log(foundPost);
        res.redirect("/");
      } else {
        console.log("error: " + err);
      }
    }
  );
});

//When someone removes an images.
app.post("/remove-image", (req, res) => {
  let postImage = req.body;
  const postID = postImage.shift();
  postImage = postImage.toString();
  // console.log(postImage.toString());
  // console.log(postID);
  Post.updateOne({ _id: postID }, { $pull: { imageUrls: postImage } }, function(
    err,
    foundPost
  ) {
    if (!err) {
      console.log(foundPost);
      res.redirect("/");
    } else {
      console.log("error: " + err);
      res.redirect("/");
    }
  });
});

// When user uploads an image.
app.post("/api/images", parser.single("image"), function(req, res) {
  const postId = req.body.button;
  const img = {};

  img.url = req.file.url;
  img.id = req.file.public_id;
  Image.create(img) // save image information in database
    .then(newImage => res.redirect("/"))
    .catch(err => console.log(err));
});

app.post("/compose", function(req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody,
    images: req.body.postImages
  });

  post.save(function(err) {
    if (!err) {
      res.redirect("/");
    }
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
