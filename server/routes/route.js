const express = require('express');
const router = express.Router();
let userstatus = 'helllllo';
const user = require('../models/user');
const post = require('../models/post');
const comments = require('../models/comment');
const likes = require('../models/likes');
const group = require('../models/groups');
var Pusher = require('pusher');

var pusher = new Pusher({
    appId: 'APP_ID',
    key: 'APP_KEY',
    secret: 'APP_SECRET',
    cluster: 'APP_CLUSTER'
});
//retriving user data
// {
//     let newuser = new user({
//         username: 'admin',
//         password: 'admin',
//         firstname: 'admin',
//         lastname: 'admin',
//         token: 'abcde'
//     });
//     newuser.save((err, newuser) => {
//         if (err) {
//             res.json({ msg: 'Failed to add User' });

//         } else {
//             res.json({ msg: 'User added Successfully' });
//         }
//     })
// }
router.post('/user', (req, res, next) => {
    user.find({ username: req.body.username, password: req.body.password }, function(err, users) {
        if (users.length == 0) {
            res.json('Username or Password Incorrect..!!');
        } else {
            res.json(users);

        }
    })
});
router.get('/groups', (req, res, next) => {
    group.find(function(err, group) {
        if (err) {
            res.json('Error finding Group!!');

        } else {
            res.json(group);
        }
    });
});
router.get('/groups/:id', (req, res, next) => {
    group.find({ _id: req.params.id }, function(err, group) {
        if (err) {
            res.json('Error finding Group!!');

        } else {
            res.json(group);
        }
    });
});
router.post('/groups', (req, res, next) => {
    let newgroup = new group({
        userid: req.body.userid,
        username: req.body.username,
        groupname: req.body.groupname
    });
    newgroup.save((err, group) => {
        if (err) {
            res.json({ msg: 'Failed to add group' });

        } else {
            res.json({ msg: 'Group added Successfully' });
        }
    });
});
router.get('/user/:id', (req, res, next) => {
    user.find({ _id: req.params.id }, function(err, user) {
        if (err) {
            res.json('Error finding user!!');

        } else {
            res.json(user);
        }
    });
});
router.get('/allusers', (req, res, next) => {
    user.find(function(err, user) {
        if (err) {
            res.json('Error finding user!!');

        } else {
            res.json(user);
        }
    });
});
router.post('/post', (req, res, next) => {
    let newpost = new post({
        userid: req.body.userid,
        username: req.body.username,
        post: req.body.post,
        likes: req.body.likes
    });
    newpost.save((err, post) => {
        if (err) {
            res.json({ msg: 'Failed to add Post' });

        } else {
            pusher.trigger('my-channel', 'my-event', { "message": "hello world" });
            res.json({ msg: 'Post added Successfully' });
        }
    });
});
router.put('/user/:id', (req, res, next) => {
    user.findById(req.params.id, function(err, user) {

        if (err)
            res.send(err);
        user.status = req.body.status; // update the bears info

        // save the bear
        user.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: user });
        });

    });
});
router.put('/post/:postid', (req, res, next) => {
    post.findById(req.params.postid, function(err, post) {

        if (err)
            res.send(err);

        post.likes = req.body.likes; // update the bears info

        // save the bear
        post.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Post updated!' });
        });

    });
});
router.get('/post', (req, res, next) => {
    post.find(function(err, post) {
        if (err) {
            res.json('Error finding post!!');

        } else {
            res.json(post);
        }
    });
});
router.get('/posts/:postid', (req, res, next) => {
    post.find({ _id: req.params.postid }, function(err, post) {
        if (err) {
            res.json('Error finding post!!');

        } else {
            res.json(post);
        }
    });
});
router.delete('/post/:id', (req, res, next) => {

    post.remove({ _id: req.params.id }, function(err, result) {
        if (err) {
            res.json(err);
        } else {
            res.json(result);
        }
    });
});
router.get('/mypost/:userid', (req, res, next) => {
    post.find({ userid: req.params.userid }, function(err, post) {
        if (err) {
            res.json('Error finding post!!');

        } else {
            res.json(post);
        }
    });
});

router.post('/comments', (req, res, next) => {
    let newcomment = new comments({
        userid: req.body.userid,
        username: req.body.username,
        postid: req.body.postid,
        comment: req.body.comment
    });
    newcomment.save((err, comment) => {
        if (err) {
            res.json(err);

        } else {
            res.json({ msg: 'Comment added Successfully' });
        }
    });
});


router.get('/comments', (req, res, next) => {
    comments.find(function(err, comment) {
        if (err) {
            res.json('Error finding comment!!');

        } else {
            res.json(comment);
        }
    });
});
router.delete('/comments/:id', (req, res, next) => {

    comments.remove({ _id: req.params.id }, function(err, result) {
        if (err) {
            res.json(err);
        } else {
            res.json(result);
        }
    });
});
router.delete('/comment/:id', (req, res, next) => {

    comments.remove({ postid: req.params.id }, function(err, result) {
        if (err) {
            res.json(err);
        } else {
            res.json(result);
        }
    });
});

router.get('/likes', (req, res, next) => {
    likes.find(function(err, likes) {
        if (err) {
            res.json('Error finding likes!!');

        } else {
            res.json(likes);
        }
    });
});
router.post('/likes', (req, res, next) => {
    let newlikes = new likes({
        userid: req.body.userid,
        username: req.body.username,
        postid: req.body.postid,
        status: req.body.status
    });
    newlikes.save((err, comment) => {
        if (err) {
            res.json({ msg: 'Failed to add likes' });

        } else {
            res.json({ msg: 'like added Successfully' });
        }
    });
});
router.delete('/likes/:id', (req, res, next) => {

    likes.remove({ userid: req.params.id }, function(err, result) {
        if (err) {
            res.json(err);
        } else {
            res.json(result);
        }
    });
});
module.exports = router;