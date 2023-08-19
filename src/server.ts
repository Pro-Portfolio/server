import express from "express";
import cors from "cors";
import "dotenv/config";
import morgan from "morgan";
import { errorHandler } from "./middlewares";

const app = express();

app.use(
  cors({
    origin: [
      "http://34.64.245.195:8080",
      "kdt-sw-5-2-team01.elicecoding.com",
      "http://localhost:8080",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const { PORT } = process.env;
app.use(express.static(__dirname));
app.use(
  morgan(
    ":method :url :status :response-time ms - :res[content-length] :date[web]"
  )
);

app.use(errorHandler);

app.listen(PORT, () => console.log(`server is running ${PORT}`));

export { app };