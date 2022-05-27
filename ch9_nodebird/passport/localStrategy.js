const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const User = require('../models/user');

module.exports = () => {
  // 전략에 관한 설정을 하는 곳. 로그인 라우터의 req.body속성명을 usernameField,passwordField 필드에 입력해준다.
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
  }, async (email, password, done) => {
    // 실제 전략 수행 부분 done은 passport.authenticate의 콜백 함수.
    try {
      const exUser = await User.findOne({ where: {email} }); // email이 동일한 사용자가 있는지 확인
      if (exUser) {
        const result = await bcrypt.compare(password, exUser.password); // 비밀번호가 일치하는지 확인
        if (result) {
          done(null, exUser); // 매개변수가 두개이면 로그인 성공한 것.
        } else {
          done(null, false, { message: '비밀번호가 일치하지 않습니다.' }); //authError, user, info
        }
      } else {
        done(null, false, { message: '가입되지 않은 회원입니다.' }); 
      }
    } catch (error) {
      console.error(error); 
      done(error); //authError
    }
  }));
};