const express = require("express");
const bodyParser = require("body-parser");
//const mongoose = require('mongoose')
const Dishes = require("../models/dishes");
const dishRouter = express.Router();
//for using jwt verify user functionality
const authenticate = require("../authenticate");
dishRouter.use(bodyParser.json());
//dishes
dishRouter
  .route("/")
  .get((req, res, next) => {
    Dishes.find({})
      .populate("comments.author")
      .then(
        (dishes) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(dishes);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Dishes.create(req.body)
      .then(
        (dish) => {
          console.log("Dish Created ", dish);
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(dish);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403; //request not supported
    res.end("PUT operation not supported for url : /dishes");
  })
  .delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Dishes.remove({})
      .then(
        (resp) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(resp);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

//dishes/:dishId
dishRouter
  .route("/:dishId")
  .get((req, res, next) => {
    Dishes.findById(req.params.dishId)
      .populate("comments.author")
      .then(
        (dish) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(dish);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403; //request not supported
    res.end(
      "POST operation is not supported for the dish " + req.params.dishId
    );
  })
  .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Dishes.findByIdAndUpdate(
        req.params.dishId, {
          $set: req.body,
        }, {
          new: true,
        }
      )
      .then(
        (dish) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(dish);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Dishes.findByIdAndRemove(req.params.dishId)
      .then(
        (resp) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(resp);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

//dishes/:dishId/comments
dishRouter
  .route("/:dishId/comments")
  .get((req, res, next) => {
    Dishes.findById(req.params.dishId)
      .populate("comments.author")
      .then(
        (dish) => {
          if (dish != null) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(dish.comments);
          } else {
            err = new Error("Dish " + req.params.dishId + " not found");
            res.statusCode = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then(
        (dish) => {
          if (dish != null) {
            req.body.author = req.user._id;
            dish.comments.push(req.body);
            dish.save().then(
              (upDatedDish) => {
                Dishes.findById(upDatedDish._id)
                  .populate("comments.author")
                  .then((dish) => {
                    res.statusCode = 200;
                    res.setHeader("Contnt-Type", "application-json");
                    res.json(dish);
                  });
              },
              (err) => next(err)
            );
          } else {
            err = new Error("Dish " + req.params.dishId + " not found");
            res.statusCode = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403; //request not supported
    res.end(
      "PUT operation not supported for url : /dishes/",
      req.params.dishId,
      "/comments"
    );
  })
  .delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then(
        (dish) => {
          if (dish != null) {
            for (var i = 0; i < dish.comments.length; i++) {
              dish.comments.id(dish.comments[i]._id).remove();
            }
            dish.save().then(
              (upDatedDish) => {
                res.statusCode = 200;
                res.setHeader("Contnt-Type", "application-json");
                res.json(upDatedDish);
              },
              (err) => next(err)
            );
          } else {
            err = new Error("Dish " + req.params.dishId + " not found");
            res.statusCode = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

//dishes/:dishId/comments/:commentId
dishRouter
  .route("/:dishId/comments/:commentId")
  .get((req, res, next) => {
    Dishes.findById(req.params.dishId)
      .populate("comments.author")
      .then(
        (dish) => {
          if (dish != null && dish.comments.id(req.params.commentId) != null) {
            res.statusCode = 200;
            res.setHeader("Conetent-Type", "application/json");
            res.json(dish.comments.id(req.params.commentId));
          } else if (dish == null) {
            err = new Error("Dish " + req.params.dishId + " not found");
            res.statusCode = 404;
            return next(err);
          } else {
            err = new Error("Comment " + req.params.commentId + " not found");
            res.statusCode = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403; //request not supported
    res.end(
      "POST operation is not supported for the url: dishes/" +
      req.params.dishId +
      "/comments/" +
      req.params.commentId
    );
  })
  .put(authenticate.verifyUser, (req, res, next) => {
    var id1 = req.user._id;
    Dishes.findById(req.params.dishId)
      .then(
        (dish) => {
          if (dish != null && dish.comments.id(req.params.commentId) != null) {
            var id2 = dish.comments.id(req.params.commentId).author._id;
            if (id1.equals(id2)) {
              if (req.body.rating) {
                dish.comments.id(req.params.commentId).rating = req.body.rating;
              }
              if (req.body.comment) {
                dish.comments.id(req.params.commentId).comment = req.body.comment;
              }
              dish.save().then(
                (upDatedDish) => {
                  Dishes.findById(upDatedDish._id)
                    .populate("comments.author")
                    .then((dish) => {
                      res.statusCode = 200;
                      res.setHeader("Content-Type", "application/json");
                      res.json(dish);
                    });
                },
                (err) => next(err)
              );
            } else {
              res.statusCode = 403;
              res.json({
                "message": "You are not authorized to perform the opeartion!"
              });
              res.send();
            }
          } else if (dish == null) {
            err = new Error("Dish " + req.params.dishId + " not found");
            res.statusCode = 404;
            return next(err);
          } else {
            err = new Error("Comment " + req.params.commentId + " not found");
            res.statusCode = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .delete(authenticate.verifyUser, (req, res, next) => {
    var id1 = req.user._id;
    Dishes.findById(req.params.dishId)
      .then(
        (dish) => {
          if (dish != null && dish.comments.id(req.params.commentId) != null) {
            var id2 = dish.comments.id(req.params.commentId).author._id;
            if (id1.equals(id2)) {
              dish.comments.id(req.params.commentId).remove();
              dish.save().then(
                (upDatedDish) => {
                  Dishes.findById(upDatedDish._id)
                    .populate("comments.author")
                    .then((dish) => {
                      res.statusCode = 200;
                      res.setHeader("Content-Type", "application/json");
                      res.json(dish);
                    });
                },
                (err) => next(err)
              );
            } else {
              res.statusCode = 403;
              res.json({
                "message": "You are not authorized to perform the operation!"
              });
              res.send();
            }
          } else if (dish == null) {
            err = new Error("Dish " + req.params.dishId + " not found");
            res.statusCode = 404;
            return next(err);
          } else {
            err = new Error("Comment " + req.params.commentId + " not found");
            res.statusCode = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });
module.exports = dishRouter;