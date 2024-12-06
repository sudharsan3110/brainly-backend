import {Request,Response,NextFunction, RequestHandler} from 'express';
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET || '123abc';

//@ts-ignore
const userMiddleware:RequestHandler = (req:Request,res:Response,next:NextFunction) => {
    const authHeader = req.headers['authorization'] as string;
    const token = authHeader && authHeader.split(' ')[1];
    
    if(!token){
        return res.status(401).json({
            "error":"no  token"
        })

    }
    try{

        const user = jwt.verify(token,secretKey);
        req.user = user as { id: string, email?: string };
        next();
    }catch(e){
            return res.status(411).json({
                "error" :"Invalid JWT Token"
            })
    }

}
export default userMiddleware

