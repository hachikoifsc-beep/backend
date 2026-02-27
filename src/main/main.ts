import { createServer } from "node:http";

import app from "./infra/http/app";


const srv = createServer(app);

srv.once("listening", onListening);
srv.once("error", rejectError);


async function onListening(): Promise<void> {
  srv.off("error", rejectError);
}

function rejectError(err: Error): void {
  console.error(err);
  process.exitCode = 1;
}


if(
  !process.env.VERCEL_ENV &&
  process.env.NODE_ENV !== "production"
) {
  srv.listen(1000, "127.0.0.1");
}

export default srv;
