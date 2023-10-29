import User from "../models/userModel.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import Photo from "../models/photoModel.js"



const createUser = async (req, res) => {
    try {
        const user = await User.create(req.body)//taglrdeki name ile db deki sütunlar aynı olmalı
        //  let error1={"name":"tugce"}
        // res.status(201).json({
        //     succeded: true,
        //     user
        // })

        // res.redirect('/login')
        //res.status(201).json(error1) //farkı anlamak için yazdım
        res.status(201).json({ user: user._id })
    }
    catch (error) {

        console.log("ERROR", error)
        let errors2 = {}


        if (error.code === 11000) {
            errors2.email = "The email already registered"
        }

        if (error.name === "ValidationError") {
            Object.keys(error.errors).forEach(key => {
                errors2[key] = error.errors[key].message
            })
        }

        // res.status(500).json({
        //     succeded: false,
        //     error
        // })
        console.log("ERRORS2:", errors2)
        res.status(400).json(errors2)

    }
}

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body
        console.log("req.body", req.body)
        const user = await User.findOne({ username: username })
        let same = false

        if (user) {

            same = await bcrypt.compare(password, user.password)
            console.log("same", same)
        } else {//kullanıcı bulumadığında
            return res.status(401).json({
                succeded: false,
                error: "there is no such user"
            })
        }

        if (same) {
            //res.status(200).send("You are logged in")

            const token = createToken(user._id)
            res.cookie("jwt", token, {
                httpOnly: true,//front dan istekte bulunabileceğim bu cookieye ve http sayfalard kullanabilicem
                maxAge: 1000 * 60 * 60 * 24
            })
            /*    res.status(200).json({
                    user,
                 //   token: createToken(user._id)
                })*/

            res.redirect('/users/dashboard')
        } else {
            res.status(401).json({
                succeded: false,
                error: "Password are not match"
            })
        }


    } catch (error) {
        res.status(500).json({
            succeded: false,
            error
        })
    }
}


const createToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '1d'
    })

}

const getDashboardPage = async (req, res) => {

    const photos = await Photo.find({ user: res.locals.user._id })
    const user = await User.findById({ _id: res.locals.user._id }).populate(["followings", "followers"])
    res.render('dashboard', {
        link: "dashboard",
        photos,
        user
    })
}


const getLogout = (req, res) => {

    res.cookie("jwt", '', {
        maxAge: 1
    })

    res.redirect('/')
}



const getAllUsers = async (req, res) => {
    try {
        //not equal
        const users = await User.find({ _id: { $ne: res.locals.user._id } })


        res.status(200).render('users', {
            users,
            link: "users"

        })

    } catch (error) {
        res.status(500).json({
            succeded: false,
            error
        })
    }
}

const getUser = async (req, res) => {
    try {


        const user = await User.findById({ _id: req.params.id })

        const infollowers = user.followers.some((follower) => {
            return follower.equals(res.locals.user._id)
        })

        const photos = await Photo.find({ user: user._id })
        res.status(200).render('user', {
            user,
            photos,
            link: "users",
            infollowers


        })

    } catch (error) {
        res.status(500).json({
            succeded: false,
            error
        })
    }
}


const follow = async (req, res) => {
    try {

        let user = await User.findByIdAndUpdate(
            { _id: req.params.id },
            { $push: { followers: res.locals.user._id } },
            { new: true } //??


        )

        user = await User.findByIdAndUpdate(
            { _id: res.locals.user._id },
            {
                $push: { followings: req.params.id }
            },
            { new: true } //güncellenmiş hali dön
        )




        // res.status(200).render('user',{
        //     user,
        //     photos,
        //     link:"users"


        // })
        // res.status(200).json({
        //     succeded: true,
        //     user
        // })


        res.status(200).redirect(`/users/${req.params.id}`)

    } catch (error) {
        res.status(500).json({
            succeded: false,
            error
        })
    }
}


const unfollow = async (req, res) => {
    try {

        let user = await User.findByIdAndUpdate(
            { _id: req.params.id },
            { $pull: { followers: res.locals.user._id } },
            { new: true } //??


        )

        user = await User.findByIdAndUpdate(
            { _id: res.locals.user._id },
            {
                $pull: { followings: req.params.id }
            },
            { new: true } //güncellenmiş hali dön
        )



        // res.status(200).render('user',{
        //     user,
        //     photos,
        //     link:"users"


        // })

        // res.status(200).json({
        //     succeded: true,
        //     user
        // })


        res.status(200).redirect(`/users/${req.params.id}`)

    } catch (error) {
        res.status(500).json({
            succeded: false,
            error
        })
    }
}



export { createUser, loginUser, getDashboardPage, getLogout, getAllUsers, getUser, follow, unfollow }