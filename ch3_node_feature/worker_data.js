// 여러개의 워커 스레드에 데이터를 넘길 때
const {
    Worker, isMainThread, parentPort, workerData,
} = require('worker_threads');

if (isMainThread){
    const threads = new Set();
    // workerData 속성으로 워커에 데이터 보낼 수 있음.
    threads.add(new Worker(__filename, {
        workerData: { start: 1 },
    }));
    threads.add(new Worker(__filename, {
        workerData: { start: 2 },
    }));
    for (let worker of threads) {
        worker.on('message', message => console.log('from worker', message));
        worker.on('exit', ()=>{
            threads.delete(worker);
            if (threads.size === 0) {
                console.log('job done');
            }
        });
    }
} else { // 워커일때
    const data = workerData; // 데이터 받음.
    parentPort.postMessage(data.start + 100); // 부모로 data.start + 100을 보냄. 
}