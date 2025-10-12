/* CLUSTERING
1. Node.js runs on a single thread, meaning only one CPU core is used by default.
2. The Cluster module allows you to fork multiple worker processes (child processes) that all share the same server port.
3. Each worker process runs its own event loop and memory space, but they communicate with the master process via 
IPC (inter-process communication) channels.
4. The master process uses cluster.fork() to create multiple workers (using child_process.fork() internally).
5. The master listens on the server port and uses a round-robin algorithm to distribute incoming connections to 
the workers (on Linux and macOS; Windows behaves differently).
6. Each worker handles its own requests independently, allowing parallelism across CPU cores.
7. If a worker crashes, the master can spawn a new one automatically.
                 ┌───────────────────────────────┐
                 │ Primary Process (PID 1000)     │
                 │ cluster.isPrimary = true       │
                 │                               │
                 │ → cluster.fork() x 8 (workers) │
                 │ → Monitors, restarts workers   │
                 └─────────────┬─────────────────┘
                               │
 ┌─────────────────────────────┼─────────────────────────────┐
 │                             │                             │
 ▼                             ▼                             ▼
[Worker 1 (PID 1001)]   [Worker 2 (PID 1002)]        ... [Worker 8 (PID 1008)]
cluster.isPrimary = false
↓
createServer()
↓
HTTP server listens on port 3000
↓
Can spawn Worker Threads for CPU work
*/
import cluster from "cluster";
import os from "os";
import http from "http";
import { Worker } from "worker_threads";

const numCPUs = os.cpus().length;
function createWorkerThread(workerData) {
  return new Promise((resolve, reject) => {
    const worker = new Worker("./worker-task.js", { workerData });

    worker.on("message", resolve);
    worker.on("error", reject);
    worker.on("exit", (code) => {
      if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`));
    });
  });
}

// Starts HTTP server in worker process.
function createServer() {
  const server = http.createServer(async (req, res) => {
    if (req.url === "/") {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end(`Hello from Worker ${process.pid}\n`);
    } else if (req.url.startsWith("/compute")) {
      try {
        const result = await createWorkerThread({ n: 40 });
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end(`Fibonacci(40) = ${result} | by Worker ${process.pid}\n`);
      } catch (err) {
        res.writeHead(500);
        res.end(`Error: ${err.message}`);
      }
    } else {
      res.writeHead(404);
      res.end("Not Found");
    }
  });

  server.listen(3000, () => {
    console.log(`Worker ${process.pid} is listening on port 3000`);
  });
}

// Sets up clustering (1 master + N workers)
function setupCluster() {
  if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running`);
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    cluster.on("exit", (worker) => {
      console.log(`Worker ${worker.process.pid} died. Restarting...`);
      cluster.fork();
    });
  } else {
    createServer();
  }
}

setupCluster();
