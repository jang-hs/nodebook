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

const session = {};

// 개념상 사용하는 코드. 보안상으로는 취약하다.
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
    const uniqueInt = Date.now();
    session[uniqueInt] = {
      name,
      expires
    };
    res.writeHead(302, {
      Location : '/', //리다이렉트 주소와 함께 쿠키를 헤더에 넣음. Set-Cookie값으로는 제한된 ASCII 코드만 들어가야하므로 줄바꿈 넣으면 안됨.
      'Set-Cookie': `session=${uniqueInt}; Expires=${expires.toGMTString()}; HttpOnly; Path=/`,
      // 쿠키에 uniqueInt 숫자 값 보냄. 세션 아이디를 주고 받는 식으로 사용 => 이런 식 으로 사용 하는 쿠키를 세션 쿠키라고 함.
    });
    res.end();
  
    // 세션 쿠키가 존재하고, 만료 기한이 지나지 않으면.
  } else if (cookie.session && session[cookies.session].expires > new Date()) {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(`${session[cookies.session].name}님 안녕하세요.`)
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
