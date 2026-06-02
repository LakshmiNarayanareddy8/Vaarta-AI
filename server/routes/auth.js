const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");


router.post("/register", async (req,res)=>{

 const {name,email,password} = req.body;

 try{

  if(!name || !email || !password){
   return res.status(400).json({
    message:"Fill all fields"
   });
  }


  const existingUser =
   await User.findOne({email});


  if(existingUser){
   return res.status(400).json({
    message:"User already exists"
   });
  }


  const hashedPassword =
   await bcrypt.hash(password,10);


  const user = new User({

   name,
   email,
   password:hashedPassword,
   role:"user"

  });


  await user.save();


  res.json({
   message:"Registered successfully"
  });


 }catch(err){

  res.status(500).json({
   message:"Server error"
  });

 }

});



router.post("/login", async (req,res)=>{

 const {email,password,role} = req.body;

 try{


  if(!email || !password){
   return res.status(400).json({
    message:"Enter email and password"
   });
  }


  const user =
   await User.findOne({email});


  if(!user){
   return res.status(400).json({
    message:"User not found"
   });
  }


  const validPassword =
   await bcrypt.compare(
    password,
    user.password
   );


  if(!validPassword){
   return res.status(400).json({
    message:"Invalid password"
   });
  }



  if(role==="admin" && user.role!=="admin"){
   return res.status(403).json({
    message:"Not an admin account"
   });
  }



  if(role==="user" && user.role==="admin"){
   return res.status(403).json({
    message:"Admin must login as admin"
   });
  }



  const token = jwt.sign(

   {
    id:user._id,
    role:user.role
   },

   process.env.JWT_SECRET,

   {expiresIn:"7d"}

  );



  res.json({

   token,
   role:user.role

  });


 }catch(err){

  res.status(500).json({
   message:"Server error"
  });

 }

});


module.exports = router;