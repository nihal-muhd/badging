const { response } = require('express');
var express = require('express');
const adminUserHelpers = require('../helpers/adminUser-helpers');
var router = express.Router();

// setting up middleware
const verifyLogin=((req,res,next)=>{
  if(req.session.loggedIn)
  next();
  else{
    res.render('user/Login',{"loginError": req.session.loginErr })
    req.session.loginErr=false
  }
})

// Get login
router.get('/',verifyLogin,(req,res,next)=>{
  res.redirect('/home')
});

router.post('/',(req,res)=>{
  adminUserHelpers.doLogin(req.body).then((response)=>{
    if (response.status) {
      req.session.loggedIn = true
      req.session.user = response.user
      res.redirect('/home')
    } else {
      req.session.loginErr = true
      res.redirect('/')
    }

  })
})

/* View homepage. */
router.get('/home',verifyLogin, function(req, res, next) {
  let user = req.session.user
  res.render('user/view-homePage',{user});
});

// signup
router.get('/signup',(req,res)=>{
  if(req.session.usererror){
    res.render('user/signup',{"emailError":req.session.usererror})
    req.session.usererror=false
  }else{
    res.render('user/signup')
  }
})

router.post('/signup',(req,res)=>{
  // The response passed here is the email error. If there is a error in response, req.session.error is passed  to signup get method
  adminUserHelpers.doSignup(req.body).then((response)=>{
    // console.log(response);
    if(response.emailerror){
      req.session.usererror="email already exist"
      res.redirect('/signup')
    }else{
    res.redirect('/')
    }
  })

})



router.get('/logout',(req,res)=>{
req.session.loggedIn=false
req.session.user=null
res.redirect('/')
})

module.exports = router;
