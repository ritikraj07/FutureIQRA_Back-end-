const { Schema, model } = require('mongoose');
const mongoosePaginate = require("mongoose-paginate-v2");
// Instructor Schema
const InstructorSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        required: true
    }
});

// Video Schema
const VideoSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    notes: {
        type: String,
    }
}, {
    timestamps: true
}

);

// Course Schema
const CourseSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    instructor: {
        type: InstructorSchema,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    // banner: {
    //     type: String,
    //     // required: true
    // },
    videos: [VideoSchema],
    discount: {
        type: Number,
        max: 100,
        min: 0,
        default: 0
    },
    intro: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        default: 0
    }, 
    coursetype: {
        type: String,
        enum: ['VIP1', 'VIP2'],
        default: 'VIP1',
        required:true
    }
}, {
    timestamps: true
});

CourseSchema.plugin(mongoosePaginate);

const Course = model('Course', CourseSchema);

module.exports = Course;
