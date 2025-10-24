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
        console.log(employees)
        filteredEmployees=[...employees];
        // console.log(employees);
        console.log(filteredEmployees);
        displayEmployees();

        companies=[...employees.map(employee=>employee.company.name)]
        // console.log(companies)
        companies.forEach(comp=>{
            let option=document.createElement('option')
            option.textContent = comp
            companyFilter.appendChild(option)
        })
    }
    catch(err){
        errorDiv.style.display="block"
        errorDiv.textContent =`Error loading employees: ${err.message}`
    }

}

//calling the functions filter and search
companyFilter.addEventListener('change', filterByCompany);

function filterByCompany(){
    let searchedEmployee = search.value.toLowerCase()
    let selectedCompany = companyFilter.value
    console.log(selectedCompany)
    // console.log(selectedCompany)
    if (selectedCompany == "Filter by Company") {
        filteredEmployees = [...employees];
    }
    else if (selectedCompany) {
        filteredEmployees = employees.filter(
            //new 30.07
            (emp) => emp.company.name === selectedCompany && emp.name.toLowerCase().includes(searchedEmployee)
        );
    } 
    else {
        filteredEmployees = [...employees];
    }

    displayEmployees();
}


search.addEventListener('input', searchEmployee);


function searchEmployee(){  
    let searchedEmployee=search.value.toLowerCase()

    //new 30.07
    let selectedCompany=companyFilter.value


    filteredEmployees = employees.filter(employee =>{
        let matchedName =employee.name.toLowerCase().includes(searchedEmployee)
        let matchedCompany = selectedCompany === "Filter by Company" || employee.company.name.toLowerCase() === selectedCompany.toLowerCase()
        return matchedName && matchedCompany
    })
    //calling the function here
    displayEmployees()
}

addEmployeeBtn.addEventListener('click', (event)=>{
    event.preventDefault()
    let addedName = document.querySelector("#addedName").value;
    let addedEmail = document.querySelector("#addedEmail").value;
    let addedCompanyInput = document.querySelector("#addedCompany").value.trim();

    let addedCompany = addedCompanyInput.charAt(0).toUpperCase() + addedCompanyInput.slice(1).toLowerCase();

    if (addedName === '' || addedEmail === '' || addedCompany === '') {
        alert("Please fill in the fields before adding!");
    } else {
        console.log(addedCompany)
        const maxId = employees.length > 0 ? Math.max(...employees.map(emp => emp.id || 0)) : 0;
        let newEmployee = {
            id: maxId + 1,
            name: addedName,
            email: addedEmail,
            company: { name: addedCompany },
        };
        console.log(newEmployee)
        employees.push(newEmployee);
        filteredEmployees.push(newEmployee);
        if (!companies.includes(addedCompany)) {
            companies.push(addedCompany);
            let option = document.createElement('option');
            option.innerHTML = addedCompany;
            companyFilter.appendChild(option);
            //change with innerHTML=``
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




