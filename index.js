import express from "express";
import { promises as fs} from "fs";
import gradesRouter from "./routes/grades.js";
import winston from "winston";
import cors from "cors";

const {readFile, writeFile} = fs;
global.fileName = "grades.json";
const {combine, timestamp, label, printf} = winston.format;
const myFormat = printf(({level, message, label, timestamp}) => {
    return `${timestamp} [${label}] ${level} : ${message}`;
});


global.logger = winston.createLogger({
    level: "silly",
    transports: [
        new (winston.transports.Console)(),
        new(winston.transports.File)({filename: "challenge-module-2.log"})
    ],
    format:  combine(
        label({label: "challenge-module-2"}),
        timestamp(),
        myFormat
    )
});

const app = express();
app.use(express.json());

app.use(express.static("public"));
app.use(cors());
app.use("/grades", gradesRouter);






app.listen(3000, async () => {
    const data = JSON.parse(await readFile(global.fileName));
    logger.info("API started");
    // console.log(data);
});