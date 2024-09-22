const Vendor = require('../model/Vendor')
const jwt = require('jsonwebtoken')
const dotEnv = require('dotenv')

dotEnv.config()
const secretKey = process.env.WhatIsYourName

const verifyToken = async (req, res, next) => {
    const token = req.headers.token //passing this token through headers with req 

    if(!token){
        return res.status(401).json({error: "Token is required"})
    }

    try {
        const decoded = jwt.verify(token, secretKey) //verifying the token with secretKey using jwt verify method and assigning to the decoded variable
        const vendor = await Vendor.findById(decoded.vendorId)
 
        if(!vendor){
            return res.status(404).json({error: "Vendor is not Found"})
        }

        //comaring decoded venodrId with actual vendorId from the database and (verifying)
        req.vendorId = vendor._id

        next() //this function will allow for further actions if the above code is executed correctly
    } catch (error) {
        console.error(error);
       return res.status(500).json({error: "Invalid Token"})
    }
}

module.exports = verifyToken