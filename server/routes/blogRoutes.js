
const express = require("express");
const Blog = require("../models/Blog");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// 1. CREATE A NEW BLOG
router.post("/", protect, async (req, res) => {
    try {
        const { title, content, category } = req.body || {};

        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: "Please provide title and content"
            });
        }

        const blog = await Blog.create({
            title,
            content,
            category: category || "General",
            author: req.user._id
        });

        const populatedBlog = await Blog.findById(blog._id)
            .populate("author", "name");

        res.status(201).json({
            success: true,
            message: "Blog created successfully",
            blog: populatedBlog
        });

    } catch (error) {
        console.error("Create Blog Error:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to create blog"
        });
    }
});

// 2. GET ALL BLOGS
router.get("/", async (req, res) => {
    try {
        const blogs = await Blog.find()
            .populate("author", "name")
            .populate("comments.user", "name")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: blogs.length,
            blogs
        });

    } catch (error) {
        console.error("Fetch Blogs Error:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to fetch blogs"
        });
    }
});

// 3. GET A SINGLE BLOG
router.get("/:id", async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id)
            .populate("author", "name")
            .populate("comments.user", "name");

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }

        res.status(200).json({
            success: true,
            blog
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Invalid blog ID"
        });
    }
});

// 4. UPDATE A BLOG
router.put("/:id", protect, async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }

        if (blog.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You can only edit your own blogs"
            });
        }

        const { title, content, category } = req.body || {};

        if (title !== undefined) blog.title = title;
        if (content !== undefined) blog.content = content;
        if (category !== undefined) blog.category = category;

        await blog.save();

        const updatedBlog = await Blog.findById(blog._id)
            .populate("author", "name")
            .populate("comments.user", "name");

        res.status(200).json({
            success: true,
            message: "Blog updated successfully",
            blog: updatedBlog
        });

    } catch (error) {
        console.error("Update Blog Error:", error.message);
        res.status(400).json({
            success: false,
            message: "Failed to update blog"
        });
    }
});

// 5. DELETE A BLOG
router.delete("/:id", protect, async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }

        if (blog.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You can only delete your own blogs"
            });
        }

        await blog.deleteOne();

        res.status(200).json({
            success: true,
            message: "Blog deleted successfully"
        });

    } catch (error) {
        console.error("Delete Blog Error:", error.message);
        res.status(400).json({
            success: false,
            message: "Failed to delete blog"
        });
    }
});

// 6. ADD A COMMENT
router.post("/:id/comments", protect, async (req, res) => {
    try {
        const { text } = req.body || {};

        if (!text || !text.trim()) {
            return res.status(400).json({
                success: false,
                message: "Please enter a comment"
            });
        }

        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }

        blog.comments.push({
            user: req.user._id,
            text: text.trim()
        });

        await blog.save();

        const updatedBlog = await Blog.findById(blog._id)
            .populate("author", "name")
            .populate("comments.user", "name");

        res.status(201).json({
            success: true,
            message: "Comment added successfully",
            comments: updatedBlog.comments
        });

    } catch (error) {
        console.error("Add Comment Error:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to add comment"
        });
    }
});

// 7. GET COMMENTS FOR A BLOG
router.get("/:id/comments", async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id)
            .populate("comments.user", "name");

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }

        res.status(200).json({
            success: true,
            count: blog.comments.length,
            comments: blog.comments
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Invalid blog ID"
        });
    }
});

module.exports = router;

