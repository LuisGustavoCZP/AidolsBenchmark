import fetch from "node-fetch";
import https from "https";

/**
 * @class
 */
export class API
{
    /**
     * @type {string}
     */
    url;


    /**
     * @type {https.Agent}
     */
    httpsAgent;

    /**
     * Base external API connection
     * @param {string} url 
     */
    constructor (url)
    {
        this.url = url;
        this.httpsAgent = new https.Agent({
            rejectUnauthorized: false,
        });
    }

    async request (path, requestIni)
    {
        requestIni.agent = this.httpsAgent;

        const url = `${this.url}${path}`;
        try 
        {
            const response = await fetch(url, requestIni)
                .then(async (resp) => 
                {
                    const code = resp.status;
                    const headers = requestIni["headers"];
                    if(headers)
                    {
                        if(headers["Accept"] && headers["Accept"].match(/audio|video|image/gi))
                        {
                            const audioBuffer = await resp.arrayBuffer();
                            return { status: code, buffer: audioBuffer};
                        }
                    }

                    let text = await resp.text();
                    try 
                    {
                        const json = JSON.parse(text);
                        return { status: code, data: json, text:text };
                    } 
                    catch (error) 
                    {
                        return { status: code, text };
                    }
                })
                .catch(async (err) => 
                {
                    const code = err.status;
                    return { status: code || 400, text: err.message };
                });
            return response;
        } 
        catch (error) 
        {
            return { status: 500, text: error.message };
        }
    }
}