

// send respons after controller file error 

export const errorHAndling = (err, req, res, next) => {

    if (err) {
        return res.status(err['cause'] || 500).json({
            masage: "catch error ",
            error: err.message,
            location: err.stack
        })
    }
}