const passport = require('passport');
const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const User = require('../models/user');

module.exports = () => {
  // 로그인 시에만 실행됨.
  passport.serializeUser((user, done) => {
    // req.session(세션) 객체에 어떤 데이터를 저장할지 정하는 메서드
    // done 함수의 첫번째 인수는 에러 발생시 사용, 두번째 인수는 저장하고 싶은 데이터를 넣음
    done(null, user.id);
  });
  // 매 요청시 실행됨
  // serializeUser done의 두번째로 넣은 데이터가 deserializeUser의 매개변수가 됨.
  passport.deserializeUser((id, done) => {
    // 사용자 정보를 불러올 때 팔로워와 팔로잉 목록도 같이 불러오게 됨.
    User.findOne({ 
      where: {id},
      include: [{
        model: User,
        attributes: ['id', 'nick'],
        as: 'Followers',
      }, {
        model: User,
        attributes: ['id', 'nick'],
        as: 'Followings'
      }]
    })
      .then(user => done(null, user)) // user는 req.user에 저장
      .catch(err => done(err));
  });
  
  local();
  kakao();
};