import { createServer } from "node:http";

class IterableServer {
  #server = createServer().listen(8000, () =>
    console.log("listing on http://localhost:8000")
  );

  async *[Symbol.asyncIterator]() {
    while (true) {
      this.#server.once("request", (req, res) => resolve({ req, res }));
      const { resolve, rejected, promise } = this.#getPromise();
      yield await promise;
    }
  }

  close() {
    this.#server.close();
    console.log("server closed");
  }

  #getPromise() {
    let resolve, rejected;
    const promise = new Promise((res, rej) => {
      resolve = res;
      rejected = rej;
    });

    return {
      resolve,
      rejected,
      promise,
    };
  }
}

const myServer = new IterableServer();

let i = 0;
for await (const { req, res } of myServer) {
  res.end("hello wrold " + i);
  i++;
}
