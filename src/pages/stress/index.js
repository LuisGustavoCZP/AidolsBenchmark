const form = document.getElementById("stress-form");
const resultsSection = document.getElementById("results")

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

    const results = response.data.results.map((result, index) => renderResult(index, result));

    ul.append(...results);

    const totalTimeText = document.createElement("span");
    
    const totalTime = response.data.endTime - response.data.startTime;
    totalTimeText.textContent = `Tempo total: ${totalTime} ms`;

    const averageTimeText = document.createElement("span");
    const averageTime = totalTime / response.data.results.length;
    averageTimeText.textContent = `Média por teste: ${averageTime} ms`;

    resultsSection.appendChild(totalTimeText);
    resultsSection.appendChild(averageTimeText);
    resultsSection.appendChild(ul);

    resultsSection.removeAttribute("disabled");
}

/**
 * @param {number} index
 * @param {{startTime: number, endTime: number, value: {data: Array<string>, status: number, text: string}}} result 
 */
function renderResult (index, result)
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
    indexText.textContent = `${index+1})`;

    const timeText = document.createElement("h5");
    timeText.textContent = `Tempo gasto: ${result.endTime - result.startTime} ms`;

    const statusText = document.createElement("h5");
    statusText.textContent = `Status Code: ${result.value.status}`;

    paramsSpan.append(indexText, timeText, statusText);

    li.append(paramsSpan, resultList);

    return li;
}

form.onsubmit = onSubmit;