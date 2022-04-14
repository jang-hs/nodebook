const {
    Worker, isMainThread, parentPort,
} = require('worker_threads');

// 부모일 때
if (isMainThread) { // isMainThread: 현재 코드가 메인 스레드에서 실행 되는지 워커스레드에서 실행되는지 구분
    const worker = new Worker(__filename); // 현재 파일을 워커 스레드에서 실행시킴. (현재 파일의 else 부분만 실행 됨.)
    worker.on('message', message => console.log('from worker', message)); // 워커로부터 받은 메시지.
    worker.on('exit', () => console.log('worker exit'));
    worker.postMessage('ping'); 
} else { // 워커일 때
    parentPort.on('message', (value) => { // 부모로부터 메시지를 받음. 한번만 받고 싶다면 once('message') 사용.
        console.log('from parent', value);
        parentPort.postMessage('pong'); // 워커에 데이터를 보냄.
        parentPort.close(); // 워커를 종료시킴. 부모와의 연결이 종료 됨. ( 부모의 worker.on('exit')가 실행 됨.)
    });
}