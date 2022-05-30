const express = require('express');
const jwt = require('jsonwebtoken');

const { verifyToken } = require('./middlewares');
const { Domain, User } = require('../models');

const router = express.Router();

router.post('/token', async (req, res) => {
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
router.get('/test', verifyToken, (req, res) => {
  res.json(req.decoded);
});

module.exports = router;