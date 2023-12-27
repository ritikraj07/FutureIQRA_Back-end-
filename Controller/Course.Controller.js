const Course = require("../Model/Course.Model");

async function CreateCourse({ name, price, description, instructor, discount, intro }) {

    try {
        const course = await Course.create({ name, price, description, instructor, discount, intro })
        return {
            status: true,
            message: 'Course Created Successfully',
            data: course
        }
    } catch (error) {
        return {
            status: false,
            message: 'Internal Server Error',
            data: error
        }
    }
}


async function AddVideo({ course_id, url, title, description, notes }) {
    try {
        let course = await Course.findById(course_id);

        if (course) {
            let videos = course.videos;
            videos.push({ url, title, description, notes });

            // Save the updated document
            await course.save();

            return {
                status: true,
                message: 'Video Added Successfully',
                data: course, // Return the updated course document
            };
        } else {
            return {
                status: false,
                message: 'Course not found',
                data: null,
            };
        }
    } catch (error) {
        return {
            status: false,
            message: 'Internal Server Error',
            data: error,
        };
    }
}

async function GetAllCourse() {
    try {
        let courses = await Course.find(); // Assuming `Course` is a model or service to fetch courses
        return {
            status: true,
            message: 'Courses fetched successfully',
            data: courses,
        };
    } catch (error) {
        return {
            status: false,
            message: 'Failed to fetch courses',
            error: error.message, // You can modify the error message as needed
        };
    }
}

async function GetCouserById(id) {
    try {
        let course = await Course.findById(id)
        return {
            status: true,
            message: 'Courses fetched successfully',
            data: course,
        };

     } catch (error) {
        return {
            status: false,
            message: 'Failed to fetch courses',
            error: error.message, // You can modify the error message as needed
        };
    }

}

async function UpdateCourse(data) {
    try { 
        let course = await Course.findByIdAndUpdate({ _id: data._id }, { $set: data }, { new: true })
        return {
            status: true,
            message: 'Courses updated successfully',
            data: course,
        };
    } catch (error) {
        return {
            status: false,
            message: 'Failed to fetch courses',
            error: error.message, // You can modify the error message as needed
        };
    }
}

async function SearchCourse({ coursetype, id }) {
    try {
        let course;
        if (id) {
            course = await Course.findById(id)
        } else if (coursetype) {
            const regex = new RegExp(coursetype, 'i');
            course = await Course.find({ coursetype: { $regex: regex } });
            // console.log(course);

        }
        return {
            status: true,
            message: 'Success',
            data: course,
        };
    } catch (error) {
        return {
            status: false,
            message: 'Failed to fetch courses',
            error: error.message,
        };
    }


}


async function DeleteCourse(id) {
    try {
        let result = await Course.findByIdAndDelete(id); // Provide the ID here

        if (result) {
            console.log(`Course with ID ${id} deleted successfully.`);
            // Perform any additional actions upon successful deletion
            return {
                status: true,
                message: 'Success',
                data: result,
            };
        } else {
            console.log(`Course with ID ${id} not found.`);
            return {
                status: false,
                message: 'Failed to fetch courses',
                error: error.message,
            };
        }
    } catch (error) {
        console.error('Error deleting course:', error);
        // Handle any errors that occur during deletion
        return {
            status: false,
            message: 'Failed to fetch courses',
            error: error.message,
        };
    }
}


module.exports = {
    CreateCourse,
    AddVideo, GetAllCourse,
    GetCouserById,
    UpdateCourse,
    SearchCourse,
    DeleteCourse
}