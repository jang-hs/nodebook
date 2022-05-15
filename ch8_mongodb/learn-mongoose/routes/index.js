const express = require('express');
const User = require('../schemas/user');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const users = await User.find({});// 모든 사용자를 찾음.
    res.render('mongoose', { users });// 랜더링할 때 user변수로 집어넣음
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;