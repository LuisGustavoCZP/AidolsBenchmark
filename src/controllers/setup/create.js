import Express from "express";
import { aidolAPI } from "../../clients"
import configs from "../../configs";

/**
 * 
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 */
export async function createSetup (req, res)
{
    const {params, questions = []} = req.body;

    console.log("bot:", params, "\nquestions:", questions);

    const allQuestions = [...questions, ...configs.questions];

    /* const createdBot = await aidolAPI.createBot(configs.botID);
    console.log(createdBot); */

    const createdQuestions = await aidolAPI.createNode(configs.botID, allQuestions);
    console.log(createdQuestions);

    res.status(200).json({messages: [["Setup"]], data: {questions: createdQuestions}});
}