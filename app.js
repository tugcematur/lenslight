import express from "express"
import dotenv from "dotenv"
import conn from "./db.js"
import cookieParser from "cookie-parser"
import fileUpload from "express-fileupload"
import {v2 as cloudinary} from "cloudinary"
import methodOverride from "method-override"
import pageRoute from "./routes/pageRoute.js"
import photoRoute from "./routes/photoRoute.js"
import userRoute from "./routes/userRoute.js"
import { checkUser } from "./middlewares/authMiddleware.js"

dotenv.config()

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET
})
//connection to the db
conn()

const app = express()
const port = process.env.PORT

//ejs template engine
app.set("view engine","ejs")

//static files middleware
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({extended:true}))//form bodysindeki verileri parse edebilmesi için
app.use(cookieParser())
app.use(fileUpload({useTempFiles: true}))
app.use(methodOverride('_method',{
    methods: ['POST','GET']
}))
//routes
app.use('*',checkUser)//tüm get metodlarında çalışaceak,use hem get hem post için anlamına geliyor
app.use('/', pageRoute)
app.use('/photos', photoRoute)
app.use('/users', userRoute)

// app.get('/',(req,res)=>{
//    // res.send("Index")
//    res.render('index')
// })

// app.get('/about',(req,res)=>{

//     res.render('about')
//  })

app.listen(port,() => {
    console.log(`server calisiyor, ${port}`)
})


