const express = require('express');
const router = express.Router();
const bcrypt = require('../middleware/bcrypt') ;
const jwt = require('../middleware/jwt');
const sms = require('../middleware/sms');
const User = require('../models/user');

// Validate token
router.post('/token', async (req, res, next) => {
  const { token } = req.body;
  try {
    if (token) {
      if (jwt.verify(token)) {
        const payload = jwt.decode(token).payload;
        return res.status(200).send(payload);
      } else {
        return res.status(422).send('invalid_token');
      }
    } else {
      res.status(422).send('no_token_provided');
    }
  } catch (error) {
    return res.status(500).send(error.message)
  }
});

// Validate mobile
router.post('/validatemobile', async (req, res, next) => {
    const { mobile } = req.body;
    if (mobile) {
        try {
            const sixdigitscode = Math.floor(100000 + Math.random() * 900000);
            const sixdigitscodehash = bcrypt.sign(sixdigitscode.toString());
            await sms.send(mobile, sixdigitscode.toString());
            const newuserquery = { mobile };
            const newuserupdate = { mobile, code: sixdigitscodehash, isVerified: false };
            const newuser = await User.findOneAndUpdate(newuserquery, newuserupdate, { upsert: true, new: true });
            const newtoken = jwt.sign({ id: newuser._id });
            return res.status(200).send(newtoken);
        } catch(error) {
          res.status(500).send(error.message);
        }
    } else {
        res.status(422).send('mobile_is_not_provided');
    }
});

// Coonfirm mobile
router.post('/confirmmobile', async (req, res, next) => {
    const { token, code } = req.body;
    if (token && code ) {
        try {
          if (jwt.verify(token)) {
            const payload = jwt.decode(token).payload;
            var olduser = await User.findById(payload.id);
            if (olduser) {
                if (bcrypt.compare(code, olduser.code)) {
                  var olduserquery = { _id: payload.id };
                  var olduserupdate = { isVerified: true };
                  olduser = await User.findOneAndUpdate(olduserquery, olduserupdate, { upsert: false, new: true });
                  var oldtoken = jwt.sign({ id: olduser._id });
                  return res.status(200).send(oldtoken);
                } else {
                  return res.status(422).send("code_is_not_correct");
                }
            } else {
              return res.status(422).send("user_is_not_found");
            }
          } else {
            return res.status(422).send('invalid_token');
          }
        } catch(error) {
          res.status(500).send(error.message);
        }
    } else {
        res.status(422).send('user_token_or_code_not_provided');
    }
});

// Create user
router.post('/create', async (req, res, next) => {
    const { token, name, address, password } = req.body;
    if (token && name && address && password) {
        try {
            if (jwt.verify(token)) {
              const payload = jwt.decode(token).payload;
              const passwordhash = bcrypt.sign(password.toString());
              var cuserquery = { _id: payload.id };
              var cuserupdate = { name, address, password: passwordhash };
              var cuser = await User.findOneAndUpdate(cuserquery, cuserupdate, { new: true });
              var cpayload = {
                  id: cuser._id,
                  name: cuser.name,
                  address: cuser.address,
              }
              var ctoken = jwt.sign(cpayload);
              return res.status(200).send({
                ...cpayload,
                token: ctoken,
              });
            } else {
              return res.status(422).send('invalid_token');
            }
        } catch(error) {
          return res.status(500).send(error.message);
        }
    } else {
        return res.status(422).send('one_of_token/name/address/password_not_provided');
    }
});

// Create initial admin
// router.post('/createinitialadmin', async (req, res, next) => {
//   const { name, address, mobile, password } = req.body;
//   if (name && address && mobile && password) {
//       try {
//         const passwordhash = bcrypt.sign(password.toString());
//         const user = {
//           name,
//           mobile,
//           address,
//           role: 'root',
//           isVerified: true,
//           password: passwordhash,
//         };
//         const userCreated = await User.create(user);
//         return res.status(200).send(userCreated);
//       } catch(error) {
//         return res.status(500).send(error.message);
//       }
//   } else {
//       return res.status(422).send('one_of_name/address/mobile/password_not_provided');
//   }
// });

