import { App } from "./app";
import { Route } from "./routes/routes";

const port = 3080;
const url = `http://localhost:${port}`;
const message = `Server running at url: ${url}`;

const app = new App(new Route());

app.listenner({ port, message });
