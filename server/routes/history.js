const router = require("express").Router();
const auth = require("../middleware/auth");
const Prediction = require("../models/Prediction");

router.get("/history",auth,async(req,res)=>{

 try{

 const history = await Prediction
 .find({userId:req.user.id})
 .sort({createdAt:-1});

 res.json(history);

 }catch{

 res.status(500).json({
 message:"History fetch failed"
 });

 }

});



router.get("/history/all",auth,async(req,res)=>{

 try{

 if(req.user.role !== "admin"){
  return res.status(403).json({
   message:"Admin only"
  });
 }

 const history = await Prediction
 .find()
 .populate("userId","name email")
 .sort({createdAt:-1});

 res.json(history);

 }catch{

 res.status(500).json({
 message:"Admin history failed"
 });

 }

});



router.delete("/history/:id",auth,async(req,res)=>{

 try{

 await Prediction.deleteOne({

 _id:req.params.id,
 userId:req.user.id

 });

 res.json({
 message:"Deleted"
 });

 }catch{

 res.status(500).json({
 message:"Delete failed"
 });

 }

});



router.delete("/history/admin/:id",auth,async(req,res)=>{

 try{

 if(req.user.role!=="admin"){
 return res.status(403).json({
 message:"Admin only"
 });
 }

 await Prediction.deleteOne({
 _id:req.params.id
 });

 res.json({
 message:"Deleted by admin"
 });

 }catch{

 res.status(500).json({
 message:"Admin delete failed"
 });

 }

});


module.exports=router;