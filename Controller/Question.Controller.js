const Question = require("../Model/Question.Model");
const User = require("../Model/User.Model");


async function PostQuestion({ question, phone, answer = '' }) {
    try { 
        const data = await Question.create({ question, phone, answer })
        return {
            status: true, 
            data: data
        }
    } catch (error) {
        return { status: false, message: 'Internal Server Error', error: error.message };
    }
}

async function PostAnswer({ _id, answer }) {
    try {
        const result = await Question.findByIdAndUpdate(_id, {answer}, {new:true});
        
        if (!result) {
            return {
                status: false,
                data: "Question not found"
            };
        }

        return {
            status: true,
            data: result
        };
    } catch (error) {
        return { status: false, message: 'Internal Server Error', error: error.message };
    }
}


async function DeleteQuestion(id) {
    try { 
        let data = await Question.findByIdAndDelete(id)
        if (!data) {
            return {
                status: false,
                data: "Question not found"
            };
        }
        return {
            status: true,
            data: data
        };
    } catch (error) {
        return { status: false, message: 'Internal Server Error', error: error.message };
    }
}

async function GetQuestionById(id) {
    try {
        let question = await Question.findById(id)
        if (!question) {
            return {
                status: false,
                data: "Question not found"
            };
        }
        return {
            status: true,
            data: question
        };
     } catch (error) {
        return { status: false, message: 'Internal Server Error', error: error.message };
    }
}
async function AddLike({ question_id, phone }) {
    
    try {
        let question = await Question.findById(question_id);

        if (!question) {
            return { status: false, message: 'Question not found' };
        }

        // Check if the phone is already in the liked array
        const isLiked = question.liked.includes(phone);

        if (isLiked) {
            // If the phone is already liked, remove it
            question = await Question.findByIdAndUpdate(
                question_id,
                { $set: { liked: question.liked.filter(item => item !== phone) } },
                { new: true }
            );
            question.totalLike = question.liked.length
            return { status: true, message: 'Like removed successfully', question};
        } else {
            // If the phone is not liked, add it to the liked array
            question.liked.push(phone);  // Add the phone to the liked array
            question = await question.save();  // Save the document with the updated liked array

            return { status: true, message: 'Like added successfully', question};
        }
    } catch (error) {
        return { status: false, message: 'Internal Server Error', error: error.message };
    }
}



async function GetAllQuestion() {
    try { 
        let question = await Question.aggregate([{
            $lookup: {
                from: "users", 
                localField: "phone",
                foreignField: "phone", 
                as: "user"
            }
        }])
        return {
            status: true,
            data: question
        }
    } catch (error) {
        return { status: false, message: 'Internal Server Error', error: error.message };
    }

}


async function SearchQuestion({ q, sort }) {
    try {
        // Use a case-insensitive regular expression to match the search term in the 'question' field
        const regex = new RegExp(q, 'i');

        let pipeline = [        
        ]

        if (q) {
            pipeline.push({ $match: { question: regex } },
                {
                    $lookup: {
                        from: "users",
                        localField: "phone",
                        foreignField: "phone",
                        as: "user"
                    }
                })
        }
        if (sort=='like') {
            pipeline.push({
                $addFields: {
                    likeCount: { $size: "$liked" }
                }
            },
                { $sort: { likeCount: -1 } })
        } else if (sort == 'date') {
            pipeline.push({ $sort: { createdAt: -1 } })
        }

        // Perform the search using the Question model and the regex
        const searchResults = await Question.aggregate(pipeline);

        return {
            status: true,
            data: searchResults
        };
    } catch (error) {
        return { status: false, message: 'Internal Server Error', error: error.message };
    }
    
}

module.exports = {
    PostQuestion, PostAnswer,
    DeleteQuestion, GetQuestionById, AddLike,
    GetAllQuestion, SearchQuestion
}