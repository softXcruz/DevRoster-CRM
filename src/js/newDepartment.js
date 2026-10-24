import { newDepartment, getDepartmentById, updateDepartment } from "./departmentApi.js";
import { showAlert } from "./helpers.js";
import { showDepartments } from "./listDepartments.js";

// Select the elements
const modal = document.getElementById("departmentModal");
const form = document.getElementById("departmentForm");
const title = document.getElementById("departmentModalTitle");
const submitBtn = form.querySelector("[type='submit']");
const btnAddDepartment = document.getElementById("addDepartmentBtn");
const tableBody = document.getElementById("departmentsTable");
const closeButtons = modal.querySelectorAll("[data-close]");

// State: null = creating, an id = editing
let editingId = null;

// Open the modal (with a department = edit mode)
const openModal = (department = null) => {
    editingId = department ? department.id : null;

    title.textContent = department ? "Edit department" : "New department";
    submitBtn.textContent = department ? "Save changes" : "Create department";

    if (department) {
        form.elements.name.value = department.name;
        form.elements.description.value = department.description;
    }

    modal.classList.remove("hidden");
    modal.classList.add("flex");
    form.elements.name.focus();
};

// Close the modal
const closeModal = () => {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
    form.reset();
    editingId = null;
    btnAddDepartment.focus();
};

// Open to create
btnAddDepartment.addEventListener("click", () => openModal());

// Open to edit (one listener for the whole table)
tableBody.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-action='edit']");
    if (!button) return;

    try {
        const department = await getDepartmentById(button.dataset.id);
        openModal(department);
    } catch (error) {
        console.error(error);
        alert("Could not load the department. Please try again.");
    }
});

// Close buttons, overlay and Escape
closeButtons.forEach((button) => button.addEventListener("click", closeModal));

modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.classList.contains("hidden")) {
        closeModal();
    }
});

// Submit: create or update
form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const data = Object.fromEntries(new FormData(form));
    const allFilled = Object.values(data).every((data) => data !== "");
    if(!allFilled) {
        showAlert("All fields are required");
        return;
    }

    submitBtn.disabled = true;
    data.name = data.name.trim();
    data.description = data.description.trim();

    try {
        if (editingId) {
            await updateDepartment(editingId, data);
        } else {
            await newDepartment(data);
        }
        closeModal();
        await showDepartments();
    } catch (error) {
        console.error(error);
        alert("Something went wrong. Please try again.");
    } finally {
        submitBtn.disabled = false;
    }
});