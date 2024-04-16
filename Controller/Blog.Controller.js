const Blog = require("../Model/Blog.Model")

const CreateBlog = async ({ title, body, category, tags, author, image, short_description }) => {
    try {
        const blog = await Blog.create({ title, body, category, tags, author, image, short_description });
        return {
            status: true,
            message: 'Blog created successfully',
            data: blog
        }
    } catch (error) {
        throw new Error('Error creating blog: ' + error.message);
   }
}

async function getAllBlogs(query) {
    try {
        let { search, category, sortBy, sortOrder, limit } = query;
        let filter = {};
        let sort = {};

        // Search blogs based on keyword
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { body: { $regex: search, $options: 'i' } }
            ];
        }

        // Filter blogs based on category
        if (category) {
            filter.category = category;
        }

        // Sort blogs based on specified field and order
        if (sortBy && sortOrder) {
            sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
        }

        // Limit the number of blogs returned
        limit = parseInt(limit) || 10;

        // Query the database
        // const blogs = await Blog.find(filter).populate('author', 'name')
        //     .sort(sort)
        //     .limit(limit);
        let options = {
             sort, limit,
            projection: { title: 1, body: 1, category: 1, tags: 1, author: 1, image: 1, short_description: 1 },
            populate: { path: 'author', select: 'name' }
        };
        const blogs = await Blog.paginate(filter, options);

        return blogs;
    } catch (error) {
        throw new Error('Error fetching blogs: ' + error.message);
    }
}

const GetBlogById = async (id) => {
    try {
        const blog = await Blog.findById(id).populate('author', 'name');
        return blog;
    } catch (error) {
        throw new Error('Error fetching blog: ' + error.message);
    }
}


async function deleteBlog(userId, blogId) {
    try {
        // Find the blog by its ID
        const blog = await Blog.findById(blogId);

        if (!blog) {
            throw new Error('Blog not found');
        }

        // Check if the userId matches the author of the blog
        if (blog.author.toString() !== userId) {
            throw new Error('Unauthorized: User is not the author of this blog');
        }

        // Delete the blog
        const deletedBlog = await Blog.findByIdAndDelete(blogId);

        if (!deletedBlog) {
            throw new Error('Blog not found');
        }

        return deletedBlog;
    } catch (error) {
        throw new Error('Error deleting blog: ' + error.message);
    }
}


async function updateBlog(userId, blogId, updatedBlogData) {
    try {
        // Find the blog by its ID
        const blog = await Blog.findById(blogId);

        if (!blog) {
            throw new Error('Blog not found');
        }

        // Check if the userId matches the author of the blog
        if (blog.author.toString() !== userId) {
            throw new Error('Unauthorized: User is not the author of this blog');
        }

        // Update the blog with the new data
        const updatedBlog = await Blog.findByIdAndUpdate(blogId, updatedBlogData, { new: true });

        if (!updatedBlog) {
            throw new Error('Blog not found');
        }

        return updatedBlog;
    } catch (error) {
        throw new Error('Error updating blog: ' + error.message);
    }
}





module.exports = { CreateBlog, getAllBlogs, GetBlogById, deleteBlog, updateBlog }