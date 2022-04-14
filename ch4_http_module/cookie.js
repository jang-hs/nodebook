const http = require('http');

http.createServer((req, res) => {
  console.log(req.url, req.headers.cookie);
  res.writeHead(200, { 'Set-Cookie' : 'mycookie=test' }); // mycoockie = test 라는 쿠키를 심으라고 브라우저에게 명령(Set-Cookie)
  res.end('Hello Cookie');
})
  .listen(8083, () => {
    console.log('8083  포트에서 서버 대기 중')
  })