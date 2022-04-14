const http = require('http');
const fs = require('fs').promises;
const url = require('url');
const qs = require('querystring');

// 쿠키를 사용하기 쉽게 자바스크립트 객체 형식으로 바꿈.
const parseCookies = (cookie = '') => {
  cookie
    .split(';')
    .map(v => v.split('='))
    .reduce((acc, [k,v]) => {
      acc[k.trim()] = decodeURIComponent(v);
      return acc;
    }, {});
}

http.createServer(async (req, res) => {
  const cookies = parseCookies(req.headers.cookie);

  // 주소가 /login으로 시작하는 경우
  if (req.url.startsWith('/login')) {
    // 각각 주소와 주소에 딸려오는 query 분석.
    const { query } = url.parse(req.url); 
    const { name } = qs.parse(query);
    const expires = new Date();
    // 쿠키 유효 시간(만료 시간)을 현재 시간 + 5분으로 설정
    expires.setMinutes(expires.getMinutes() + 5);
    res.writeHead(302, {
      Location : '/', //리다이렉트 주소와 함께 쿠키를 헤더에 넣음. Set-Cookie값으로는 제한된 ASCII 코드만 들어가야하므로 줄바꿈 넣으면 안됨.
      'Set-Cookie': `name=${encodeURIComponent(name)}; Expires=${expires.toGMTString()}; HttpOnly; Path=/`,
    });
    res.end();
  
  // name 이라는 쿠키가 있는 경우 (로그인 한 것으로 간주함.)
  } else if (cookie.name) {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(`${cookies.name}님 안녕하세요.`)
  } else {
    try {
      // 쿠키가 없을 때에는 로그인 할 수 있는 페이지를 보냄.
      const data = await fs.readFile('./cookie2.html');
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(data);
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(err.message);
    }
  }
})
