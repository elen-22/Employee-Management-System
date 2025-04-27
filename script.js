let errorDiv = document.querySelector("#error")
let employeeList = document.querySelector("#employeeList")
let companyFilter=document.querySelector("#companyFilter")
let search=document.querySelector("#search")
let addEmployeeBtn = document.querySelector("#addEmployeeBtn")
let employees = []
let filteredEmployees = []
let companies=[]

//get employees from API with fetch

async function getEmployees() {
    try {
        let response = await fetch('https://jsonplaceholder.typicode.com/users');
        if (!response.ok) {
            throw new Error('Failed to fetch employees.');
        }
        employees=await response.json();
        filteredEmployees=[...employees];
        // console.log(employees);
        console.log(filteredEmployees);
        employeeList.innerHTML=filteredEmployees.map(employee=>{
            return `
                 <div class="employeeCard">
            <h2>${employee.name}</h2>
            <p><strong>Email:</strong> ${employee.email}</p>
            <p><strong>Company:</strong> ${employee.company.name}</p>
          </div>
            
            `;
        })
        .join("") //not to have commas

        companies=[...employees.map(employee=>employee.company.name)]
        // console.log(companies)
        companies.forEach(comp=>{
            let option=document.createElement('option')
            option.innerHTML=comp
            companyFilter.appendChild(option)
        })
    }
    catch(err){
        errorDiv.style.display="block"
        errorDiv.innerHTML =`Error loading employees: ${err.message}`
    }

}

function filterByCompany(){
    let selectedCompany = companyFilter.value
    console.log(selectedCompany)
    // console.log(selectedCompany)
    if (selectedCompany == "Filter by Company") {
        filteredEmployees = [...employees];
    }
    else if (selectedCompany) {
        filteredEmployees = employees.filter(
            (emp) => emp.company.name === selectedCompany
        );
    } 
    
    else {
        filteredEmployees = [...employees];
    }

    displayEmployees();
}

//calling the functions filter and search
companyFilter.addEventListener('change', filterByCompany);
search.addEventListener('input', searchEmployee);


function searchEmployee(){  
    let searchedEmployee=search.value.toLowerCase()

    filteredEmployees = employees.filter(employee => employee.name.toLowerCase().includes(searchedEmployee))
    //calling the function here
    displayEmployees()
}

addEmployeeBtn.addEventListener('click', (event)=>{
    event.preventDefault()
    let addedName = document.querySelector("#addedName").value;
    let addedEmail = document.querySelector("#addedEmail").value;
    let addedCompany = document.querySelector("#addedCompany").value;

    if (addedName === '' || addedEmail === '' || addedCompany === '') {
        alert("Please fill in the fields before adding!");
    } else {
        let newEmployee = {
            id: employees.length + 1, // Assign a new ID for the employee
            name: addedName,
            email: addedEmail,
            company: { name: addedCompany },
        };
        employees.push(newEmployee);
        filteredEmployees.push(newEmployee);
        if (!companies.includes(addedCompany)) {
            companies.push(addedCompany);
            let option = document.createElement('option');
            option.innerHTML = addedCompany;
            companyFilter.appendChild(option);
        }
         // Call the display function
        displayEmployees();

        // Clear the form inputs
        document.getElementById('addedName').value = '';
        document.getElementById('addedEmail').value = '';
        document.getElementById('addedCompany').value = '';
        
    }
    
})

function displayEmployees(){
    employeeList.innerHTML=filteredEmployees.map(employee=>{
        return `
        <div class="employeeCard">
          <h2>${employee.name}</h2>
          <p><strong>Email:</strong> ${employee.email}</p>
          <p><strong>Company:</strong> ${employee.company.name}</p>
        </div>
      `;
    })
    .join('')
}

getEmployees();




