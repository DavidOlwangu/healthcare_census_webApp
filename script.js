//Button to add patient data
const addPatientButton = document.getElementById('addPatient');
//Element where patient data will be displayed
const report = document.getElementById('report');
// var name of button which dispalys search results when clicked
const btnSearch = document.getElementById('btnSearch');
// Array to store patient data
const patients = [];

function addPatient() {
    // Get input values
    const name = document.getElementById('name').value;
    const gender = document.querySelector('input[name="gender"]:checked');
    const age = document.getElementById('age').value;
    const condition = document.getElementById('condition').value;

    if (name && gender && age && condition) {
        const genderValue = gender.value; //Extracts the value of the selected gender radio button and assigns it to the variable genderValue
        patients.push({name, gender: genderValue, age, condition}); //Appends patient's details to patients[] array, which stores all entered data using push() method
        resetForm(); //clears input field for the next entry
        generateReport(); //method to update and display analysis report based on newly added patient data
    } else {
        alert('Please fill in all fields.'); //Alert message if any input field is left empty
    }
}

//Function to clear input field for next entry
function resetForm(){
    document.getElementById('name').value = "";
    document.querySelector('input[name="gender"]:checked').checked = false;
    document.getElementById('age').value = "";
    document.getElementById('condition').value = "";
}

//Function to generate the report
function generateReport(){
    //Total number of patients stired in the patients[] array
    const numPatients = patients.length;
    //Data structure/object initializing counter fro specific medical conditions, set to 0
    const conditionsCount = {
        Diabetes: 0,
        Thyroid: 0,
        "High Blood Pressure": 0,
    };
    //Nested object with gender specific condition counter, initialized to 0
    const genderConditionsCount = {
        Male: {
            Diabetes: 0,
            Thyroid: 0,
            "High Blood Pressure": 0,
        },
        Female: {
            Diabetes: 0,
            Thyroid: 0,
            "High Blood Pressure": 0,
        },
    };
    //Iterates through each patients' data in patients[] array using for...loop
    for (const patient of patients){
        conditionsCount[patient.condition]++; //Increments count for each patient's specific medical condition in conditionsCount object
        genderConditionsCount[patient.gender][patient.condition]++; //updates gender-based condition counts
    }
    report.innerHTML = `Number of patients: ${numPatients}<br><br>`;
    report.innerHTML += `Conditions Breakdown: <br>`;
    for (const condition in conditionsCount){
        report.innerHTML += `${condition}: ${conditionsCount[condition]}<br>`;
    }
    report.innerHTML += `<br>Gender-Based Conditions: <br>`;
    for (const gender in genderConditionsCount){
        report.innerHTML += `${gender}:<br>`;
        for (const condition in genderConditionsCount[gender]){
            report.innerHTML += `&nbsp;&nbsp;${condition}: ${genderConditionsCount[gender][condition]}<br>`;
        }
    }
}
addPatientButton.addEventListener("click", addPatient);

//Function for search request
function searchCondition(){
    const input = document.getElementById('conditionInput').value.toLowerCase();
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = 'Searching...';
    fetch('health_analysis.json')
        .then(response => response.json())
        .then(data => {
            const condition = data.conditions.find(item => item.name.toLowerCase()===input);
            if (condition) {
                const symptoms =condition.symptoms.join(',');
                const prevention = condition.prevention.join(',');
                const treatment = condition.treatment;
                resultDiv.innerHTML += `<h2>${condition.name}</h2>`;
                resultDiv.innerHTML += `<img src="${condition.imagesrc}" alt="hjh">`;
                resultDiv.innerHTML += `<p><strong>Symptoms:</strong> ${symptoms}</p>`;
                resultDiv.innerHTML += `<p><strong>Prevention:</strong> ${prevention}</p>`;
                resultDiv.innerHTML += `<p><strong>Treatment:</strong> ${treatment}</p>`;
            } else {
                resultDiv.innerHTML = `Condition not found.`;
            }
        })
        .catch(error => {
            console.error('Error, error');
            resultDiv.innerHTML = `An error occurred while fetching data.`;
        });
}
btnSearch.addEventListener('click', searchCondition);