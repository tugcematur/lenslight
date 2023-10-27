import Photo from "../models/photoModel.js"
import {v2 as cloudinary} from "cloudinary"
import fs from "fs"


const createPhoto = async (req, res) => {//zaman alacak işlemlerin başına await gelir
    //  console.log("REQ.BODY",req.body)


    const result = await cloudinary.uploader.upload(
        req.files.image.tempFilePath,
        {
            use_filename: true,
            folder: 'lenslight_tr'
        }
    )

    console.log("RESULT:",result)

    try {

    //    const photo = await Photo.create(req.body) //yukardaki işlemi beklemeden gönderiyor, fonksiyonu asenkrona çevirmeliyiz
        // res.status(201).json({
        //     succeded: true,
        //     photo
        // })

        await Photo.create({
            name:req.body.name,
            description:req.body.description,
            user: res.locals.user._id,
            url: result.secure_url
        })
      
        fs.unlinkSync(req.files.image.tempFilePath) 

        res.status(201).redirect('/users/dashboard')

    }



    catch (error) {
        res.status(500).json({
            succeded: false,
            error
        })
    }

}


const getAllPhotos = async (req, res) => {
    try {

        const photos = await Photo.find({user: {$ne:res.locals.user._id}})
        // res.status(200).json({
        //     succeded: true,
        //     photos
        // })

        res.status(200).render('photos',{
            photos,
            link:"photos"
        
        })

    } catch (error) {
        res.status(500).json({
            succeded: false,
            error
        })
    }
}


const getPhoto = async (req, res) => {
    try {

        const photo = await Photo.findById({_id:req.params.id}).populate("user")
        res.status(200).render('photo',{
            photo,
            link:"photos"
        
        })

    } catch (error) {
        res.status(500).json({
            succeded: false,
            error
        })
    }
} 

export { createPhoto,getAllPhotos,getPhoto }