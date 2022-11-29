const express=require("express")
const { body, validationResult } = require('express-validator');
const router=express.Router()
const User=require("../modle/users.modle")


router.get("",async(req,res)=>{
    try{
        const data= await User.find().lean().exec()
        return res.send(data)

    }catch(err){
        return res.status(501).send(err.massage)
    }
})

router.post("",body("id").notEmpty().isNumeric().withMessage("id is not number").bail().custom( async value => {
    let user= await User.findOne({id:value})
      if (user) {
        throw new Error('id already in user');
      }else{
          return true 
      }
    }),

   body("first_name").isString().isLowercase().isLength({min:3,max:20}).withMessage("first_name 3 to 20 char long"),
   body("last_name").isString().isLowercase().isLength({min:3,max:20}),
   body("ip_address").notEmpty().isIP(),
   body("age").notEmpty(),
   body("email").isEmail().custom( async value => {
    let user= await User.findOne({email:value})
      if (user) {
        throw new Error('E-mail already in user');
      }else{
          return true 
      }
    }),
   body("birth_date").isDate(),
   body("password").isLength({min:8}).custom(value=>{
      let pattern=/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/
      if(pattern.test(value)){
        return true
      }
      throw new Error ("password not strong")
   }),
//    body("passwod").isStrongPassword(),
async(req,res)=>{

    try{
        const errors = validationResult(req);
    if (!errors.isEmpty()) {
        
         let newerror=errors.array().map((el)=>{return {key:el.param,message:el.msg}})        
      return res.status(400).json({ errors: newerror });
    }
           const users=await User.create(req.body)
        // return res.send("users")
        return res.send(users)


    }catch(err){
        return res.status(500).send(err.massage)
    }
})
module.exports=router