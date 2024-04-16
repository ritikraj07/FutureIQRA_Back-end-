const { Schema, model } = require('mongoose');
const mongoosePaginate = require("mongoose-paginate-v2");

const BlogCategory = {
    TECHNOLOGY: 'Technology',
    TRAVEL: 'Travel',
    FASHION: 'Fashion',
    FOOD: 'Food',
    HEALTH_FITNESS: 'Health & Fitness',
    LIFESTYLE: 'Lifestyle',
    FINANCE: 'Finance',
    EDUCATION: 'Education',
    DIY_CRAFTS: 'DIY & Crafts',
    ENTERTAINMENT: 'Entertainment'
};


const BlogSchema = new Schema({
    title: {
        type: String,
        require: true
    },
    body: {
        type: String,
        require: true
    },
    short_description: {
        type: String,
        require: true
    },
    image: {
        type: String,
    },
    category: {
        type: String,
        require: true,
        enum: Object.values(BlogCategory)
    },
    tags: {
        type: [String],
        require: true
    },
    likes: {
        type: [String],
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },

}, {
    timestamps: true
})

BlogSchema.plugin(mongoosePaginate);    

const Blog = model('Blog', BlogSchema)
module.exports = Blog;