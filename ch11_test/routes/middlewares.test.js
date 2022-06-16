const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
// 단위 테스트(유닛 테스트) 작은 단위의 함수나 모듈이 의도한 대로 정확히 작동하는지 테스트
describe('isLoggedIn', () => {
  // 가짜 객체, 가짜 함수를 넣는 행위 - 모킹
  const res = {
    // 함수의 반환값 지정 가능
    status: jest.fn(() => res),
    send: jest.fn(),
  };
  const next = jest.fn()

  test('로그인되어 있으면 isLoggedIn의 next를 호출해야 함.', () => {
    const req = {
      isAuthenticated: jest.fn(() => true),
    };
    isLoggedIn(req, res, next);
    // 정확히 몇 번 호출되었는지 확인.
    expect(next).toBeCalledTimes(1);
  });

  test('로그인되어 있지 않으면 isLoggedIn이 에러를 응답해야 함.', () => {
    const req = {
      isAuthenticated: jest.fn(() => false),
    };
    isLoggedIn(req, res, next);
    // 특정 인수와 함께 호출되었는지 체크
    expect(res.status).toBeCalledWith(403);
    expect(res.send).toBeCalledWith('로그인 필요');

  });
});

describe('isNotLoggedIn', () => {
  const res = {
    redirect: jest.fn(),
  };
  const next = jest.fn();

  test('로그인 되어있으면 isNotLoggedIn이 에러를 응답해야 함', () => {
    const req = {
      isAuthenticated: jest.fn(() => true),
    };
    isNotLoggedIn(req, res, next);
    const message = encodeURIComponent('로그인한 상태입니다.');
    expect(res.redirect).toBeCalledWith(`/?error=${message}`);
  });

  test('로그인 되어있지 않으면 isNotLoggedIn이 next를 호출해야 함', () => {
    const req = {
      isAuthenticated: jest.fn(() => false),
    };
    isNotLoggedIn(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
  });
});