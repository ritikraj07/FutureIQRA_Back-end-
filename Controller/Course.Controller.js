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

async function SearchCourse({ coursetype, id, name }) {
    try {
        let course;
        if (id) {
            // console.log(id)
            course = await Course.findById(id)
        } else if (coursetype) {
            // console.log(coursetype);
            const regex = new RegExp(coursetype, 'i');
            course = await Course.find({ coursetype: { $regex: regex } });

        } else if (name) {
            // console.log(name)
            const regex = new RegExp(name, 'i');
            course = await Course.find({ name: { $regex: regex } });
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


async function DeleteVideoFromCourse(courseId, videoId) {
    try {
        // Find the course by ID
        const course = await Course.findById(courseId);

        if (!course) {
            return {
                status: false,
                message: 'Course not found',
            };
        }

        // Find the index of the video in the 'videos' array
        const videoIndex = course.videos.findIndex(video => video._id.toString() === videoId);

        if (videoIndex === -1) {
            return {
                status: false,
                message: 'Video not found in the course',
            };
        }

        // Remove the video from the 'videos' array
        course.videos.splice(videoIndex, 1);

        // Save the updated course
        await course.save();

        return {
            status: true,
            message: 'Video deleted from the course',
        };
    } catch (error) {
        return {
            status: false,
            error: error.message,
            message: 'An error occurred while deleting the video from the course',
        };
    }
}




async function EditVideoInCourse(courseId, videoId, updatedVideoData) {
    try {
        // Find the course by ID
        const course = await Course.findById(courseId);

        if (!course) {
            return {
                status: false,
                message: 'Course not found',
            };
        }

        // Find the index of the video in the 'videos' array
        const videoIndex = course.videos.findIndex(video => video._id.toString() === videoId);

        if (videoIndex === -1) {
            return {
                status: false,
                message: 'Video not found in the course',
            };
        }

        // Update the video with the new data
        course.videos[videoIndex] = { ...course.videos[videoIndex], ...updatedVideoData };

        // Save the updated course
        await course.save();

        return {
            status: true,
            message: 'Video updated in the course',
        };
    } catch (error) {
        return {
            status: false,
            error: error.message,
            message: 'An error occurred while updating the video in the course',
        };
    }
}



module.exports = {
    CreateCourse,
    AddVideo, GetAllCourse,
    GetCouserById,
    UpdateCourse,
    SearchCourse,
    DeleteCourse,
    DeleteVideoFromCourse,
    EditVideoInCourse
}