const express = require('express');
const User = require('../models/users');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    // 모든 사용자를 찾음
    const users = await User.findAll();
    // sequelize를 렌더링할 때 결과값인 user 를 넣음.
    res.render('sequelize', { users });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;