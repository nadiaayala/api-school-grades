import express from "express";
import { promises as fs} from "fs";
import gradesRouter from "./routes/grades.js";

const {readFile, writeFile} = fs;
global.fileName = "grades.json";

const app = express();
app.use(express.json());
app.use("/grades", gradesRouter);






app.listen(3000, async () => {
    const data = JSON.parse(await readFile(global.fileName));
    console.log("API started");
    // console.log(data);
});