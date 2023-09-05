//import Chart from 'chart.js/auto'

const form = document.getElementById("stress-form");
const resultsSection = document.getElementById("results");
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
        "Accept": "application/json", 
        "Content-Type": "application/json",
    }

    resultsSection.setAttribute("disabled", true);
    form.setAttribute("disabled", true);

    const response = await fetch("/api/stress", {method: "POST", headers, body: JSON.stringify(body)}).then(res => res.json());

    console.log(response);

    const id = response.data.id;

    checkResult(id);
}

/**
 * 
 * @param {string} id 
 */
async function checkResult (id)
{
    /**
     * @type {{data: {id: string, status: "completed" | "starting" | "processing", startTime: number, endTime: number, results: Array<{startTime: number, endTime: number, value: {data: Array<string>, status: number, text: string}}>}}}
     */
    let response;

    do
    {
        response = await fetch(`/api/stress/${id}`, {method: "GET"}).then(res => res.json());
        console.log(response);
        await new Promise((resolve) => setTimeout(resolve, 1000));
    } while (response.data.status != "completed");

    if(resultUL) resultUL.remove();
    resultUL = document.createElement("ol");

    const results = response.data.results.map((result, index) => {
        result.index = index;
        result.time = result.endTime - result.startTime;
        return result;
    });

    const resultList = results.map(result => renderResult(result));

    resultUL.append(...resultList);

    const totalTimeText = document.createElement("span");
    
    const totalTime = response.data.endTime - response.data.startTime;
    totalTimeText.textContent = `Tempo total: ${totalTime} ms`;

    const averageTimeText = document.createElement("span");
    const averageTime = response.data.results.reduce((t, result) => t+=result.time, 0) / response.data.results.length;
    averageTimeText.textContent = `Média por teste: ${averageTime} ms`;

    timeSpan.innerHTML = "";
    timeSpan.appendChild(totalTimeText);
    timeSpan.appendChild(averageTimeText);

    resultsSection.appendChild(resultUL);

    resultsSection.removeAttribute("disabled");
    form.removeAttribute("disabled");
    renderGraph(response.data.results, totalTime);
}

/**
 * @param {{index: number, startTime: number, endTime: number, time: number, value: {data: Array<string>, status: number, text: string}}} result 
 */
function renderResult (result)
{
    const li = document.createElement("li");

    const resultList = document.createElement("ul");
    const resultTexts = result.value.data.map(txt => {
        const resultText = document.createElement("li");
        resultText.textContent = txt;
        return resultText;
    });
    resultList.append(...resultTexts);
    
    const paramsSpan = document.createElement("span");

    const indexText = document.createElement("h4");
    indexText.textContent = `${result.index+1})`;

    const timeText = document.createElement("h5");
    timeText.textContent = `Tempo gasto: ${result.time} ms`;

    const statusText = document.createElement("h5");
    statusText.textContent = `Status Code: ${result.value.status}`;

    paramsSpan.append(indexText, timeText, statusText);

    li.append(paramsSpan, resultList);

    return li;
}

/**
 * @param {{index: number, startTime: number, endTime: number, time: number, value: {data: Array<string>, status: number, text: string}}[]} results
 * @param {number} totalTime
 */
function renderGraph (results, totalTime)
{
    const totalIntervals = 20;
    const intervalTime = Math.round(totalTime / totalIntervals);

    const intervalTs = new Array(totalIntervals+1);
    for (let index = 0; index < totalIntervals; index++)
    {
        const start = index * intervalTime;
        const end = (index+1) * intervalTime;

        intervalTs[index] = {
            start: start,
            end: end,
            values: results.filter(result => result.time >= start && result.time < end)
        };
    }
    intervalTs[totalIntervals] = {
        start: totalTime,
        end: totalTime,
        values: []
    };

    const labels = intervalTs.map(interval => `${interval.start}ms`);
    const datas = intervalTs.map(interval => `${interval.values.length}`);

    //console.log("Graph", results, intervalTs, labels, datas)

    if(chart) chart.destroy();
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Requests',
                data: datas,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    beginAtZero: true,
                    display: true,
                    title: {
                        display: true,
                        text: 'Tempo'
                    }
                },
                y: {
                    beginAtZero: true,
                    display: true,
                    title: {
                        display: true,
                        text: 'Requisições'
                    },
                    suggestedMax: results.length / totalIntervals
                }
            },
            width: "800px",
            height: "500px",
        }
    });
}

form.onsubmit = onSubmit;