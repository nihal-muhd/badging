const { response } = require('express');
var express = require('express');
const adminUserHelpers = require('../helpers/adminUser-helpers');
var router = express.Router();
const userHelpers = require('../helpers/adminUser-helpers');

// settingup middleware
const verifyLogin=((req,res,next)=>{
  if(req.session.adminloggedIn)
  next();
  else{
    res.render('admin/adminLogin',{"loginError": req.session.adminloginErr })
    req.session.adminloginErr=false
  }
})

// Admin login
router.get('/',verifyLogin, (req, res,next) => {
    res.redirect('/admin/home')
})

router.post('/', (req, res) => {
  adminUserHelpers.doadminLogin(req.body).then((response) => {
    if (response.status) {
      req.session.adminloggedIn = true
      req.session.admin = response.admin
      res.redirect('/admin/home')
    } else {
      req.session.adminloginErr = true
      res.redirect('/admin')
    }
  })
})

/* GET home page. */
router.get('/home',verifyLogin, (req, res, next)=>{
  adminUserHelpers.getAllUser().then((show_users) => {
    res.render('admin/view-user', { admin: true, show_users });
  })
}) 
  

// Admin adding user
router.get('/add-user',verifyLogin, (req, res,next) => {
  if(req.session.adminerror){
    res.render('admin/add-user',{"adminEmailError":req.session.adminerror})
    req.session.adminerror=false
  }else{
  res.render('admin/add-user')
  }
})

router.post('/add-user', (req, res) => {
  adminUserHelpers.addUser(req.body).then((response) => {
    if(response.emailerror){
      req.session.adminerror="email already exist"
      res.redirect('/admin/add-user')
    }else{
    res.redirect('/admin/add-user')
    }
  })
})

// Deleting user
router.get('/delete-user/:id', (req, res) => {  // we are receiving the id from view-user
  let proId = req.params.id 
  console.log(proId)
  adminUserHelpers.deleteUser(proId).then((response) => {
    res.redirect('/admin/home')
  })

})

// Ediitng user
router.get('/edit-user/:id', async (req, res) => {
  if(req.session.updateuserEmail){
    res.render('admin/edit-user', { "editError":req.session.updateuserEmail })
    // req.session.updateuserEmail=false
  }else{
    let userDetails = await userHelpers.getUserDetails(req.params.id)
    console.log(userDetails)
    res.render('admin/edit-user', { userDetails })
  }
  })
  
  

router.post('/edit-product/:id', (req, res) => {
  console.log(req.params)
  userHelpers.updateUser(req.params.id, req.body).then((response) => {
    console.log(response)
    if(response.updateUseremail){
      req.session.updateuserEmail="Email already exist"
      res.redirect('/admin/edit-user/'+req.params.id)
    }else{
    res.redirect('/admin/home')
    }
  })
})

// Admin logout
router.get('/logout', (req, res) => {
  req.session.admin=null
  req.session.adminloggedIn=false
  res.redirect('/admin')
})



module.exports = router;
