import Express from "express";
import { data } from "../../data";
import {aidolAPI} from "../../clients"
import configs, {uuid} from "../../configs";

/**
 * 
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 */
export async function selectStress (req, res)
{
    const {id} = req.params;

    console.log(id, req.body);
    
    res.status(200).json({data: data.tests[id]});
}

const tests = {}