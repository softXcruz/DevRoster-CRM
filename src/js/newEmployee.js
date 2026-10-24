// Import libraries
import { getDepartments } from "./departmentApi.js";
import { newEmployee, getEmployeeById ,updateEmployee } from "./employeeApi.js";
import { showAlert } from "./helpers.js";

// Select the elements
const modalEmployee = document.getElementById("employeeModal");
const formEmployee = document.getElementById("employeeForm");
const btnAddEmployee = document.getElementById("addEmployeeBtn");
const closeButtonsModal = modalEmployee.querySelectorAll("[data-close]");
const title = document.getElementById("employeeModalTitle");
const submitBtn = formEmployee.querySelector("[type='submit']");
const departmentSelect = document.getElementById("employeeDepartment");
const employeeTable = document.getElementById("employeeTable");

// Variable flag to editing
let editingId = null;

// Fill the select with the departments from the API
const fillDepartments = async () => {
    try {
        // Fetch to API
        const departments = await getDepartments();
        const placeholder = new Option(departmentSelect.length ? "Select a department": "No departments yet", "");
        const options = departments.map(({id, name}) => new Option(name, id));

        departmentSelect.replaceChildren(placeholder, ...options);
        departmentSelect.disabled === departmentSelect.length === 0;
        
        
    } catch (error) {
        console.error(error);
        departmentSelect.replaceChildren(new Option("Could not load departments", ""));
        departmentSelect.disabled = true;
    }
}

// Open Modal
const openModal = async (employee = null) => {
    editingId = employee ? employee.id : null;

    title.textContent = employee ? "Edit employee" : "New employee";
    submitBtn.textContent = employee ? "Save changes" : "Create employee";

    modalEmployee.classList.remove("hidden");
    modalEmployee.classList.add("flex");

    await fillDepartments();

    if (employee) {
        formEmployee.elements.name.value = employee.name;
        formEmployee.elements.lastName.value = employee.lastName;
        formEmployee.elements.email.value = employee.email;
        formEmployee.elements.cellphone.value = employee.cellphone;
        formEmployee.elements.age.value = employee.age;
        formEmployee.elements.departmentId.value = employee.departmentId;
    }

    formEmployee.elements.name.focus();
};

// Close modal
const closeModal = () => {
    modalEmployee.classList.remove("flex");
    modalEmployee.classList.add("hidden");
    formEmployee.reset();
    btnAddEmployee.focus();
}

// Add event listener to the button open modal
btnAddEmployee.addEventListener("click", () => openModal());

// Edit modal
employeeTable.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-action='edit']");
    if (!button) return;

    try {
        const employee = await getEmployeeById(button.dataset.id);
        openModal(employee); 
    } catch (error) {
        console.error(error);
        alert("Could not load the employee. Please try again.");
    }
});

// Add event listener to the button close modal
closeButtonsModal.forEach(button => button.addEventListener("click", closeModal));

// Add event listene to close modal when user click outside modal
modalEmployee.addEventListener("click", (e) => {
    if (e.target === modalEmployee) closeModal();
});

// If the user click on keyboard esc, close the modal
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modalEmployee.classList.contains("hidden")) {
        closeModal();
    }
});


// Submit: Create or update
formEmployee.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(formEmployee));
    const allFilled = Object.values(data).every((value) => value.trim() !== "");
    if(!allFilled) {
        showAlert("All fields are required");
        return;
    }

    // Continue
    submitBtn.disabled = true;
    data.name = data.name.trim();
    data.lastName = data.lastName.trim();
    data.cellphone = data.cellphone.trim();
    data.age = Number(data.age.trim());
    data.email = data.email.trim();
    data.departmentId = Number(data.departmentId);
    
    try {
        if(editingId) {
            await updateEmployee(editingId, data);
        } else {
            await newEmployee(data);
        }
        // Close the modal and show employees
        closeModal();
    } catch (error) {
        console.log(error);
        alert("Something went wrong. Please try again.")
    } finally {
        submitBtn.disabled = false;
    }
    
});
