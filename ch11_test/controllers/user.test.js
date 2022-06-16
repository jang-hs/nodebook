jest.mock('../models/user'); // 모킹할 모듈의 경로를 인수로 넣음
const User = require('../models/user');
const { addFollowing } = require('../controllers/user');

describe('addFollowing', () => {
  const req = {
    user: { id: 1 },
    params: { id: 2 },
  };
  const res = {
    send: jest.fn(),
  };
  const next = jest.fn();

  test('사용자를 찾아 팔로잉을 추가하고 success를 응답해야 함', async () => {
    // mockReturnValue는 User.findOne가 함수 안의 인수를 리턴하도록 지정함.
    User.findOne.mockReturnValue(Promise.resolve({
      addFollowing(id) {
        return Promise.resolve(true);
      }
    }));
    await addFollowing(req, res, next);
    expect(res.send).toBeCalledWith('success');
  });

  test('사용자를 못 찾으면 next(error)를 호출함', async () => {
    const error = '사용자 못 찾음';
    User.findOne.mockReturnValue(Promise.reject(error));
    await addFollowing(req, res, next);
    expect(next).toBeCalledWith(error);
  });
});