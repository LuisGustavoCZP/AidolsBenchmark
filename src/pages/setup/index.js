//import Chart from 'chart.js/auto'

const form = document.getElementById("stress-form");
const timeSpan = document.getElementById("time-span");
const ctx = document.getElementById('myChart');
let chart;
let resultUL;

/**
 * 
 * @param {FormDataEvent} e 
 */
async function onSubmit (e)
{
    e.preventDefault();
    const formData = new FormData(e.target);
    const body = Object.fromEntries(formData.entries());
    
    const headers = {
        "Accept": "application/json" , 
        "Content-Type": "application/json",
    }

    form.setAttribute("disabled", true);

    const response = await fetch("/api/setup", {method: "POST", headers, body: JSON.stringify(body)}).then(res => res.json());

    console.log(response);
}

form.onsubmit = onSubmit;