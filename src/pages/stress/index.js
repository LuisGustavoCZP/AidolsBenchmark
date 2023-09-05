//import Chart from 'chart.js/auto'

const form = document.getElementById("stress-form");
const resultsSection = document.getElementById("results");
const timeSpan = document.getElementById("time-span");

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

    const response = await fetch("/api/stress", {method: "POST", headers, body: JSON.stringify(body)}).then(res => res.json());

    console.log(response);

    const id = response.data.id;

    form.setAttribute("disabled", true);

    checkResult(id);
    //form.style = "display: none;";
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

    const ul = document.createElement("ol");

    const results = response.data.results.map((result, index) => {
        result.index = index;
        result.time = result.endTime - result.startTime;
        return result;
    });

    const resultList = results.map(result => renderResult(result));

    ul.append(...resultList);

    const totalTimeText = document.createElement("span");
    
    const totalTime = response.data.endTime - response.data.startTime;
    totalTimeText.textContent = `Tempo total: ${totalTime} ms`;

    const averageTimeText = document.createElement("span");
    const averageTime = totalTime / response.data.results.length;
    averageTimeText.textContent = `Média por teste: ${averageTime} ms`;

    timeSpan.appendChild(totalTimeText);
    timeSpan.appendChild(averageTimeText);

    resultsSection.appendChild(ul);

    resultsSection.removeAttribute("disabled");

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
    const ctx = document.getElementById('myChart');

    const intervalTime = totalTime / 20;
    /* results.sort((a, b) => {
        if(a.time < b.time) return -1;
        else if(a.time > b.time) return 1;
        else if(a.time == b.time) return 0;
    }); */

    let intervals = new Array(20);
    intervals = intervals.map((it, index) => {
        const start = index * intervalTime;
        const end = (index+1) * intervalTime;
        const interval = {
            start: start,
            end: end,
            values: results.filter(result => result.time >= start && result.time < end)
        }
        return interval;
    });

    const labels = intervals.map(interval => `${interval.start}`);
    const datas = intervals.map(interval => `${interval.values.lenght}`);

    console.log("Graph", labels, datas)

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Indice',
                data: datas,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                },
            },
            width: "500px"
        }
    });
}

form.onsubmit = onSubmit;