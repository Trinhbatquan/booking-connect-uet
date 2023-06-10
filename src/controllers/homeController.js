const db = require("../models")
const {userCreate, readUser} = require("../services/userSevice")


const getHomePage = async (req, res) => {

    try {
        const data = await db.User.findAll(); //sequelize object
        console.log(JSON.stringify(data))
        if (data) {
            return res.render("homePage.ejs", 
            {
                data: JSON.stringify(data) // bỏ data thừa + convert to JSON
            })
        }
    } catch (e) {
        console.log("error " + e)
    }
}


const login = async(req, res) => {
    return res.render("login.ejs")
}

const createUser = async(req, res) => {

    const data = await userCreate(req.body)
    return res.send(data)
}


const readData = async(req, res) => {

    const data = await readUser();
    console.log(data)
    return res.render("readUser.ejs", {
        data: data
    })
}

module.exports = {
    getHomePage: getHomePage,
    login,
    createUser,
    readData
}