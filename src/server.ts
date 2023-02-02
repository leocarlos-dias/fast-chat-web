import { server } from "./app";
import "./websocket";

server.listen(3333, () => {
  console.log('listening on *:3333');
});