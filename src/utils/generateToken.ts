const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_TOKEN

export const generateToken=(user: {_id:String})=>{
    return jwt.sign({
        id:user._id
    },JWT_SECRET)
}