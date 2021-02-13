const User = require('../models/User')
const Comment = require('../models/Comment')
const Post = require('../models/Post')

module.exports = {
  get_profile: (req, res) => {
    User.findById(req.body.id, '-password', (err, user) => {
      if (!user) {
        return res.json({ error: 'User not found' })
      }
      return res.json({ user })
    })
  },
  get_posts: (req, res) => {
    Post.find({ author: req.body.id })
      .sort({ createdAt: -1 })
      .populate('author', 'image fullName _id')
      .then((posts) => res.json({ posts }))
  },
  get_follow: (req, res) => {
    const { _id, type } = req.params
    if (!['followers', 'following'].includes(type.toLowerCase())) {
      return res.sendStatus(400)
    }
    User.findById(_id)
      .select(type.toLowerCase())
      .populate(type.toLowerCase(), 'fullName country image _id')
      .lean()
      .then((users) => {
        console.log(users)
        res.json({ result: users[type.toLowerCase()] })
      })
  },
  create_post: (req, res) => {
    const { body } = req.body
    Post.create({
      body: body.slice(0, 350),
      author: req.userId,
      likes: [],
    }).then((post) => {
      res.json({ created_post: post })
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
      .then((post) => res.json({ post }))
  },
  search_users: (req, res) => {
    const { q } = req.query
    let regexp = new RegExp(q, 'gi')
    User.find({
      $or: [{ fullName: regexp }, { country: regexp }],
    })
      .select('_id fullName country image')
      .then((users) => {
        res.json({ users })
      })
  },

  change_follow: (req, res) => {
    const { _id, type } = req.body
    if (!req.userId.equals(_id)) {
      const update1 =
        type === 'follow'
          ? {
              $addToSet: { following: _id },
            }
          : { $pull: { following: _id } }
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
        User.findByIdAndUpdate(_id, update2, { new: true }),
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
        .sort({ createdAt: -1 })
        .populate('author', 'image fullName _id')
        .select('-updatedAt -__v')
        .then((posts) => {
          res.json({ posts })
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
      User.findByIdAndUpdate(req.userId, { $set: newUser }).then((_user) => {
        return res.json({ success: 'Details updated successfully.' })
      })
    }
  },
  delete_post: (req, res) => {
    const id = req.body.id
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
        )
          .populate('author', 'image fullName _id')
          .then((post) =>
            res.json({ success: 'Post Updated Successfully', post })
          )
      }
    })
  },
  load_comments: (req, res) => {
    Comment.find({ postId: req.body.postId })
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
    if (req.userId.equals(req.body.authorId)) {
      Comment.findByIdAndDelete(req.body.commentId).then(() => {
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
