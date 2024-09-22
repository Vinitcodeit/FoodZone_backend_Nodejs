const express = require('express')
const firmController = require('../controllers/firmController.js')
const verifyToken = require('../middlewares/verifyToken.js')

const router = express.Router()

router.post('/addfirm', verifyToken, firmController.addFirm)

router.get('/uploads/:imageName', (req,res)=>{
    const imageName = req.params.imageName
    res.header('Content-Type', 'image/jpeg')
    res.sendFile(path.join(__dirname, '..', 'uploads', imageName))
})

router.delete('/:firmId', firmController.deleteFirmById)


module.exports = router