var express = require('express');
var router = express.Router();
var { getUserFromID } = require('../controllers/userController');
var { getUserMessages, getMessageByID, deleteMessageByID } = require('../controllers/messageController');
var { checkToken } = require('../controllers/token');
var { handleMessage, createMessage } = require('../controllers/messageController');
const { createPost } = require('../controllers/postController');

router.get('/messages', function(req,res){

    if(req.session.loggedin == true){
        const data=checkToken(req.session.token,'secret-key-hahahah');
        if(data){
            var userID = data['_doc'].id;
            if(userID){
                getUserMessages(userID).then(function(messages){
                    if(messages && messages.length > 0){
                         
                        for(var messageOne in messages){

                            var message = handleMessage(messages[messageOne]);

                            getUserFromID(message.userFrom).then(async function(user){
                                if(user){
                                    user = await user.username;
                                }
                                return user;
                            }).then(function(username){
                                message['userFromName'] = username;
                            })
                            .then(function(){
                                // if last message
                                if(messageOne == messages.length - 1){
                                    res.render('components/messages', {
                                        username:req.session.username,
                                        isImg: req.session.isImg,
                                        messages
                                    });
                                }
                            });

                        }
                    
                    } else {
                        res.render('components/messages', {
                            username:req.session.username ? req.session.username : undefined,
                            isImg: req.session.isImg,
                            messages:[]
                        });       
                    }
                    
                });
            }        
        } else {
            res.redirect('/login')
        }
    } else {
        res.redirect('/login')
    }
})

router.post('/message/:id', function(req,res){
    
    let sendToID = req.params.id;
    if(sendToID){
        const data=checkToken(req.session.token, 'secret-key-hahahah');
        if(data){
            let senderID = data['_doc'].id;
            let messageText=req.body.message;

            createMessage(senderID, sendToID, messageText, (message) => {
                res.redirect('/')
            });

        } else {

            res.render('messages/sendmessage', {
                username:req.session.username ? req.session.username : undefined,
                isImg: req.session.isImg,
                error:"User Not Found!",
            });

        }
    } else {

        res.render('messages/sendmessage', {
            username:req.session.username ? req.session.username : undefined,
            isImg: req.session.isImg,
            error:"Error Not ID Inserted!",
        });

    }
})


router.post('/reply_message/:id', function(req,res){
    const data=checkToken(req.session.token, 'secret-key-hahahah');
    if(data){
        let userID = data['_doc'].id;
        getMessageByID(userID, req.params.id).then((msg) => {
            if(msg){
                createPost(userID, msg.messageText, req.body.comment, () => {
                    deleteMessageByID(userID, req.params.id, () => {
                        res.redirect('/messages');
                    })
                });
            }
        }).catch((err) => {
            if(err) throw err;
        })
    }
});

module.exports = router;