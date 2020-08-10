import express from "express";
import { promises as fs} from "fs";
import winston from "winston";

const {readFile, writeFile} = fs;

const router = express.Router();


//Assignment #1
router.post("/", async(req, res, next) => {
    try{
        let grade = req.body;
        const data = JSON.parse(await readFile(global.fileName));
        grade = {id: data.nextId++, ...grade, timestamp: new Date()};
        data.grades.push(grade);
        await writeFile(global.fileName, JSON.stringify(data, null, 2));
        res.send(data.grades.find(gr => gr.id === grade.id));

        global.logger.info(`POST /grades`);

    }
    catch(err){
        console.log(err);
        next(err);
    }
});

// 2. Crie um endpoint para atualizar uma grade. Este endpoint deverá receber como
// parâmetros o id da grade a ser alterada e os campos student, subject, type e value. O
// endpoint deverá validar se a grade informada existe, caso não exista deverá retornar um
// erro. Caso exista, o endpoint deverá atualizar as informações recebidas por parâmetros
// no registro, e realizar sua atualização com os novos dados alterados no arquivo
// grades.json

router.put("/", async (req, res, next) => {
    try {
        let grade = req.body;
        const data = JSON.parse(await readFile(global.fileName));
        const index = data.grades.findIndex(gr => gr.id === grade.id);
        if (index > -1) {
            data.grades[index] = req.body;
            await writeFile(global.fileName, JSON.stringify(data, null, 2));
            res.send(data.grades[index]);
            global.logger.info(`PUT /grades`);
        }
        else {
            res.send('This id was not found.');
        }
    }
    catch(err){
        next(err);
    }
});

// 3. Crie um endpoint para excluir uma grade. Este endpoint deverá receber como
// parâmetro o id da grade e realizar sua exclusão do arquivo grades.json.
router.delete("/:id", async (req, res, next) => {
    try{
        const data = JSON.parse(await readFile(global.fileName));
        const gradeIndex = data.grades.findIndex(gr => gr.id === parseInt(req.params.id));

        if(gradeIndex > -1){
            data.grades.splice(gradeIndex, 1);
            await writeFile(global.fileName, JSON.stringify(data, null, 2));
            res.send(data);
            res.end();
            global.logger.info(`DELETE /grades/:id`);
        }
        else {
            res.send('This id was not found.');
        }
    }
    catch(err){
        next(err);
    }
});


// 4. Crie um endpoint para consultar uma grade em específico. Este endpoint deverá
// receber como parâmetro o id da grade e retornar suas informações.
router.get("/new/:id", async (req, res, next) => {
    try{
        const data = JSON.parse(await readFile(global.fileName));
        const grade = data.grades.find(grade => grade.id === parseInt(req.params.id));
        res.send(grade);
        global.logger.info(`GET /grades/new/:id`);
    }
    catch(err){
        next(err);
    }
});

// 5. Crie um endpoint para consultar a nota total de um aluno em uma disciplina. O
// endpoint deverá receber como parâmetro o student e o subject, e realizar a soma de
// todas os as notas de atividades correspondentes a aquele subject para aquele student. O
// endpoint deverá retornar a soma da propriedade value dos registros encontrados.
router.get("/average", async (req, res, next) => {
    try {
        const { student, subject } = req.body;
        const data = JSON.parse(await readFile(global.fileName));
        const filteredByName= data.grades.filter(grade => grade.student === student);
        const filteredArr = filteredByName.filter(grade => grade.subject === subject);
        let gradesSum = filteredArr.reduce((accumulator, current) => {
            return accumulator + current.value;
        }, 0);
        res.send(`${gradesSum}`);
    }
    catch (err) {
        next(err);
    }
});

// 6. Crie um endpoint para consultar a média das grades de determinado subject e type. O
// endpoint deverá receber como parâmetro um subject e um type, e retornar a média. A
// média é calculada somando o registro value de todos os registros que possuem o subject
// e type informados, e dividindo pelo total de registros que possuem este mesmo subject e
// type.

router.get("/averageBySubjAndType", async (req, res, next) => {
    try{
        const { subject, type } = req.body;
        const data = JSON.parse(await readFile(global.fileName));
        const filteredBySubj = data.grades.filter(grade => grade.subject === subject);
        const filteredByType = filteredBySubj.filter(grade => grade.type === type);
        
        let sum = filteredByType.reduce((accumulator, current) => {
            return accumulator + current.value;
        }, 0) ;

        let average = sum / filteredByType.length;

        res.send(`${average}`);
    }
    catch(err){
        next(err);
    }
});

//7. Crie um endpoint para retornar as três melhores notas de acordo com determinado
// subject e type. O endpoint deve receber como parâmetro um subject e um type retornar
// um array com os três registros de maior value daquele subject e type. A ordem deve ser
// do maior para o menor.
router.get("/highestGrades", async (req, res) => {
    const { subject, type } = req.body;
    const data = JSON.parse(await readFile(global.fileName));

    const filteredArr = data.grades.filter(grade => grade.subject === subject).filter(grade => grade.type === type);
    filteredArr.sort((a,b) => b .value - a.value);
    res.send(filteredArr.slice(0, 3));

});


router.get("/", async (req, res, next) => {
    try{
        const  data = JSON.parse(await readFile(global.fileName));
        res.send(data.grades);
        global.logger.info(`GET ALL GRADES /grades`);
    }
    catch(err){
        next(err);
    }
});

//Error treatment
router.use((err, req, res, next) => {
    global.logger.error(`${req.method} ${req.baseUrl} - ${err.message}`);
    res.status(400).send({error: err.message});

});



export default router; 