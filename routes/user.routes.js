var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
var UserSchema = require('../schemas/user');

var { getUserPosts, handlePost } = require('../controllers/postController');
var { convertTime } = require('../controllers/functions')
var { checkToken } = require('../controllers/token');
var { getUserFromID, updateUploadedImage, updateUser } = require('../controllers/userController');
var uploadImg = require('../controllers/multerConfig');

router.get('/user/:id', function(req,res){

    var userID = req.params.id;
    if(req.session.loggedin){
        const data=checkToken(req.session.token,'secret-key-hahahah');
        if(data){
                var curUserID = data['_doc'].id;
                getUserFromID(userID).then((userToSend) => {
                    if(userToSend){
                        getUserPosts(userID).then(function(posts){
                            for(var post of posts) post=handlePost(post);
                            return posts;
                        }).then(function(posts){
                            res.render('components/profile', {
                                userToSend,
                                posts: posts ? posts : null,
                                same: (userID==curUserID),
                            });
                        });
                    } else {
                        res.render('messages/sendmessage', {
                            username:req.session.username ? req.session.username : undefined,
                            isImg: req.session.isImg,
                            error:"Error Not Found User!",
                        });
                    }
                }); 


        } else {
            res.redirect('/login');
        }
    } else {
        res.redirect('/login');
    }
})

router.get('/user', function(req,res){
    if(req.session.loggedin){
        const data=checkToken(req.session.token,'secret-key-hahahah');
        if(data){
            var userID = data['_doc'].id;   
            res.redirect(`/user/${userID}`);    
        } else {
            res.redirect('/login');
        }
    } else {
        res.redirect('/login');
    }
})


router.get('/settings', function(req,res){
    if(req.session.loggedin){
        const data=checkToken(req.session.token,'secret-key-hahahah');
        if(data){
            var userID = data['_doc'].id;
            getUserFromID(userID).then((userToSend) => {                
                res.render('components/settings', {
                    username:userToSend.username ? userToSend.username : undefined,
                    email: userToSend.email ? userToSend.email: undefined,
                    isImg: userToSend.profile_img ? true : undefined
                });
            });
        }
    } else {
        res.redirect('/login')
    }
});


router.post('/uploadimage', function(req, res){
    const data=checkToken(req.session.token, 'secret-key-hahahah');
    if(data){
        uploadImg(req, res, function(err){
            if(err) throw err;
            updateUploadedImage(data['_doc'].id);
            res.json({
                username:req.session.username,
                success:true
            })
        });
    } else {
        res.sendStatus(403);
    }
});

router.post('/updateuser', function(req, res){
    const data=checkToken(req.session.token, 'secret-key-hahahah');
    if(data){
        let toChange=parseInt(req.body.type);
        updateUser(data['_doc'].id, data['_doc'].username, toChange, req.body.value, req.body.old);
        if(toChange==0) {
            req.session.username = req.body.value;
        } else if(toChange==1){
            req.session.email = req.body.value;
        }
        req.session.destroy();
        res.json({
            success:true
        });
    } else {
        res.sendStatus(403);
    }    
});

module.exports = router;