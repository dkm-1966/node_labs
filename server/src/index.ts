import dotenv from "dotenv";
dotenv.config();
import express from "express";
import profileRouter from "./routes/profileRouter";
import authRouter from "./routes/authRouter";
import cors from "cors";
import feedRouter from "./routes/feedRouter";
import matchRouter from "./routes/matchRouter";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
  })
);

app.use("/api/v1", profileRouter);
app.use("/api/v1", authRouter);
app.use("/api/v1", feedRouter);
app.use("/api/v1", matchRouter);

function startServer() {
  app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
  });
}

startServer();
