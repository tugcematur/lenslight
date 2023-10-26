import express from "express"
import dotenv from "dotenv"
import conn from "./db.js"
import pageRoute from "./routes/pageRoute.js"
import photoRoute from "./routes/photoRoute.js"
import userRoute from "./routes/userRoute.js"


dotenv.config()

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

//routes
app.use('/', pageRoute)
app.use('/photos', photoRoute)
app.use('/user', userRoute)

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


