const Admin = require("../models/adminModel")

// Function to check whether the admin is logged in
async function isAdminLoggedIn (req, res, next) {
  try {
    if (!(req.session && req.session.admin)) {
      console.log(req.session)
      return res.json({ error: "Unauthorised Access, Please Login!"})
    }else {
      const admin = await Admin.findOne({ _id : req.session.admin._id })
      if(admin) {
        next();
      } else {
        console.log(req.session)
        req.session.admin = null;
        return res.json({ error: "Unauthorised Access, Please Login!"})
      }
    }
  } catch(e) {
    res.status(400).send("Something Went Wrong!" + e)
  }
}

module.exports = {
  isAdminLoggedIn 
}