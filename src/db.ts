import mongoose from 'mongoose';
import {model,Schema} from 'mongoose';

const name = async() =>{
    await mongoose.connect("mongodb://localhost:27017/brainly");
}

const UserSchema = new Schema({
    username:{type:String,unique:true,required:true},
    password:{type:String,required:true},
    email:{type:String,required:true,unique:true}
})
const TagSchema = new Schema({
    title:{type:String,unique:true,required:true}

})
const contentType = ['images','audio','video','document'];
const ContentSchema = new Schema({
    link: {type:String,unique:true,required:true},
    type:{type:String,enum:contentType,required:true},
    tags:{type:mongoose.Types.ObjectId,ref:'Tag'},
    title:{type:String,unique:true,required:true},
    userId:{type:mongoose.Types.ObjectId,ref:'user',required:true},
})

const linkSchema = new mongoose.Schema({
    hash: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  });
  
 const userModel =  model("User",UserSchema) //schema is equal to table and 
 const TagModel = model("Tag",TagSchema);
 const linkModel = model("link",linkSchema)
 const contentModel = model("content",ContentSchema)
 
export {userModel, linkModel, contentModel,TagModel}
name();