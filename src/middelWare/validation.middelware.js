



const dataparamter = ['body', 'query', 'params', 'headers']


export const validtion = (schema) => {



    return (req, res, next) => {
        const returnAllValue = []

        for (const key of dataparamter) {
            const validationres = schema[key]?.validate(req[key], { abortEarly: false })

            if (validationres?.error) {

                returnAllValue.push(...validationres.error.details)
                // return res.json({
                //     "massage": validationres.error.details
                // })
            }
        }

        if (returnAllValue.length >= 1) {
            return res.json({
                "massage": returnAllValue.map(elem => elem.message)
            })
        }
        else {

            next()
        }


    }
}