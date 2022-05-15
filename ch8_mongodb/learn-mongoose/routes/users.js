const express = require('express');
const User = require('../schemas/user');
const Comment = require('../schemas/comment');

const router = express.Router();

router.route('/')
  .get(async (req, res, next) => {
    try {
      // json 형태로 데이터를 반환함.
      const users = await User.find({});
      res.json(users);
    } catch (err) {
      console.error(err);
      next(err);
    }
  })
  .post(async (req, res, next) => {
    try {
      const user = await User.create({
        name: req.body.name,
        age: req.body.age,
        married: req.body.married,
      });
      console.log(user);
      res.status(201).json(user);
    } catch (err) {
      console.error(err);
      next(err);
    }
  });

router.get('/:id/comments', async (req, res, next) => {
  try {
    // 댓글을 쓴 사용자 아이디로 댓글을 조회
    const comments = await Comment.find({ commenter: req.params.id })
      .populate('commenter'); //populate로 관련있는 다큐먼트를 불러올 수 있음.
      console.log("------------")
      res.json(comments);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;