var express = require('express');
var router = express.Router();
const User = require('./../model/user');
const jwt = require('jsonwebtoken');
let count = 0;


//- login
router.post('/login', async (req, res, next) => {
  let user = { 'email': req.body.username, "password": req.body.password }
  let userdata = await User.find({ email: req.body.username }).exec();
  // step 1
  if (userdata.length != 0 && req.body.password === userdata[0].password) {
    count++;
    //step 2
    if (count % 5 != 0) {
      //step 3
      console.log(validation())
      if (validation()) {
        jwt.sign(user, 'secretkey', (err, token) => {
          res.json({ token: token, userdata })
        })
      } else {
        res.status('500').json({ status: "error", message: "3rd party service didnt allowed to login." })
      }
    } else {
      res.status('500').json({ status: "error", message: "you are barred from login. 5th login attempt. please try again." })
    }
  } else {
    res.status('500').json({ status: "error", message: "username or password not valid" })
  }
});
//- signup
router.post('/signup', async (req, res, next) => {
  var user = new User();
  user.name = req.body.name;
  user.email = req.body.email.trim();
  user.password = req.body.password;
  user.save(function (err) {
    if (err)
      res.status('500').json(err.message)
    res.json(User);
  })
});
//- used this function for 3rd party validation
let validation = () => {
  if ((count % 2) == 0) {
    return true
  } else {
    return false;
  }
}

module.exports = router;
