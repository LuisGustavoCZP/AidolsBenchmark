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
     * Get all voices
     * @param {string} question
     * @param {string} token
     * @returns {Promise<{status:number, data:{voices:Array}, text:string}>}
     */
    async getAnswer (token, question)
    {
        const headers = {
            "Accept": "application/json",
        };

        const requestIni = {
            method: "GET",
            headers,
        };

        const response = await this.request(`/brbot/v1/token/${token}/answer?question="${question}"}`, requestIni);
        return response;
    }
}

export const aidolAPI = new AidolAPI();