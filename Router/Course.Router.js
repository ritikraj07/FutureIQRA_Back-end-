const { Router } = require('express');
const { VerifyAdmin, VerifyUser } = require('../Middleware/Auth.Middleware');
const { CreateCourse, AddVideo, GetAllCourse, GetCouserById, UpdateCourse, SearchCourse, DeleteCourse } = require('../Controller/Course.Controller');


const CourseRouter = Router()

/**************************************** POST ******************************************/

CourseRouter.post('/create',VerifyUser, VerifyAdmin, async (req, res) => {
    let { name, price, description, instructor, discount, intro } = req.body
    let result = await CreateCourse({ name, price, description, instructor, discount, intro })
    res.send(result)
})

CourseRouter.post('/add-video', VerifyUser, VerifyAdmin, async (req, res) => {
    let { course_id, url, title, description, notes } = req.body
    console.log(notes)
    let result = await AddVideo({ course_id, url, title, description, notes })
    res.send(result)
})

/****************************************  GET ******************************************/

CourseRouter.get('/all', async (req, res) => {
    let response = await GetAllCourse()
    res.send(response)
})

CourseRouter.get('/id/_id', async (req, res) => {
    let _id = req.params._id
    let response = await GetCouserById(_id)
    res.send(response)
})


CourseRouter.get('/search', async (req, res) => {
  
    let { coursetype, id, name} = req.query
    console.log({ coursetype, id, name })
    let response = await SearchCourse({id, coursetype, name})
    res.send(response)
    
})


/****************************************  PATCH ******************************************/

CourseRouter.patch('/update-course', VerifyUser, VerifyAdmin, async (req, res) => {
    let data = req.body
    let response = await UpdateCourse(data)
    res.send(response)
})

/****************************************  Delete ******************************************/
CourseRouter.delete('/id/:id', VerifyUser, VerifyAdmin, async (req, res) => {
    let id = req.params?.id
    let result = await DeleteCourse(id);
    res.send(result)
})
module.exports = CourseRouter;