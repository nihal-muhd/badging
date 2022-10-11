var db = require('../config/connection')
var collection = require('../config/collections')
const bcrypt = require('bcrypt')
var objectId = require('mongodb').ObjectId

// Here i used only one helpers because in this project only method is add,edit,delete by admin and signup,login by user

module.exports = {
    // This fn is used for adding user by admin
    addUser: (userDetails) => {
        return new Promise(async (resolve, reject) => {
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ Email: userDetails.Email })
            if (user) {
                resolve({ emailerror: true })
            } else {
                userDetails.Password = await bcrypt.hash(userDetails.Password, 10)
                db.get().collection(collection.USER_COLLECTION).insertOne(userDetails).then((data) => {
                    resolve(data.insertedId)
                })
            }
        })
    },
    // This fn is used to view user details in admin panel
    getAllUser: () => {
        return new Promise(async (resolve, reject) => {
            let show_users = await db.get().collection(collection.USER_COLLECTION).find().toArray()
            resolve(show_users)
        })
    },
    // This function is used for signup of user. (Note: we can use addUser fun for this also)
    doSignup: (userData) => {
        return new Promise(async (resolve, reject) => {
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ Email: userData.Email })
            if (user) {
                resolve({ emailerror: true })
            } else {
                userData.Password = await bcrypt.hash(userData.Password, 10)
                await db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data) => {
                    resolve(data.insertedId)
                })
            }

        })
    },
    // function for login of user
    doLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
            let loginStatus = false
            let response = {}
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ Email: userData.Email })
            if (user) {
                bcrypt.compare(userData.Password, user.Password).then((status) => {
                    if (status) {
                        console.log("login succcesful")
                        response.user = user
                        response.status = true
                        resolve(response)
                    } else {
                        console.log("Login failed")
                        resolve({ status: false })
                    }
                })
            } else {
                console.log("login failed")
                resolve({ status: false })
            }
        })
    },

    // delete user from admin panel
    deleteUser: (userId) => {
        return new Promise(async (resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION).deleteOne({ _id: objectId(userId) }).then((response) => {
                resolve(response)
            })
        })
    },

    // When clicking edit button user can get details of one user
    getUserDetails: (userId) => {
        return new Promise(async (resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION).findOne({ _id: objectId(userId) }).then((data) => {
                resolve(data)
            })
        })
    },

    // fn for updating user data from admin
    updateUser: (userId, userDetails) => {
        return new Promise(async (resolve, reject) => {
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ Email: userDetails.Email })
            if(user){
                resolve({updateUseremail:true})
            }else{
                db.get().collection(collection.USER_COLLECTION)
                .updateOne({ _id: objectId(userId) }, {
                    $set: {
                        Name: userDetails.Name,
                        Email: userDetails.Email,
                    }
                }).then((response) => {
                    resolve(response)
                })
            }

        })
    },
    // Fn for admin login
    doadminLogin: (adminData) => {
        return new Promise(async (resolve, reject) => {
            let loginStatus = false
            let response = {}
            let admin = await db.get().collection(collection.ADMIN_COLLECTION).findOne({ Email: adminData.Email })
            if (admin) {
                if (adminData.Password == admin.Password) {
                    console.log("login succcesful")
                    response.admin = admin
                    response.status = true
                    resolve(response)
                } else {
                    console.log("Login failed")
                    resolve({ status: false })
                }
            } else {
                console.log("login failed")
                resolve({ status: false })
            }
        })
    }
}

