const SocketIO = require('socket.io');

module.exports = (server, app) => {
  const io = SocketIO(server, { path: '/socket.io' });
  // io 객체를 쓸 수 있게 저장해 둠. (req.app.get('io')로 접근 가능)
  app.set('io', io);
  // of 를 사용해서 socket.io에 네임스페이스를 부여함. 같은 네임스페이스끼리만 데이터를 전달함.
  const room = io.of('/room'); // 채팅방 생성 및 삭제에 관한 정보 전달
  const chat = io.of('/chat'); // 채팅 메시지 전달
  // room에 이벤트 리스너 붙임.
  room.on('connection', (socket) => {
    console.log('room 네임스페이스에 접속');
    socket.on('disconnect', () => {
      console.log('room 네임스페이스 접속 해제');
    });
  });
  // chat에 이벤트 리스너 붙임.
  chat.on('connection', (socket) => {
    console.log('chat 네임스페이스에 접속');
    const req = socket.request;
    const { headers: { referer } } = req;
    // 방 아이디 부분을 추출 함. 인수를 roomId로 받아서 같은 roomId 끼리만 데이터를 주고 받을 수 있음.
    const roomId = referer
      .split('/')[referer.split('/').length - 1]
      .replace(/\?.+/, '');
    // 네임스페이스 접속시 socket.join 메서드
    socket.join(roomId);
    // 접속 해제시 leave 메서드
    socket.on('disconnect', () => {
      console.log('chat 네임스페이스 접속 해제');
      socket.leave(roomId);
    });
  });
};

// module.exports = (server) => {
//   const io = SocketIO(server, { path: 'socket.io' });

//   // 웹소켓 연결
//   io.on('connection', (socket) => {
//     const req = socket.request;
//     const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
//     console.log('새로운 클라이언트 접속', ip, socket.id, req.ip);
//     // 연결 종료시
//     socket.on('disconnect', () => {
//       console.log('클라이언트 접속 해제', ip, socket.id);
//       clearInterval(socket.interval);
//     });

//     // 에러 발생시
//     socket.on('error', (error) => {
//       console.error(error);
//     });

//     // 클라이언트로부터 메시지 수신
//     socket.on('reply', (data) => {
//       console.log(data);
//     });

//     // 3초마다 클라이언트로 메시지 전송
//     socket.interval = setInterval(() => {
//       socket.emit('news', 'Hello Socket.IO');
//     }, 3000);
//   });
// }


// const WebSocket = require('ws');

// module.exports = (server) => {
//   const wss = new WebSocket.Server({ server });
//   // 웹소켓 연결
//   wss.on('connection', (ws, req) => {
//     const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
//     console.log('새로운 클라이언트 접속', ip);
//     // 클라이언트로부터 메시지 수신
//     ws.on('message', (message) => {
//       console.log(message);
//     });
//     // 에러 발생시
//     ws.on('error', (error) => {
//       console.error(error);
//     });
//     // 연결 종료시
//     ws.on('close', () => {
//       console.log('클라이언트 접속 해제', ip);
//       clearInterval(ws.interval);
//     });
//     // 3초마다 클라이언트로 메시지 전송
//     ws.interval = setInterval(() => {
//       if (ws.readyState == ws.OPEN) {
//         ws.send('서버에서 클라이언트로 메시지를 보냅니다.');
//       }
//     }, 3000);
//   });
// };