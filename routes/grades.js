import express from "express";
import { promises as fs} from "fs";

const {readFile, writeFile} = fs;

const router = express.Router();

//Assignment #1
router.post("/", async(req, res) => {
    try{
        let grade = req.body;
        const data = JSON.parse(await readFile(global.fileName));
        grade = {id: data.nextId++, ...grade, timestamp: new Date()};
        data.grades.push(grade);
        await writeFile(global.fileName, JSON.stringify(data, null, 2));
        res.send(data.grades.find(gr => gr.id === grade.id));

    }
    catch(err){
        res.status(400).send({error: err.message});
    }
});

// 2. Crie um endpoint para atualizar uma grade. Este endpoint deverá receber como
// parâmetros o id da grade a ser alterada e os campos student, subject, type e value. O
// endpoint deverá validar se a grade informada existe, caso não exista deverá retornar um
// erro. Caso exista, o endpoint deverá atualizar as informações recebidas por parâmetros
// no registro, e realizar sua atualização com os novos dados alterados no arquivo
// grades.json

router.put("/", async (req, res) => {
    try {
        let grade = req.body;
        const data = JSON.parse(await readFile(global.fileName));
        const index = data.grades.findIndex(gr => gr.id === grade.id);
        if (index > -1) {
            data.grades[index] = req.body;
            await writeFile(global.fileName, JSON.stringify(data, null, 2));
            res.send(data.grades[index]);
        }
        else {
            res.send('This id was not found.');
        }
    }
    catch(err){
        res.status(400).send({error: err.message});
    }
});

// 3. Crie um endpoint para excluir uma grade. Este endpoint deverá receber como
// parâmetro o id da grade e realizar sua exclusão do arquivo grades.json.
router.delete("/:id", async (req, res) => {
    try{
        const data = JSON.parse(await readFile(global.fileName));
        const gradeIndex = data.grades.findIndex(gr => gr.id === parseInt(req.params.id));

        if(gradeIndex > -1){
            data.grades.splice(gradeIndex, 1);
            await writeFile(global.fileName, JSON.stringify(data, null, 2));
            res.send(data);
            res.end();
        }
        else {
            res.send('This id was not found.');
        }
    }
    catch(err){
        res.status(400).send({ error: err.message});
    }
});


// 4. Crie um endpoint para consultar uma grade em específico. Este endpoint deverá
// receber como parâmetro o id da grade e retornar suas informações.
router.get("/:id", async (req, res) => {
    try{
        const  data = JSON.parse(await readFile(global.fileName));
        const grade = data.grades.find(grade => grade.id === parseInt(req.params.id));
        res.send(grade);
    }
    catch(err){
        res.status(400).send({ error: err.message});
    }
});

// 5. Crie um endpoint para consultar a nota total de um aluno em uma disciplina. O
// endpoint deverá receber como parâmetro o student e o subject, e realizar a soma de
// todas os as notas de atividades correspondentes a aquele subject para aquele student. O
// endpoint deverá retornar a soma da propriedade value dos registros encontrados.

export default router; 