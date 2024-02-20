
// middelware multer

import multer from "multer"
import { nanoid } from "nanoid"
import { multerFormatAllowed } from "../utils/multer.formatAllowed.utils.js"
import fs from "fs"
import path from "path"




export const multerMiddelcloudHost = ({ extentions = `${multerFormatAllowed.Image}` }) => {


    // storage
    const multerstorge = multer.diskStorage({

        filename: (req, file, cb) => {
            console.log(file)
            const filename = nanoid(9) + "_" + file.originalname
            cb(null, filename)
        }
    })

    // file filter
    const filefilter = (req, file, cb) => {
        if (extentions.includes(file.mimetype.split("/")[1])) {
            return cb(null, true)
        }
        return cb(new Error("file is not allowed"), false)
    }

    const file = multer({ fileFilter: filefilter, storage: multerstorge })
    return file

}



//the multer main function local Host
// export const multerMiddel = ({ extentions = `${multerFormatAllowed.Image}`, filePath = "general5" }) => {

//     const distanationPath = path.resolve(`upload/${filePath}`)
//     console.log("the" + distanationPath)
//     // check find folder
//     if (!fs.existsSync(distanationPath)) {
//         fs.mkdirSync(distanationPath, { recursive: true })
//         console.log("the folder created")
//     }
//     console.log("the folder found")

//     // storage
//     const multerstorge = multer.diskStorage({
//         destination: (req, file, cb) => {
//             cb(null, distanationPath)
//         },
//         filename: (req, file, cb) => {
//             console.log(file)
//             const filename = nanoid(9) + "_" + file.originalname
//             cb(null, filename)
//         }
//     })

//     // file filter
//     const filefilter = (req, file, cb) => {
//         if (extentions.includes(file.mimetype.split("/")[1])) {
//             return cb(null, true)
//         }
//         return cb(new Error("file is not allowed"), false)
//     }


//     const file = multer({ fileFilter: filefilter, storage: multerstorge })
//     return file


// }