import  express,{Request,Response,NextFunction,RequestHandler}  from 'express'
import jwt from 'jsonwebtoken'
const app = express();
import {userModel,contentModel} from './db'
import {z} from 'zod'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import userMiddleware from './userMiddleware'
import {generateToken} from './utils/generateToken'
import { error } from 'console';
dotenv.config();
const JWT_SECRET = process.env.JWT_TOKEN || '123abc';
 const saltRounds = 10;

app.use(express.json())

//@ts-ignore
app.post('/v1/api/signin',async(req:Request,res:Response)=>{
    const {email,password} = req.body;
    try{
        if(!(email && password))
            return res.status(400).json({"message":"enter the email and password"})

        const user = await userModel.findOne({
           email
            
        })
        if(!user){
            return res.status(500).json(
                "wrong user cretentials"
            )
        }
        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch)
            return res.status(400).json({"message":"invalid password"})
        const token = jwt.sign({id:user._id},JWT_SECRET)
        res.status(200).json({
            "token":token
        })
    }
    catch (err:any) {
    res.status(500).json({ message: 'Error logging in', error: err.message });
  }
        
    
   
})
//@ts-ignore
app.post('/v1/api/signup',async(req:Request,res:Response)=>{
    const {username,password,email} = req.body;
    if(!(username && password && email))
            return res.status(400).json({"message":"username password and email required"})
    try{
        const hash = bcrypt.hashSync(password, saltRounds);
        const exisitingUser = await userModel.findOne({email:email})
            if(!exisitingUser){
            const newUser = await userModel.create({
                username:username,
                password:hash,
                email:email
            })
            const token = jwt.sign({id:newUser._id},JWT_SECRET)
            return res.json({
                "token":token
            })
        }
        return res.json("user already exits");
    }
    catch(e){
        console.log(e);
    }
})
//@ts-ignore
app.post('/v1/api/content', userMiddleware, async (req: Request, res: Response) => {
    const {link,type,tag,title} = req.body;
    const userid = req.user?.id
    console.log(userid);
    if(!userid)
            return res.status(400).json({"error":"not authenticted user"})
    try{
        const newContent = await contentModel.create(
            {link,
            type,
            tag,
            title,
            userId:userid}
        )
        res.json({"message":"content added successfully"})
    }catch(e){
        res.status(404).json({
            "error":e
                            
        })
    }
})
//@ts-ignore
app.delete('/v1/api/content/:id',userMiddleware, async (req:Request,res:Response)=>{
    const contentId = req.params.id
    const userid = req.user?.id
    if(!userid)
            return res.status(411).json({"error":"user not authenticated"})
    try{
        const content = await contentModel.findOne({
            _id:contentId
        })
        if(!content)
            return res.status(404).json({"message":"data not found enter correct contentid"})
        if(content.userId.toString() != userid)
            return res.status(403).json({"message":"unauthorized to delete this content"})
    }
    catch(e){
            console.log("error deleting content"+e);
    }
    
})
app.post('/v1/api/share',(req:Request,res:Response)=>{
    
})
app.get('/v1/api/:shareLink',(req:Request,res:Response)=>{
    
})

app.listen(3000,()=>{
    console.log(`server is running`)
})

