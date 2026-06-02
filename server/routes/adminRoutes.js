const router = require("express").Router();
const auth = require("../middleware/auth");

const User = require("../models/User");
const Prediction = require("../models/Prediction");



router.get("/analytics", auth, async (req,res)=>{

 try{

 const totalUsers =
 await User.countDocuments();

 const totalPredictions =
 await Prediction.countDocuments();

 const fakeCount =
 await Prediction.countDocuments({
 result:"Fake"
 });

 const realCount =
 await Prediction.countDocuments({
 result:"Real"
 });


 res.json({

 totalUsers,
 totalPredictions,
 fakeCount,
 realCount

 });

 }catch{

 res.status(500).json({
 message:"Analytics failed"
 });

 }

});



router.get("/users", auth, async (req,res)=>{

 try{

 const users = await User.find();


 const usersWithCounts = await Promise.all(

 users.map(async(user)=>{

 const count =
 await Prediction.countDocuments({
 userId:user._id
 });

 return{

 ...user._doc,

 queries:count

 };

 })

 );


 res.json(usersWithCounts);


 }catch{

 res.status(500).json({
 message:"Users fetch failed"
 });

 }

});



router.delete("/prediction/:id",auth,async(req,res)=>{

 try{

 await Prediction.findByIdAndDelete(
 req.params.id
 );

 res.json({message:"Deleted"});

 }catch{

 res.status(500).json({
 message:"Delete failed"
 });

 }

});



// GET history for a specific user (admin only)
router.get("/users/:id/history", auth, async (req, res) => {
 try {
  if (req.user.role !== "admin") {
   return res.status(403).json({ message: "Admin only" });
  }
  const history = await Prediction
   .find({ userId: req.params.id })
   .sort({ createdAt: -1 });
  res.json(history);
 } catch {
  res.status(500).json({ message: "User history fetch failed" });
 }
});


module.exports=router;