const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const url = require('url');

const { verifyToken, apiLimiter } = require('./middlewares');
const { Domain, User, Post, Hashtag } = require('../models');

const router = express.Router();

router.use(async (req, res, next) => {
  // 도메인과 일치하는 것이 있는지 확인
  const domain = await Domain.findOne({
    where: { host: url.parse(req.get('origin')).host },
  });
  if (domain) {
    cors({
      origin: req.get('origin'), // 허용할 도메인 속성 기입
      credentials: true, // 쿠키 공유
    })(req, res, next);
  } else {
    next();
  }
});

router.post('/token',apiLimiter, async (req, res) => {
  const { clientSecret } = req.body;
  try {
    // 전달받은 클라이언트 비밀 키로 도메인이 등록되어 있는지 먼저 확인함.
    const domain = await Domain.findOne({
      where: { clientSecret },
      include: {
        model: User,
        attributes: ['nick', 'id'],
      },
    });
    if (!domain) {
      return res.status(401).json({
        code: 401,
        message: '등록되지 않은 도메인입니다. 먼저 도메인을 등록하세요.',
      });
    }
    // 토큰 발급 (등록된 도메인) sign의 인수: 토큰의 내용, 토큰의 비밀키, 토큰의 설정
    const token = jwt.sign({
      id: domain.User.id,
      nick: domain.User.nick,
    }, process.env.JWT_SECRET, {
      expiresIn: '1m', // 1min
      issuer: 'nodebird',
    });
    return res.json({
      code: 200,
      message: '토큰이 발급되었습니다',
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: '서버 에러',
    });
  }
});
// 토큰 테스트하는 라우터. 토큰 검증 미들웨어 거친 후 검증 성공하면 토큰 내용물 응답함.
router.get('/test', verifyToken, apiLimiter, (req, res) => {
  res.json(req.decoded);
});

// 내가 올린 포스트를 가져오는 라우터
router.get('/posts/my', verifyToken, apiLimiter, (req, res) => {
  Post.findAll({ where: { userId: req.decoded.id } })
      .then((posts) => {
        console.log(posts);
        res.json({
          code: 200,
          payload: posts,
        });
      })
      .catch((error) => {
        console.error(error);
        return res.status(500).json({
          code: 500,
          message: '서버 에러',
        });
      });
});

// 해시태그 검색 결과 라우터
router.get('/posts/hashtag/:title', verifyToken, async (req, res) => {
  try {
    const hashtag = await Hashtag.findOne({ where: { title: req.params.title } });
    if (!hashtag) {
      return res.status(404).json({
        code: 404,
        message: '검색 결과가 없습니다',
      });
    }
    const posts = await hashtag.getPosts();
    return res.json({
      code: 200,
      payload: posts,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: '서버 에러',
    });
  }
});

module.exports = router;