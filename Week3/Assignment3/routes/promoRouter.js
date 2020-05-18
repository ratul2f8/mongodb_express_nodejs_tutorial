const express = require('express')
const bodyParser = require('body-parser')
//const mongoose = require('mongoose')
const authenticate = require('../authenticate');
const Promotions = require('../models/promotions')
const promoRouter = express.Router()
promoRouter.use(bodyParser.json())
//promotions
promoRouter.route('/')
    .get((req, res, next) => {
        Promotions.find({})
            .then((promos) => {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(promos)
            }, (err) => next(err))
            .catch(err => next(err))
    })
    .post(authenticate.verifyUser, (req, res, next) => {
        if (authenticate.verifyAdmin(req)) {
            Promotions.create(req.body)
                .then((promo) => {
                    console.log('Promotion Created ', promo)
                    res.statusCode = 200
                    res.setHeader('Content-Type', 'application/json')
                    res.json(promo)
                }, (err) => next(err))
                .catch(err => next(err))
        } else {
            res.statusCode = 403;
            res.json({
                "message": "You are not authorized to perform this operation!"
            });
            res.send()
        }
    })
    .put(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403 //request not supported
        res.end('PUT operation not supported for url : /promotions')
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        if (authenticate.verifyAdmin(req)) {
            Promotions.remove({})
                .then((resp) => {
                    res.statusCode = 200
                    res.setHeader('Content-Type', 'application/json')
                    res.json(resp)
                }, (err) => next(err))
                .catch(err => next(err))
        } else {
            res.statusCode = 403;
            res.json({
                "message": "You are not authorized to perform this operation!"
            });
            res.send()
        }
    })

//promotions/:promoId
promoRouter.route('/:promoId')
    .get((req, res, next) => {
        Promotions.findById(req.params.promoId)
            .then(promo => {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(promo)
            }, (err) => next(err))
            .catch(err => next(err))
    })
    .post(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403 //request not supported
        res.end('POST operation is not supported for the promotion ' + req.params.promoId)
    })
    .put(authenticate.verifyUser, (req, res, next) => {
        if (authenticate.verifyAdmin(req)) {
            Promotions.findByIdAndUpdate(req.params.promoId, {
                    $set: req.body
                }, {
                    new: true
                })
                .then((promo) => {
                    res.statusCode = 200
                    res.setHeader('Content-Type', 'application/json')
                    res.json(promo)
                }, (err) => next(err))
                .catch(err => next(err))
        } else {
            res.statusCode = 403;
            res.json({
                "message": "You are not authorized to perform this operation!"
            });
            res.send()
        }
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        if (authenticate.verifyAdmin(req)) {
            Promotions.findByIdAndRemove(req.params.promoId)
                .then((resp) => {
                    res.statusCode = 200
                    res.setHeader('Content-Type', 'application/json')
                    res.json(resp)
                }, (err) => next(err))
                .catch(err => next(err))
        } else {
            res.statusCode = 403;
            res.json({
                "message": "You are not authorized to perform this operation!"
            });
            res.send()
        }
    })
module.exports = promoRouter