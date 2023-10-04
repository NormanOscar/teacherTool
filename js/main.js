let data;
let gradingTool;
let area;
let criteria;
let level;

function init() {
    loadJSON();

    gradingTool = document.querySelector('#gradingTool');
    gradingTool.addEventListener('change', function() {
        showArea();
    });

    area = document.querySelector('#area');
    area.addEventListener('change', function() {
        showCriteria();
    });

    criteria = document.querySelector('#criteria');
    criteria.addEventListener('change', function() {
        showLevel();
    });
    
    level = document.querySelector('#level');

    const submitBtn = document.querySelector('#submitBtn');
    submitBtn.addEventListener('click', submitForm);
}

function loadJSON() {
    fetch('../json/data.json')
    .then((res) => {
        return res.json();
    })
    .then((json) => showData(json));
}

function showData(json) {
    data = json;

    showGradingTools();
}

function showGradingTools() {
    const dataPoints = data.gradingTools;
    for (let i = 0; i < dataPoints.length; i++) {
        const option = document.createElement('option');
        option.value = dataPoints[i].name;
        option.textContent = dataPoints[i].name;
        gradingTool.appendChild(option);
    }
}

function showArea() {
    document.querySelector('#criteria-div').style.display = 'none';
    document.querySelector('#level-div').style.display = 'none';
    document.querySelector('#level-select-div').style.display = 'none';
    document.querySelector('#level-check-div').style.display = 'none';

    const selectedDataPoint = data.gradingTools.find((dataPoint) => dataPoint.name === gradingTool.value);
    
    document.querySelector('#area-div').style.display = 'block';
    area.innerHTML = '';
    const dataPoints = selectedDataPoint.areas;

    if (dataPoints.length === 1) {
        const option = document.createElement('option');
        option.textContent = dataPoints[0].name;
        area.appendChild(option);
        showCriteria();
    }
    else {
        const firstoption = document.createElement('option');
        firstoption.textContent = 'Välj område';
        area.appendChild(firstoption);
        for (let i = 0; i < dataPoints.length; i++) {
            const option = document.createElement('option');
            option.textContent = dataPoints[i].name;
            area.appendChild(option);
        }
    }
}

function showCriteria() {
    document.querySelector('#level-div').style.display = 'none';
    document.querySelector('#level-select-div').style.display = 'none';
    document.querySelector('#level-check-div').style.display = 'none';

    const selectedGradingTool = data.gradingTools.find((dataPoint) => dataPoint.name === gradingTool.value);
    const selectedArea = selectedGradingTool.areas.find((dataPoint) => dataPoint.name === area.value);

    document.querySelector('#criteria-div').style.display = 'block';
    criteria.innerHTML = '';
    const dataPoints = selectedArea.criteria;

    if (dataPoints.length === 1) {
        const option = document.createElement('option');
        option.textContent = dataPoints[0].name;
        criteria.appendChild(option);
        showLevel();
    }
    else {
        const firstoption = document.createElement('option');
        firstoption.textContent = 'Välj kriteria';
        criteria.appendChild(firstoption);
        for (let i = 0; i < dataPoints.length; i++) {
            const option = document.createElement('option');
            option.textContent = dataPoints[i].name;
            criteria.appendChild(option);
        }
    }
}

function showLevel() {
    const selectedGradingTool = data.gradingTools.find((dataPoint) => dataPoint.name === gradingTool.value);
    const selectedArea = selectedGradingTool.areas.find((dataPoint) => dataPoint.name === area.value);
    const selectedCriteria = selectedArea.criteria.find((dataPoint) => dataPoint.name === criteria.value);
    
    document.querySelector('#level-div').style.display = 'block';
    level.innerHTML = '';

    if (selectedCriteria.level.length === 1) {
        document.querySelector('#level-check-div').style.display = 'block';
    }
    else {
        document.querySelector('#level-select-div').style.display = 'block';
        document.querySelector('#level-check-div').style.display = 'none';
        const firstoption = document.createElement('option');
        firstoption.textContent = 'Välj nivå';
        level.appendChild(firstoption);
        const dataPoints = selectedCriteria.level;
        for (let i = 0; i < dataPoints.length; i++) {
            const option = document.createElement('option');
            option.textContent = dataPoints[i];
            level.appendChild(option);
        }
    }
}

function submitForm() {
    const nameVal = document.querySelector('#name').value;
    const gradeVal = document.querySelector('#grade').value;
    const gradingToolVal = gradingTool.value;
    const areaVal = area.value;
    const criteriaVal = criteria.value;
    var levelVal;
    if (document.querySelector('#level-select-div').style.display == 'block') {
        levelVal = level.value;
    } else {
        levelVal = document.querySelector('#flexCheckDefault').checked ? 'Uppnår' : 'Uppnår inte';
    }
    const commentVal = document.querySelector('#comment').value;

    const studentData = {
        name: nameVal,
        grade: gradeVal,
        gradingTools: [
            {
                name: gradingToolVal,
                areas: [
                    {
                        name: areaVal,
                        criteria: [
                            {
                                name: criteriaVal,
                                level: levelVal,
                            }
                        ],
                    }
                ],
            }
        ],
        comment: commentVal,
    };
    saveLocalStorage(studentData);
}

function saveLocalStorage(data) {
    let savedData = localStorage.getItem('studentData');
    if (savedData === null) {
        let studentDataList = [data];
        localStorage.setItem('studentData', JSON.stringify(studentDataList));
    }
    else {
        let studentDataList = JSON.parse(savedData);
        studentDataList.push(data);
        localStorage.setItem('studentData', JSON.stringify(studentDataList));
        /* if (JSON.parse(savedData).name === data.name) {
            if (JSON.parse(savedData).gradingTools.name === data.gradingTools.name) {
                if (JSON.parse(savedData).gradingTools.areas.name === data.gradingTools.areas.name) {
                    
                }
            }
        }
        else {
            const studentData = JSON.parse(savedData);
            studentData.push(data);
            localStorage.setItem('studentData', JSON.stringify(studentData));
        } */
    }
}

window.addEventListener('load', init);