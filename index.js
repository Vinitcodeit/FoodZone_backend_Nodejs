const express = require('express')
const dotEnv = require('dotenv')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const vendorRoutes = require('./routes/vendorRoutes')
const firmRoutes = require('./routes/firmRoutes')
const productRoutes = require('./routes/productRoute')


const app = express()

const PORT = 4000;

dotEnv.config()

mongoose.connect(process.env.MONGO_URI)
.then(()=>{console.log("Database Connected Successfully")})
.catch((error)=>console.log(error.message))

app.use(bodyParser.json())
app.use('/vendor', vendorRoutes)
app.use('/firm', firmRoutes)
app.use('/product', productRoutes)

app.use('/home', (req, res)=>{
    res.send("hello");
})


app.listen(PORT, ()=>{console.log(`server is running on PORT ${PORT}`);})