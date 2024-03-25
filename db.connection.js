import mongoose from "mongoose";

const connectionDb =  async() => {
    await mongoose.connect(process.env.dbConnectionUrl)
    .then(() => { console.log("the server connect database") })
    .catch(() => { console.log("the server error connect database") })
}


export default connectionDb