const express = require('express');
const { User, Comment } = require('../models');

const router = express.Router();

// 댓글을 생성하는 라우터
router.post('/', async (req, res, next) => {
  try {
    // 사용자 아이디를 넣어서 사용자와 댓글을 연결함.
    const comment = await Comment.create({
      commenter: req.body.id,
      comment: req.body.comment,
    });
    console.log(comment);
    res.status(201).json(comment);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.route('/:id')
  // 댓글을 수정하는 라우터
  .patch(async (req, res, next) => {
    try {
      const result = await Comment.update({
        comment: req.body.comment,
      }, {
        where: { id: req.params.id },
      });
      res.json(result);
    } catch (err) {
      console.error(err);
      next(err);
    }
  })
  // 댓글을 삭제하는 라우터
  .delete(async (req, res, next) => {
    try {
      const result = await Comment.destroy({ where: { id: req.params.id } });
      res.json(result);
    } catch (err) {
      console.error(err);
      next(err);
    }
  });

  module.exports = router;