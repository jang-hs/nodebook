const jwt = require('jsonwebtoken');
// Passport에서는 req 객체에 isAuthenticated 메서드를 추가함. 로그인 중이면 isAuthenticated() true
exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(403).send('로그인 필요');
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    const message = encodeURIComponent('로그인한 상태입니다.');
    res.redirect(`/?=error=${message}`);
  }
};

exports.verifyToken = (req, res, next) => {
  try {
    req.decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET); // 요청 헤더에 저장된 토큰 사용해서 토큰 검증함. 토큰, 토큰의 비밀키를 넣음.
    return next(); // 인증이 완료되면 토큰의 내용이 반환됨.
  } catch (error) {
    if (error.name === 'TokenExpiredError') { // 유효기간 초과
      return res.status(419).json({
        code: 419,
        message: '토큰이 만료되었습니다.'
      });
    }
    return res.status(401).json({
      code: 401,
      message: '유효하지 않은 토큰입니다.',
    });
  }
};