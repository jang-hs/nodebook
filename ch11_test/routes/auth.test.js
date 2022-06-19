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
// 회원가입 테스트
describe('POST /join', () => {
  test('로그인 안 했으면 가입', (done) => {
    request(app)
      .post('/auth/join')
      .send({
        email: 'test@naver.com',
        nick: 'test',
        password: 'test',
      })
      .expect('Location', '/')
      .expect(302, done);
  });

  const agent = request.agent(app); // agent를 만들어서 재사용 가능함.
  // 로그인한 상태로 미리 만들어둠.
  beforeEach((done) => {
    agent
      .post('/auth/login')
      .send({
        email: 'test@naver.com',
        password: 'test',
      })
      .end(done); // beforeEach의 종료를 알려주어야 함.
  });

  test('로그인했으면 redirect /', (done) => {
    const message = encodeURIComponent('로그인한 상태입니다.');
    agent
      .post('/auth/join')
      .send({
        email: 'test@naver.com',
        password: 'test',
      })
      .expect('Location', `/?error=${message}`)
      .expect(302, done);
  });
});

describe('POST /login', () => {
  test('로그인 수행', (done) => {
    request(app)
      .post('/auth/login')
      .send({
        email: 'test@naver.com',
        password: 'test',
      })
      .expect('Location', '/')
      .expect(302, done);
  });

  test('가입되지 않은 회원', (done) => {
    const message = encodeURIComponent('가입되지 않은 회원입니다.');
    request(app)
      .post('/auth/login')
      .send({
        email: 'test2@naver.com',
        password: 'test',
      })
      .expect('Location', `/?loginError=${message}`)
      .expect(302, done);
  });

  test('비밀번호 틀림', (done) => {
    const message = encodeURIComponent('비밀번호가 일치하지 않습니다.');
    request(app)
      .post('/auth/login')
      .send({
        email: 'test@naver.com',
        password: 'wrong',
      })
      .expect('Location', `/?loginError=${message}`)
      .expect(302, done);
  });
});

describe('GET /logout', () => {
  test('로그인 되어있지 않으면 403', (done) => {
    request(app)
      .get('/auth/logout')
      .expect(403, done);
  });

  const agent = request.agent(app);
  beforeEach((done) => {
    agent
      .post('/auth/login')
      .send({
        email: 'test@naver.com',
        password: 'test',
      })
      .end(done);
  });

  test('로그아웃 수행', (done) => {
    const message = encodeURIComponent('비밀번호가 일치하지 않습니다.');
    agent
      .get('/auth/logout')
      .expect('Location', `/`)
      .expect(302, done);
  });
});

afterAll(async ()=> {
  await sequelize.sync({ force: true})
})

