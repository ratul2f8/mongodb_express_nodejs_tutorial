const mongoose = require('mongoose')
const Schema = mongoose.Schema

const commentSchema = new Schema(
    {
        rating:{
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        comment:{
            type: String,
            required: true
        },
        author:{
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
)
const dishSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    comments: [commentSchema]
},
{
    timestamps: true
})

var Dishes = mongoose.model('Dish', dishSchema)
module.exports = Dishes