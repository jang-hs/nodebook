const SocketIO = require('socket.io')

module.exports = (server) => {
  const io = SocketIO(server, { path: 'socket.io' });

  // 웹소켓 연결
  io.on('connection', (socket) => {
    const req = socket.request;
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log('새로운 클라이언트 접속', ip, socket.id, req.ip);
    // 연결 종료시
    socket.on('disconnect', () => {
      console.log('클라이언트 접속 해제', ip, socket.id);
      clearInterval(socket.interval);
    });

    // 에러 발생시
    socket.on('error', (error) => {
      console.error(error);
    });

    // 클라이언트로부터 메시지 수신
    socket.on('reply', (data) => {
      console.log(data);
    });

    // 3초마다 클라이언트로 메시지 전송
    socket.interval = setInterval(() => {
      socket.emit('news', 'Hello Socket.IO');
    }, 3000);
  });
}


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