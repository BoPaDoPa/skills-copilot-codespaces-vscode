// Create web server
// ------------------------------

// import express
const express = require("express");
const router = express.Router();

// import comment model
const Comment = require("../models/comment");

// import post model
const Post = require("../models/post");

// import user model
const User = require("../models/user");

// import middleware
const middleware = require("../middleware");

// import express-sanitizer
const expressSanitizer = require("express-sanitizer");

// use express-sanitizer
router.use(expressSanitizer());

// ------------------------------
//  ROUTES
// ------------------------------

// CREATE - comment on post
router.post("/posts/:id/comments", middleware.isLoggedIn, (req, res) => {
  // get data from form
  const text = req.body.text;
  const author = {
    id: req.user._id,
    username: req.user.username,
  };

  // create new comment
  const newComment = { text: text, author: author };

  // sanitize comment text
  req.body.comment.text = req.sanitize(req.body.comment.text);

  // find post by id
  Post.findById(req.params.id, (err, post) => {
    if (err) {
      console.log(err);
      res.redirect("/posts");
    } else {
      // create new comment
      Comment.create(newComment, (err, comment) => {
        if (err) {
          console.log(err);
        } else {
          // add username and id to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;

          // save comment
          comment.save();

          // connect new comment to post
          post.comments.push(comment);

          // save post
          post.save();

          // redirect to show page
          res.redirect("/posts/" + post._id);
        }
      });
    }
  });
});

// EDIT - edit comment
router.get(
  "/posts/:id/comments/:comment_id/edit",
  middleware.checkCommentOwnership,
  (req, res) => {
    // find comment by id
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if (err) {
        console.log(err);
        res.redirect("back");
      } else {
        // render edit page
        res.render("comments/edit", {
          post_id: req.params.id,
          comment: foundComment,
        });
      }
    });
  }
);

// UPDATE - update comment
router
