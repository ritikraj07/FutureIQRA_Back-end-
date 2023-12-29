const config = require("../Config");
const Question = require("../Model/Question.Model");
const Report = require("../Model/Report.Model");
const User = require("../Model/User.Model");
let bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


function GenerateToken(user) {
    let payload = {
        _id: user._id,
        data: user
    }

    return jwt.sign(payload, config.JWT_SECRET)
}

function VerifyToken(token) {
    const payload = jwt.verify(token, config.JWT_SECRET)
    return payload
}

async function FindUser(phone) {
    let user = await User.findOne({ phone })
    if (user) {
        return true
    }
    return false
}

async function GetTeam(referCode) {
    // console.log('referby==>', referby)
    return await User.aggregate([{ $match: { referby: referCode } }, { $project: { phone: 1, name: 1, userType: 1, _id: 0, image: 1 } }])
}

async function Login(phone, password) {
    let user = await User.findOne({ phone })
    if (user) {
        if (user.password == password) {
            let referCode = user.referCode
            let team = await GetTeam(referCode)
            user = user.toJSON();
            
            delete user.password;
            return {
                status: true,
                data: { ...user, team },
                token: GenerateToken({ ...user, team }),
            }
        } else {
            return {
                status: false,
                data: "Wrong Password"
            }
        }

    } else {
        return {
            status: false,
            data: "No User Found"
        }
    }

}

// Function to generate a random 6-letter code
function generateRandomCode() {
    const characters = '1234567890';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
}

async function CreateUser({ name, phone, referby, password }) {

    let isUnique = false;
    let referCode = ''
    while (!isUnique) {
        referCode = generateRandomCode()
        let isUserExistWithThisCode = await User.find({ referCode })
        console.log(isUserExistWithThisCode)
        if (isUserExistWithThisCode) {
            isUnique = true;
            break;
        }
    }

    let user = await User.create({ name, phone, referby, password, referCode })
    user = user.toJSON();
    delete user.password;
    let team = []
    return {
        status: true,
        data: { ...user, team },
        token: GenerateToken({ ...user, team})
    }
}


async function GetUser(phone) {
    try {
        let user = await User.find({ phone })
        return {
            status: true,
            data: user,
        }
    } catch (error) {
        return {
            stauts: false,
            date: "No Data found"
        }
    }

}


async function GetLeadersBoard() {
    try {
        const users = await User.find({}).sort({ wallet: -1, createdAt: -1 });

        return {
            status: true,
            data: users
        };
    } catch (error) {
        console.error('Error sorting users:', error);
        return {
            stauts: false,
            date: "No Data found",
            error
        }
    }
}

async function GetAllUser() {
    try {
        // Aggregate pipeline to get counts for each userType
        const userCounts = await User.aggregate([
            {
                $group: {
                    _id: "$userType",
                    count: { $sum: 1 }
                }
            }
        ]);

        // Find all users
        const users = await User.find();

        return {
            status: true,
            data: {
                users: users,
                userCounts: userCounts.reduce((acc, curr) => {
                    acc[curr._id] = curr.count;
                    return acc;
                }, {})
            }
        };
    } catch (error) {
        return {
            status: false,
            error: error,
            message: 'Internal Server Issue'
        };
    }
}


async function UpdateUser(data) {
    // console.log("data===>", data)
    try { 
        let updatedUser = await User.findOneAndUpdate({ _id: data._id }, { $set: data }, { new: true })
        await updatedUser.save()
        // console.log('updated user ==>', updatedUser)
        let team = await GetTeam(updatedUser.referby)
        let user = await User.findById(data._id)
        // let team = await GetTeam(referby)
        user = user.toJSON();

        delete user.password;
        console.log('team', team)
        if (updatedUser) {
            return {
                status: true,
                data: updatedUser,
                token: GenerateToken({ ...user, team }),
            }
        }
    }
    catch (error) {
        return {
            status: false,
            error: error,
            message: 'Internal Server Issue'
        }; 
    }
    

}


async function ResetPassword({phone, password}) {
    try {
        
        let user = await User.findOneAndUpdate({ phone: phone }, { $set: { password: password } }, { new: true })
        
        await user.save()
        user = user.toJSON()
        delete user.password;
        return {
            status: true,
            data: user,
            message:'Passsword Set'
        }

    } catch (error) {
        return {
            status: false,
            error: error,
            message: 'No User Found',
            
        }; 
    }
}

async function DeleteAccount(id) {
    try {
        let user = await User.findByIdAndDelete(id);
        if (!user) {
            return {
                status: false,
                message: 'User Not Found'
            };
        }
        console.log(user)

        // Deleting all reports related to the user's phone number
        let reports = await Report.deleteMany({ phone: user.phone });

        // Deleting all questions related to the user's phone number
        let questions = await Question.deleteMany({ phone: user.phone });

        console.log(reports.deletedCount, '\n', questions.deletedCount);

        return {
            status: true,
            message: 'User Deleted Successfully'
        };
    } catch (error) {
        // Handle specific errors or differentiate error messages
        return {
            status: false,
            error: error,
            message: 'An error occurred while deleting user data'
        };
    }
}


async function GetUserById(id) {
    // console.log('===> getuserbyit from user ',id)
    try { 
        let user = await User.findById(id)
        if (user) {
        

            let referCode = user.referCode
            let team = await GetTeam(referCode)
            user = user.toJSON();

            delete user.password;
            return {
                status: true,
                data: { ...user, team },
                token: GenerateToken({ ...user, team }),
            }
        } else {
            return {
                status: false,
                data:'No User Found'
            }
        }
    } catch (error) {
        return {
            status: false,
            data: "No User Found",
            error
        }
    }
}


module.exports = {
    CreateUser, ResetPassword, DeleteAccount,
    FindUser, Login, VerifyToken, GetUser,
    GetLeadersBoard, GetAllUser, UpdateUser, GetUserById
}