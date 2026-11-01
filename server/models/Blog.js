
const mongoose = require("mongoose");

// Comment Schema
const commentSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        text: {
            type: String,
            required: [true, "Comment cannot be empty"],
            trim: true,
            maxlength: 1000
        }
    },
    {
        timestamps: true
    }
);

// Blog Schema
const blogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Blog title is required"],
            trim: true,
            minlength: 3,
            maxlength: 150
        },

        content: {
            type: String,
            required: [true, "Blog content is required"],
            trim: true
        },

        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        category: {
            type: String,
            default: "General",
            trim: true
        },

        comments: [commentSchema]
    },
    {
        timestamps: true
    }
);

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
