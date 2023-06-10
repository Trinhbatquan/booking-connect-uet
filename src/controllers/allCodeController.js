const {getAllCodeByTypeService} = require("../services/allCodeService")


const getAllCodeByType= async (req, res) => {
    const {type} = req.query;
    console.log(type)
    if (!type ) {
        res.status(400).send({
            codeNumber: 1,
            message: "Missing parameter type"
        })
    } else {
        try {
            const data = await getAllCodeByTypeService(type);
            res.status(200).send({
                codeNumber: 0,
                message: "get all code by type succeed",
                allCode: data
            })
        } catch (e) {
            res.status(200).send({
                codeNumber: -1,
                message: "Not get all code by type"
            })
        }
    }
}

module.exports = {
    getAllCodeByType
}