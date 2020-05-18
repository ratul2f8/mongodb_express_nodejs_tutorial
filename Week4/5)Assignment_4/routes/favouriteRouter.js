const express = require('express');
const bodyParser = require('body-parser');
const Dishes = require('../models/dishes');
const Users = require('../models/user');
const Favourites = require('../models/favourite');
const favouriteRouter = express.Router();
const cors = require('./cors');
const authenticate = require('../authenticate');
favouriteRouter.use(bodyParser.json());

function containsDishId(dishes, dishId) {
    return dishes.find(({
        _id
    }) => _id.equals(dishId));

}

//for /favourites
favouriteRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favourites.find({})
            .populate('user')
            .populate('dishes')
            .findOne({
                user: {
                    _id: req.user._id
                }
            })
            .then(records => {
                if (records !== null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(records);
                    res.send();
                } else {
                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({
                        "message": "You don't have any favourite category!"
                    });
                    res.send();
                }
            })
            .catch(err => next(err))
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favourites.find({})
            .populate('user')
            .findOne({
                user: {
                    _id: req.user._id
                }
            })
            .then((user) => {
                    if (user == null) {
                        Favourites.create({
                                user: {
                                    _id: req.user._id
                                },
                                dishes: []
                            })
                            .then(createdFavouriteList => {
                                var dishesToAdd = req.body;
                                for (i = 0; i < dishesToAdd.length; i++) {
                                    if (!containsDishId(createdFavouriteList.dishes, dishesToAdd[i]._id)) {
                                        createdFavouriteList.dishes.push({
                                            _id: dishesToAdd[i]._id
                                        })
                                    }
                                }
                                createdFavouriteList.save()
                                    .then(addedAllFavDishes => {
                                        res.statusCode = 200;
                                        res.setHeader('Content-Type', 'application/json');
                                        res.json(addedAllFavDishes);
                                        res.send();
                                    })
                                    .catch(err => next(err))

                            })
                            .catch(err => next(err));
                    } else {
                        if (!containsDishId(user.dishes, req.params.dishId)) {
                            user.dishes.push({
                                _id: req.params.dishId
                            });
                            user.save()
                                .then(favDishes => {


                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(favDishes);
                                    res.send();

                                }, err => next(err));
                        } else {
                            res.statusCode = 403;
                            res.setHeader('Content-Type', 'application/json');
                            res.json({
                                "message": "Dish already exists in your favourite list!"
                            });
                            res.send();
                        }
                    }
                },
                err => next(err)
            )
            .catch(err => next(err));

    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.setHeader('Content-Type', 'application/json');
        res.json({
            "message": "GET operation is not supported on this end-point!"
        });
        res.send();
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
        Favourites.remove({user: {_id: req.user._id}})
        .then(response => {
            res.statusCode = 200;
            res.setHeader("Content-Type","application/json");
            res.json(response);
            res.send()
        })
        .catch(err => next(err))
    })

//for /favourites/:dishId
favouriteRouter.route('/:dishId')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.setHeader('Content-Type', 'application/json');
        res.json({
            "message": "GET operation is not supported on this end-point!"
        });
        res.send();
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.setHeader('Content-Type', 'application/json');
        res.json({
            "message": "GET operation is not supported on this end-point!"
        });
        res.send();
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favourites.find({})
            .populate('user')
            .findOne({
                user: {
                    _id: req.user._id
                }
            })
            .then((user) => {
                    if (user == null) {
                        Favourites.create({
                                user: {
                                    _id: req.user._id
                                },
                                dishes: [{
                                    _id: req.params.dishId
                                }]
                            })
                            .then(createdFavouriteDishes => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(createdFavouriteDishes);
                                res.send();

                            })
                            .catch(err => next(err));
                    } else {
                        if (!containsDishId(user.dishes, req.params.dishId)) {
                            user.dishes.push({
                                _id: req.params.dishId
                            });
                            user.save()
                                .then(favDishes => {


                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(favDishes);
                                    res.send();

                                }, err => next(err));
                        } else {
                            res.statusCode = 403;
                            res.setHeader('Content-Type', 'application/json');
                            res.json({
                                "message": "Dish already exists in your favourite list!"
                            });
                            res.send();
                        }
                    }
                },
                err => next(err)
            )
            .catch(err => next(err));

    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favourites.findOne({})
        .populate('user')
        .findOne({user: {_id: req.user._id}})
        .then(user => {
            user.dishes.remove({_id: req.params.dishId});
            user.save()
            .then( modifiedUser => {
                res.statusCode = 200;
                res.setHeader("Conteny-Type","application/json");
                res.json(modifiedUser);
                res.send()
            })
            .catch(err => next(err))
        })
        .catch(err => next(err))
    })

module.exports = favouriteRouter;