const express = require('express')
const route = express.Router()
const fromModule = require('../modules/authentication')

route.get('/',fromModule.Start)

route.post('/user/signup',fromModule.userSignup)
route.post('/user/login',fromModule.userLogin)
route.get('/user/verificationMail/:id',fromModule.EmailVerificationSent)
route.post('/user/account/verify ',fromModule.EmailVerify)

route.post('/user/forgetpassword',fromModule.ForgetPassword)
route.get('/user/verify/:id',fromModule.ForgetPasswordVerify)
route.post('/user/savepassword/:id',fromModule.savePassword)

route.post('/admin/login',fromModule.adminLogin)
route.post('/admin/signup',fromModule.adminSignup)
route.get('/admin/verificationMail/:id',fromModule.AdminEmailVerificationSent)
route.post('/admin/account/verify ',fromModule.AdminEmailVerify)

route.put('/admin/forgetpassword',fromModule.adminForgetPassword)
route.post('/admin/verify/:id',fromModule.adminForgetPasswordVerify)
route.post('/admin/savepassword/:id',fromModule.adminsavePassword)

module.exports = route