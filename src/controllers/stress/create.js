import Express from "express";
import { data } from "../../data";
import { aidolAPI } from "../../clients"
import configs, { uuid } from "../../configs";
import { BigSortedList } from "../../utils";

/**
 * 
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 */
export async function createStress (req, res)
{
    const {requests : total} = req.body;

    console.log(total, req.body);

    const id = uuid();
    let current = 0;

    const results = new Array(Number(total));
    const obj = {
        id,
        status: "starting",
        results,
        startTime: Date.now(),
    };

    data.tests[id] = obj;
    const sortedQuestions = new BigSortedList(configs.questions, total);

    async function test (index)
    {
        const startTime = Date.now();
        const question = sortedQuestions.iteration(index);
        const response = await aidolAPI.getAnswer(configs.botToken, question);
        results[index] = {test: question, value: response, startTime, endTime: Date.now()};
        current++;  
        if(current == total)
        {
            obj.status = "completed";
            obj.endTime = Date.now();
        }
    }

    for (let i = 0; i < total; i++)
    {
        test(i);
    }


    obj.status = "processing";
    
    res.status(200).json({messages: [["Testing", total]], data: obj});
}