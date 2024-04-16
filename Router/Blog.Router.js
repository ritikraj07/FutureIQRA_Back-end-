const { Router } = require('express');
const { VerifyUser } = require('../Middleware/Auth.Middleware');
const { CreateBlog, deleteBlog, GetBlogById, updateBlog, getAllBlogs } = require('../Controller/Blog.Controller');

const BlogRouter = Router();

/****************************************** POST ****************************************** */

BlogRouter.post('/create', VerifyUser, async (req, res) => {
    console.log(req.body)
    let { title, body, category, tags, short_description } = req.body;
    let author = req.user._id;

    let response = await CreateBlog({ title, body, category, tags, author, short_description });
    res.send(response);

    
});


/****************************************** GET, PATCH, DELETE ****************************************** */

BlogRouter.route('/:id')
    .get(async (req, res) => {
        let response = await GetBlogById(req.params.id);
        res.send({
            status: true,
            message: "Blog fetched statusfully",
            data: response
        })
    })
    .patch(VerifyUser, async (req, res) => {
        try {
            let userId = req.user._id
            let { title, body, category, tags } = req.body;
            let response = await updateBlog(userId, blogId, { title, body, category, tags });
            res.send({
                status: true,
                message: "Blog updated statusfully",
                data: response
            })
        } catch (error) {
            res.send({
                status: false,
                message: "Error while updating blog",
                data: error
            })
        }
    })
    .delete(VerifyUser, async (req, res) => {
        let userId = req.user._id
        let blogId = req.params.id
        let response = await deleteBlog(userId, blogId);
        res.send({
            status: true,
            message: "Blog deleted statusfully",
            data: response
        })
    });



BlogRouter.get('/', async (req, res) => {
    try {

        let response = await getAllBlogs(req.query);
        res.send({
            status: true,
            message: "Blogs fetched statusfully",
            data: response
        });
    } catch (error) {
        res.status(500).send({
            status: false,
            message: "Failed to fetch blogs",
            error: error.message
        });
    }
});


module.exports = BlogRouter;
