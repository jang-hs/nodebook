const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const router = express.Router();

router.use((req, res, next) => {
  // 템플린 엔진에서 공통으로 사용하기 위해 local로 설정
  res.locals.user = req.user;
  res.locals.followerCount = 0;
  res.locals.followingCount = 0;
  res.locals.followerIdList = [];
  next();
});
// 자신의 프로필은 로그인해야 볼 수 있으므로 isLoggedIn 미들웨어 사용
router.get('/profile', isLoggedIn, (res, req) => {
  res.render('profile', { title: '내 정보 - NodeBird' });
});
// 로그인하지 않은 사람의 미들웨어는 isNotLoggedIn
router.get('/join', isNotLoggedIn, (req, res) => {
  res.render('join', { title: '회원가입 - Nodebird'});  
});

router.get('/', (req, res, next) => {
  const twits = [];
  res.render('main', {
    title: 'NodeBird',
    twits,
  });
});

module.exports = router;