// Get admins
router.post('/getadmin', async (req, res, next) => {
  const { token, adminid } = req.body;
  if (token) {
      try {
          if (jwt.verify(token)) {
            const payload = jwt.decode(token).payload;
            const role = payload.role;
            if (!["root", "admin"].includes(role)) {
              return res.status(403).send('user_not_admin');
            }
            let admins;
            if (adminid) {
              admins = await User.findById(adminid, '-password');
            } else {
              admins = await User.find({ role: { $in: ["root", "admin"] }}, '-password');
            }
            return res.status(200).send(admins);
          } else {
            return res.status(422).send('invalid_token');
          }
      } catch(error) {
        return res.status(500).send(error.message);
      }
  } else {
      return res.status(422).send('token_not_provided');
  }
});

// Create admin
router.post('/createadmin', async (req, res, next) => {
  const { token, name, address, mobile, password } = req.body;
  if (token && name && address && mobile && password) {
      try {
          if (jwt.verify(token)) {
            const payload = jwt.decode(token).payload;
            const role = payload.role;
            if (role !== 'root') {
              return res.status(403).send('user_not_root');
            }
            const passwordhash = bcrypt.sign(password.toString());
            const user = {
              name,
              mobile,
              address,
              role: 'admin',
              isVerified: true,
              password: passwordhash,
            };
            const userCreated = await User.create(user);
            return res.status(200).send(userCreated);
          } else {
            return res.status(422).send('invalid_token');
          }
      } catch(error) {
        return res.status(500).send(error.message);
      }
  } else {
      return res.status(422).send('one_of_token/name/address/mobile/password_not_provided');
  }
});

// Update admin
router.post('/updateadmin', async (req, res, next) => {
  const { token, name, address, mobile, adminid } = req.body;
  if (token && name && address && mobile && adminid) {
      try {
          if (jwt.verify(token)) {
            const payload = jwt.decode(token).payload;
            const role = payload.role;
            if (role !== 'root') {
              return res.status(403).send('user_not_root');
            }
            const aupdate = { $set: { name, mobile, address } }
            const adminUpdated = await User.findByIdAndUpdate(adminid, aupdate, { new: true });
            return res.status(200).send(adminUpdated);
          } else {
            return res.status(422).send('invalid_token');
          }
      } catch(error) {
        return res.status(500).send(error.message);
      }
  } else {
      return res.status(422).send('one_of_token/name/address/mobile/adminid_not_provided');
  }
});

// Delete admin
router.post('/deleteadmin', async (req, res, next) => {
  const { token, adminid } = req.body;
  if (token && adminid) {
      try {
          if (jwt.verify(token)) {
            const payload = jwt.decode(token).payload;
            const role = payload.role;
            if (role !== 'root') {
              return res.status(403).send('user_not_root');
            }
            await User.deleteOne({ _id: adminid });
            return res.status(200).send("user_deleted");
          } else {
            return res.status(422).send('invalid_token');
          }
      } catch(error) {
        return res.status(500).send(error.message);
      }
  } else {
      return res.status(422).send('one_of_token/name/address/mobile/password_not_provided');
  }
});

// Authenticate user
router.post('/authenticate', async (req, res, next) => {
    const { mobile, password } = req.body;
    if (mobile && password) {
        try {
          var user = await User.findOne({mobile});
          if (!user) {
            return res.status(404).send('user_not_found');
          }
          var userpassword = user.password;
          if (bcrypt.compare(password, userpassword)) {
              var authpayload = {
                  _id: user._id,
                  name: user.name,
                  role: user.role,
                  address: user.address,
              }
              var authtoken = jwt.sign(authpayload);
              res.status(200).send({
                ...authpayload,
                token: authtoken,
              });
          } else {
              return res.status(403).send('wrong_mobile_or_password');
          }
        } catch (err) {
          return res.status(500).send(err.message);
        }
    } else {
        return res.status(422).send('user_mobile_or_password_not_provided');
    }
});

module.exports = router;