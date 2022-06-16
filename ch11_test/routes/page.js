const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { Post, User, Hashtag } = require('../models');
const router = express.Router();

router.use((req, res, next) => {
  // 템플린 엔진에서 공통으로 사용하기 위해 local로 설정
  res.locals.user = req.user;
  res.locals.followerCount = req.user ? req.user.Followers.length : 0;
  res.locals.followingCount = req.user ? req.user.Followings.length : 0;
  res.locals.followerIdList = req.user ? req.user.Followings.map(f => f.id) : [];
  next();
});
// 자신의 프로필은 로그인해야 볼 수 있으므로 isLoggedIn 미들웨어 사용
router.get('/profile', isLoggedIn, (req, res) => {
  res.render('profile', { title: '내 정보 - NodeBird' });
});
// 로그인하지 않은 사람의 미들웨어는 isNotLoggedIn
router.get('/join', isNotLoggedIn, (req, res) => {
  res.render('join', { title: '회원가입 - Nodebird'});  
});

router.get('/', async (req, res, next) => {
  try {
    const posts = await Post.findAll({
      include: {
        model : User,
        attributes: ['id', 'nick'],
      },
      order: [['createdAt', 'DESC']]
    });
    res.render('main', {
      title: 'NodeBird',
      twits: posts,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get('/hashtag', async (req, res, next) => {
  const query = req.query.hashtag; // 쿼리스트링으로 해시태그 이름 받음.
  if (!query){
    return res.redirect('/');
  }
  try {
    const hashtag = await Hashtag.findOne({ where: { title: query } });
    let posts = [];
    if (hashtag) {
      // 해시태그가 있으면 모든 게시글을 가져옴.
      posts = await hashtag.getPosts({ include: [{ model: User }] });
    }

    return res.render('main', {
      title: `${query} | NodeBird`,
      twits: posts,
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

module.exports = router;