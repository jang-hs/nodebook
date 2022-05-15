const mongoose = require('mongoose');


const connect = () => {
  // 개발 환경일 때만 콘솔을 통해 몽구스가 생성하는 쿼리 내용 확인할 수 있게 함.
  if (process.env.NODE_ENV !== 'production') {
    mongoose.set('debug', true);
  }
  // 몽구스와 몽고디비 연결
  mongoose.connect('mongodb://[id]:[password]@localhost:27017/admin', {
    dbName: 'nodejs',
    // useNewUrlParser: true,
    // useCreateIndex: true,
    // 콜백함수
  }, (error) => {
    if (error) {
      console.log('몽고디비 연결 에러', error);
    } else {
      console.log('몽고디비 연결 성공');
    }
  });
};
// 몽구스 커넥션 에러 발생시 에러 내용 기록하고 연결 종료시 재연결 할 수 있는 이벤트 리스너
mongoose.connection.on('error', (error) => {
  console.error('몽고디비 연결 에러', error);
});
mongoose.connection.on('disconnected', () => {
  console.error('몽고디비 연결이 끊겼습니다. 연결을 재시도합니다.');
  connect();
});

module.exports = connect;