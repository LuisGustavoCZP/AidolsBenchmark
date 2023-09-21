/* import FormData from "form-data"; */
import { API } from "./api";
import configs from "../configs";

const url = configs.serverUrl;

/**
 * Class used to connect with ElevenlabsAPI
 * @extends API
 */
export class AidolAPI extends API
{
    constructor ()
    {
        super(url);
    }

    /**
     * 
     * @param {{[key: string]:any}} query 
     * @returns 
     */
    queryStringfy(query) {
        if (!query) return "";
        return `?${Object.entries(query).map(([key, value]) => `${key}=${value}`).join("&")}`;
    }

    /**
     * Create a new bot param
     * @param {{question_conflict: number, question_accept: number, optimize: number}} params
     * @param {number} bot_id
     * @returns {Promise<{status:number, data:{voices:Array}, text:string}>}
     */
    async createBot (bot_id, params = {question_conflict: 0.98, question_accept: 0.68, optimize: 0})
    {
        const headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
        };

        const requestIni = {
            method: "PUT",
            headers,
            body: JSON.stringify({
                "botkey": bot_id,
                "question_conflict": 0.98,
                "question_accept": 0.68,
                "optimize": 0
            })
        };

        console.log(requestIni);

        const response = await this.request(`/parameters`, requestIni);
        return response;
    }

    /**
     * Create a new question vector
     * @param {string[]} questions
     * @param {number} bot_id
     * @returns {Promise<{status:number, data:{voices:Array}, text:string}>}
     */
    async createNode (bot_id, questions)
    {
        const headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
        };

        const requestIni = {
            method: "POST",
            headers,
            body: JSON.stringify({
                botkey: bot_id,
                answer_ids: questions.map((question, index) => index),
                question_ids: questions.map((question, index) => index),
                questions: questions
            })
        };

        console.log(requestIni);

        const response = await this.request(`/node`, requestIni);
        return response;
    }

    /**
     * Get answer from a question
     * @param {string} question
     * @param {number} bot_id
     * @returns {Promise<{status:number, data:{voices:Array}, text:string}>}
     */
    async getAnswer (bot_id, question)
    {
        const headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
        };

        const requestIni = {
            method: "POST",
            headers,
            body: JSON.stringify({
                botkey: bot_id,
                question: question
            })
        };
        //?botkey=${bot_id}&question="${question}"
        console.log(requestIni);

        const response = await this.request(`/answer`, requestIni);
        return response;
    }
}

export const aidolAPI = new AidolAPI();