const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const Dishes = require('../models/dishes')
const dishRouter = express.Router()
dishRouter.use(bodyParser.json())
//dishes
dishRouter.route('/')
.get((req,res,next) => {
    Dishes.find({})
    .then((dishes) => {
        res.statusCode = 200
        res.setHeader('Conetent-Type', 'application/json')
        res.json(dishes)
    },(err) => next(err))
    .catch(err => next(err))
})
.post((req,res,next) => {
    Dishes.create(req.body)
    .then((dish) => {
        console.log('Dish Created ',dish)
        res.statusCode = 200
        res.setHeader('Conetent-Type', 'application/json')
        res.json(dish)
    },(err) => next(err))
    .catch(err => next(err))
})
.put((req,res,next) => {
    res.statusCode = 403 //request not supported
    res.end('PUT operation not supported for url : /dishes')
})
.delete((req,res,next) => {
    Dishes.remove({})
    .then((resp) => {
        res.statusCode = 200
        res.setHeader('Conetent-Type', 'application/json')
        res.json(resp)
    },(err) => next(err))
    .catch(err => next(err))
})


dishRouter.route('/:dishId')
.get((req,res,next) => {
   Dishes.findById(req.params.dishId)
   .then(dish => {
       res.statusCode = 200
       res.setHeader('Content-Type','application/json')
       res.json(dish)
   }, (err) => next(err))
   .catch(err => next(err))
})
.post((req,res,next) => {
    res.statusCode = 403 //request not supported
    res.end('POST operation is not supported for the dish '+req.params.dishId)
})
.put((req,res,next) => {
    Dishes.findByIdAndUpdate(req.params.dishId,{
        $set: req.body
    },{
        new: true
    })
    .then((dish) => {
        res.statusCode = 200
        res.setHeader('Content-Type','application/json')
        res.json(dish)
    },(err) => next(err))
    .catch(err => next(err))
})
.delete((req,res,next) => {
    Dishes.findByIdAndRemove(req.params.dishId)
    .then((resp) =>{
        res.statusCode = 200
        res.setHeader('Content-Type','application/json')
        res.json(resp)
    },(err) => next(err))
    .catch(err => next(err))
})
module.exports = dishRouter
