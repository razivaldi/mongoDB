const express = require('express') //Standard of node.js used to import a file
const app = express()
const router = express.Router() //This is for router-based middleware
const bodyParser = require('body-parser') //To call body parser
const adminRouter = require('./routes/admin')
const shopRouter = require('./routes/shop')
const mongoose = require('mongoose')
const path = require('path')
const Users = require('./models/users')
const multer = require('multer')
const cors = require('cors')
const {v4: uuidv4} = require('uuid')
const authRoutes = require('./routes/auth')
const cookieParser = require('cookie-parser')

console.log("start express server")

//Installing CORS. CORS has to be called on top 
app.use(cors({ credentials: true, origin: "http://localhost:3000" }))

app.use((req, res, next) => {
    res.setHeader('Acceess-Control-Allow-Origin', '*') //setHeader depends on per browser basis: some browsers can access without header
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE')
    res.setHeader('Acceess-Control-Allow-Headers', 'Content-Type, Authorization')
    next()
})

app.use(bodyParser.urlencoded({extended: false})) //To read all encoded URL(random gibberish)
app.use(bodyParser.json())
app.use(cookieParser())
app.use('/auth', authRoutes)

// app.use((req, res, next) => {
//     console.log("Time: ", Date.now())
//     Users.findById('65423914b5a457e233b49c24')
//     .then(user => {
//         req.user = 
//         next()
//     })
//     .catch(err => console.log(err))
// })

//Middleware if an URL directs to binary file
app.use('/images', express.static(path.join(__dirname, 'images')))

const fileStorage = multer.diskStorage({
    destination : function(req, file, cb){
        cb(null, 'images')
    },
    filename: function(req, file, cb){
        cb(null, uuidv4()+file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if(
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'

    ){
        cb(null, true)
    }else{
        cb(null, false)
    }
}

app.use(
    multer({
        storage: fileStorage,
        fileFilter: fileFilter
    }).single('image')
)
//This instance, we can only support uploading one item at a time, with image being the field of the file you use on frontend


app.use("/", router)
router.use('/admin', adminRouter)
router.use('/shop', shopRouter)

//Middleware to redirect user if the filtered URL is not found on database
app.use((req, res, next) => {
    res.status(404).send('<h1>What are you doing?</h1>')
})

//We will be using centralized error handling to handle all errors that happens on backend
app.use((error, req, res, next) => {
    console.log('errorrrr brooo')
    const status = error.statusCode || 500
    const myMessage = error.message

    res.status(status).json({
        status: status,
        message: myMessage})
})

mongoose.set('strictQuery', true)
mongoose.connect('mongodb+srv://Admin:qhJPKjugzsTt4sbv@fullstackmongo.hnbqwp6.mongodb.net/ecom?retryWrites=true&w=majority')
.then(result => {
    console.log("server connected")
})
.then(res => {
    console.log(res)
    app.listen(8000)
}).catch(err => console.log(err))