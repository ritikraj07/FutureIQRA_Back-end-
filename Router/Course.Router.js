const { Router } = require('express');
const { VerifyAdmin, VerifyUser } = require('../Middleware/Auth.Middleware');
const { CreateCourse, AddVideo, GetAllCourse, GetCouserById, UpdateCourse, SearchCourse, DeleteCourse, DeleteVideoFromCourse, EditVideoInCourse } = require('../Controller/Course.Controller');


const CourseRouter = Router()

/**************************************** POST ******************************************/

CourseRouter.post('/create', VerifyUser, VerifyAdmin, async (req, res) => {
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



CourseRouter.post('/buy-course', async (req, res) => {
    
    let { amount, receipt, } = req.body;




    const YOUR_KEY_ID = 'rzp_test_6kEDsoP3MV9ItP';
    const YOUR_KEY_SECRET = 'GuKnqoKZxSfrYTyrGtFH4SuT';

    const createOrder = async () => {
        try {
            const payload = {
                amount: 1000,
                currency: 'INR',
                receipt: 'qwsaq1',
                partial_payment: false,
                payment_capture: true,
                notes: {
                    merchant_details: 'Additional details for the merchant',
                    customer_details: 'Additional details for the customer',
                },
            };

            const response = await fetch('https://api.razorpay.com/v1/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Basic ${btoa(`${YOUR_KEY_ID}:${YOUR_KEY_SECRET}`)}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('Order created:', data);
            return data;
        } catch (error) {
            console.error('Error creating order:', error);
            throw error;
        }
    };





    createOrder()
        .then((result) => {
           res.send(result)
        })
        .catch((error) => {
            console.error('Error generating order:', error);
            res.send("error", error)
        });
    

});






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

    let { coursetype, id, name } = req.query
    console.log({ coursetype, id, name })
    let response = await SearchCourse({ id, coursetype, name })
    res.send(response)

})


/****************************************  PATCH ******************************************/

CourseRouter.patch('/update-course', VerifyUser, VerifyAdmin, async (req, res) => {
    let data = req.body
    let response = await UpdateCourse(data)
    res.send(response)
})
CourseRouter.patch('/delete-video', VerifyUser, VerifyAdmin, async (req, res) => {
    let { courseId, videoId } = req.body
    let response = await DeleteVideoFromCourse(courseId, videoId)
    res.send(response)
})

CourseRouter.patch('/edit-video', VerifyUser, VerifyAdmin, async (req, res) => {
    let { courseId, videoId, updatedData } = req.body;
    let response = await EditVideoInCourse(courseId, videoId, updatedData)
    res.send(response)
})


/****************************************  Delete ******************************************/
CourseRouter.delete('/id/:id', VerifyUser, VerifyAdmin, async (req, res) => {
    let id = req.params?.id
    let result = await DeleteCourse(id);
    res.send(result)
})
module.exports = CourseRouter;