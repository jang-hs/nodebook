const request = require('supertest');
const { sequelize } = require('../models');
const app = require('../app');
// supertest를 사용하면 app.listen 수행하지 않고도 서버 라우터 실행 가능.

// 현재 테스트를 실행하기 전에 수행 됨
beforeAll(async () => {
  // 테이블 생성
  await sequelize.sync();
})
// afterAll => 모든 테스트가 끝난 후, beforeEach => 각각 테스트 수행 전, afterEach => 각각 테스트 수행 후

describe('POST /login', () => {
  test('로그인 수행', async (done) => {
    // supertest request에 app 객체를 넣으면 get, post 등 메서드로 원하는 라우터에 요청 보낼 수 있음.
    request(app)
      .post('/auth/login')
      // 요청 보낼 때 send 메서드에 데이터를 담아서 보냄.
      .send({
        email: 'test@naver.com',
        password: 'test'
      })
      .expect('Location', '/')
      .expect(302, done);
  });
});