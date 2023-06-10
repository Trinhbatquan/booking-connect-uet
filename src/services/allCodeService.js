const db = require("../models");



const getAllCodeByTypeService = async (type) => {
    return new Promise(async (resolve, reject) => {
        try {
            const database = await db.AllCode;
            console.log({database})
            const allCodeByType = await db.AllCode.findAll({
                where: {
                    type
                }
            });
            console.log(allCodeByType)
            resolve(allCodeByType)
        } catch (e) {
            console.log(e)
            reject(e)
        }
    })

}

module.exports = {
    getAllCodeByTypeService
}