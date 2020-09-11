const User = require('../models/User')
const Comment = require('../models/Comment')
const Post = require('../models/Post')
const ObjectId = require('mongoose').Types.ObjectId

module.exports = {
  get_profile: (req, res) => {
    User.findById(req.body.id, '-password', (err, user) => {
      res.json({ user })
    })
  },
  get_posts: (req, res) => {
    // Post.find({ author: ObjectId(req.body.id) }, (err, posts) => {
    // 	res.json({ posts })
    // })
    Post.find({ author: ObjectId(req.body.id) })
      .populate('author', 'image fullName _id')
      .exec((err, posts) => {
        res.json({ posts })
      })
  },
  get_follow: (req, res) => {
    const { id, follow } = req.params
    User.findById(ObjectId(id), (err, user) => {
      User.find({ _id: { $in: user[follow] } }).then((result) => {
        res.json({
          result: result.map((f) => ({
            fullName: f.fullName,
            image: f.image,
            country: f.country,
            _id: f._id,
          })),
        })
      })
    })
  },
  create_post: (req, res) => {
    const { body } = req.body
    User.findById(req.userId, (err, user) => {
      Post.create({
        body: body.slice(0, 300),
        author: req.userId,
        likes: [],
      }).then((post) => {
        res.json({ created_post: post })
      })
    })
  },
  change_post_like: (req, res) => {
    const { postId, type } = req.body
    let updates = {}
    if (type === 'like') {
      updates = {
        $addToSet: { likes: req.userEmail },
      }
    } else if (type === 'unlike') {
      updates = {
        $pull: { likes: req.userEmail },
      }
    }
    Post.findByIdAndUpdate(postId, updates, { new: true })
      .populate('author')
      .exec((err, post) => {
        if (err) throw err
        return res.json({ post })
      })
  },
  search_users: (req, res) => {
    const query = req.params.query.replace(/\+/gi, ' ')
    let regexp = new RegExp(query, 'gi')
    User.find({ fullName: { $regex: regexp } })
      .then((users) => res.json({ users }))
      .catch((err) => console.log(err))
  },
  change_follow: (req, res) => {
    const id = ObjectId(req.params.id)
    const { type } = req.params
    if (!req.userId.equals(id)) {
      const update1 =
        type === 'follow'
          ? {
              $addToSet: { following: id },
            }
          : { $pull: { following: id } }
      const update2 =
        type === 'follow'
          ? {
              $addToSet: { followers: req.userId },
            }
          : {
              $pull: { followers: req.userId },
            }

      Promise.all([
        User.findByIdAndUpdate(req.userId, update1, { new: true }),
        User.findByIdAndUpdate(id, update2, { new: true }),
      ]).then((result) => {
        res.json({
          followers: result[1].followers,
          following: result[0].following,
        })
      })
    } else {
      return res.json({ error: "You can't follow yourself :D" })
    }
  },
  get_home: (req, res) => {
    User.findById(req.userId).then((user) => {
      Post.find({ author: { $in: user.following } })
        .populate('author')
        .exec((err, posts) => {
          return res.json({ posts })
        })
    })
  },
  update_details: (req, res) => {
    const { fullName, bio, country } = req.body
    if (!fullName || !country) {
      return res.json({ errors: ['Fullname and country are required fields'] })
    } else {
      const newUser = {
        fullName,
        country,
        bio: bio ? bio.slice(0, 120) : 'No information given.',
      }
      User.findByIdAndUpdate(req.userId, { $set: newUser }).then((user) => {
        return res.json({ success: 'Details updated successfully.' })
      })
    }
  },
  delete_post: (req, res) => {
    const id = ObjectId(req.body.id)
    Post.findById(id, (err, post) => {
      if (post.author.equals(req.userId)) {
        Post.findByIdAndDelete(id).then(() => {
          res.json({ success: 'Post Deleted Successfully' })
        })
      }
    })
  },
  update_post: (req, res) => {
    Post.findById(req.body.postId, (err, post) => {
      if (post.author.equals(req.userId)) {
        Post.findByIdAndUpdate(
          req.body.postId,
          {
            $set: { body: req.body.body },
          },
          { new: true }
        ).then((post) => {
          res.json({ success: 'Post Updated Successfully', post })
        })
      }
    })
  },
  load_comments: (req, res) => {
    Comment.find({ postId: ObjectId(req.body.postId) })
      .populate('author', 'image fullName _id')
      .then((comments) => {
        res.json({ comments: comments })
      })
  },
  add_comment: (req, res) => {
    const comment = new Comment({
      postId: req.body.postId,
      author: req.userId,
      body: req.body.body,
      likes: [],
    })
    comment.save().then((comment) => {
      Comment.populate(comment, { path: 'author' }, (err, c) => {
        res.json({ comment: c })
      })
    })
  },
  delete_comment: (req, res) => {
    if (req.userId.equals(ObjectId(req.body.authorId))) {
      Comment.findByIdAndDelete(ObjectId(req.body.commentId)).then(() => {
        res.json({ success: 'Comment Deleted Successfully' })
      })
    }
  },
}

// notify
// follow, unfollow, post created, deleted, updated, profile updated

// followers.js and following.js
// change button to follow (+) instead of (x)

//post
// images in post
// share
// comments
// comment likes
// delete comment

// profile
// cloudinary
// update details

// delete profile => delete all posts => delete all comments
