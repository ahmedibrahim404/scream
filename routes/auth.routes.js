var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
var { isAccount, getUserWithPassword, createUser } = require('../controllers/userController');
var { checkToken } = require('../controllers/token');


router.get('/login', function(req, res, next) {
    if(!req.session.loggedin){ // if User is logged in
        res.render('auth/login');
    } else {
        res.redirect('/')
    }
});


router.get('/register', function(req, res, next) {
    if(!req.session.loggedin){
        // Send to register with token
        jwt.sign({}, `secret-key-hahahah`, (err,token) => {
            res.render('auth/register', {
                token
            });
        });
    } else {
        res.redirect('/')
    }
});




router.post('/register', function(req,res){
    const data=checkToken(req.body['token'], 'secret-key-hahahah');
    if(data){
        isAccount(req.body.user,req.body.email).then((found) => {
            if(!found){
                createUser(req.body.user, req.body.email, req.body.password, (user) => {
                    res.render('auth/login', {
                        successLogin:true,
                        username:user.username
                    });
                });
            } else {
                res.render('auth/register', {
                    token:req.body['token'],
                    error:'Username or Email already in!'
                });
            }  
        });
    } else {
        res.sendStatus(403);
    }
})

router.post('/login', function(req,res){
    if(req.body){
        let username = req.body.username;
        let password = req.body.password;
    
        getUserWithPassword(username, password).then((user) => {
            if(user){

                jwt.sign({
                    ...user
                }, `secret-key-hahahah`, (err,token) => {
                    if (err) throw err;
                    req.session.token = token;
                    req.session.loggedin = true;
                    req.session.username = username;
                    req.session.id = user.id;
                    req.session.isImg = user.profile_img;
                    req.session.save();
                    res.redirect('/');
                });

            } else {

                res.redirect('auth/login',{
                    errors: [ "Wrong Username or Passowrd!" ],
                    username:req.body.username,
                    password:req.body.password
                });
    
            }
            
        });

    }
})

router.get('/', function(req, res, next) {
    if(req.session.loggedin){
        res.render('components/home',{
            username:req.session.username,
            isImg:req.session.isImg
        });
    } else {
        res.redirect('/login');
    }
});



// router.get('/navbar', (req,res) => res.render('components/navbar'))


module.exports = router;
