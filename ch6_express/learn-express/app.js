const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config()
const indexRouter = require('./routes'); // index.js는 생략 가능함. ./routes/index.js 와 동일함.
const userRouter = require('./routes/user')

const app = express();
// 포트 세팅
app.set('port', process.env.PORT || 3000);

app.use(morgan('dev'));
app.use('/', express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
  name: 'session-cookie',
}))
app.use('/', indexRouter);
app.use('/user', userRouter);

const multer = require('multer');
const fs = require('fs');
// uploads 폴더 체크
try {
  fs.readdirSync('uploads');
} catch (error) {
  console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
  fs.mkdirSync('uploads');
}
const upload = multer({
  // storage : 어디에(destination) 어떤 이름(filename)으로 저장할 지 설정.
  // destination, filename -> req: 요청 정보, file: 업로드한 파일 정보, done: 함수.
  // req나 file의 데이터를 가공해서 done 으로 넘기는 형식.
  storage: multer.diskStorage({
    // uploads라는 폴더(꼭 있어야함.)에 [파일명 + 현재시간.확장자] 파일명으로 업로드.
    destination(req, file, done) {
      done(null, 'uploads/'); 
    },
    filename(req, file, done) {
      const ext = path.extname(file.originalname);
      done(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  // 파일 사이즈 제한
  limits: { filesize: 5 * 1024 * 1024},
});
app.get('/upload', (req, res) => {
  res.sendFile(path.join(__dirname, 'multipart.html'));
})

// single: multer 설정에 따라 파일 업로드 후 req.file 객체 생성. 여러 파일일 경우 upload.array 사용. 인수는 input 태그의 name이나 폼데이터 키와 일치하게 넣는다. 
// app.post('/upload', upload.single('image'), (req, res) => {
//   console.log(req.file, req.body);
//   res.send('ok');
// })

// input 태그나 폼 데이터의 키 다른 경우.
app.post('/upload', upload.fields([{name: 'image1'}, {name: 'image2'}]), (req, res) => {
  console.log(req.files, req.body);
  res.send('ok');
})

app.use((req, res, next) => {
  console.log('모든 요청에 다 실행됩니다.');
  next();
})
app.get('/', (req, res, next) => {
  console.log('get / 요청에서만 실행 됩니다.');
  next();
}, (req, res) => {
  throw new Error('에러는 에러 처리 미들웨어로 갑니다.')
})
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(err.message);
})

app.use((req, res, next) => {
  res.status(404).send('Not Found');
})

// get 요청에서 작동하는 동작
// app.get('/', (req, res) => {
//   // 텍스트로 보낼 때
//   // res.send('Hello, Express');
//   // html 파일로 보낼 때
//   res.sendFile(path.join(__dirname, '/index.html'))
// });

// 포트 연결, 서버 실행
app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기 중');
})
