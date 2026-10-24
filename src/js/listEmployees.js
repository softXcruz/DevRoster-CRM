// Import libraries
import { getEmployees, deleteEmployee } from "./employeeApi.js"

// Get the table body and create the classes for the cells
const tableBody = document.getElementById("employeesTable");
if (!tableBody) {
    throw new Error("#employeesTable not found: this script is loaded on a page without the employees table");
}
const cell_class = "border-t border-slate-200 px-4 py-3.5 text-sm";

// Row with a single message (empty state or error)
function createMessageRow(text, isError = false) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 6;
    cell.className = `px-4 py-10 text-center text-sm ${isError ? "font-medium text-red-700" : "text-slate-600"}`;
    cell.textContent = text;
    row.appendChild(cell);
    return row;
}

// Show employees
export async function showEmployees() {
    let employees;

    try {
        employees = await getEmployees();
    } catch (error) {
        console.error(error);
        tableBody.replaceChildren(
            createMessageRow("Could not load employees. Is the API running?", true)
        );
        return;
    }

    // Clear the table before painting
    tableBody.replaceChildren();

    if (employees.length === 0) {
        tableBody.appendChild(
            createMessageRow("No employees yet. Click “Add Employee” to create the first one.")
        );
        return;
    }

    employees.forEach((employee) => {
        const { id, name, lastName, email, cellphone, age, department } = employee;

        const row = document.createElement("tr");
        row.className = "hover:bg-slate-50";
        row.dataset.id = id;

        row.dataset.id = id;
        row.dataset.name = `${name} ${lastName}`;

        // Employee: avatar with initials + full name
        const employeeCell = document.createElement("td");
        employeeCell.className = cell_class;

        const wrapper = document.createElement("div");
        wrapper.className = "flex items-center gap-3";

        const avatar = document.createElement("span");
        avatar.className = "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-800";
        avatar.textContent = `${name?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();

        const fullName = document.createElement("span");
        fullName.className = "truncate font-semibold text-slate-900";
        fullName.textContent = `${name} ${lastName}`;

        wrapper.append(avatar, fullName);
        employeeCell.appendChild(wrapper);

        // Email
        const emailCell = document.createElement("td");
        emailCell.className = `${cell_class} truncate text-slate-700`;
        emailCell.textContent = email;

        // Cellphone
        const cellphoneCell = document.createElement("td");
        cellphoneCell.className = `${cell_class} whitespace-nowrap text-slate-700`;
        cellphoneCell.textContent = cellphone;

        // Age
        const ageCell = document.createElement("td");
        ageCell.className = `${cell_class} text-slate-700`;
        ageCell.textContent = age;

        // Department badge (the department can be missing if it was deleted)
        const departmentCell = document.createElement("td");
        departmentCell.className = `${cell_class} whitespace-nowrap`;

        const departmentBadge = document.createElement("span");
        const colors = department
            ? "bg-indigo-100 text-indigo-800"
            : "bg-slate-100 text-slate-600";
        departmentBadge.className = `rounded-full px-2.5 py-1 text-xs font-semibold ${colors}`;
        departmentBadge.textContent = department ? department.name : "No department";
        departmentCell.appendChild(departmentBadge);

        // Actions (buttons only, no listeners yet)
        const actionsCell = document.createElement("td");
        actionsCell.className = `${cell_class} text-right`;
        actionsCell.innerHTML = `
            <button type="button" data-action="edit" data-id="${id}" class="cursor-pointer rounded-lg px-3 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                Edit
            </button>
            <button type="button" data-action="delete" data-id="${id}" class="cursor-pointer rounded-lg px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:cursor-not-allowed disabled:opacity-50">
                Delete
            </button>
        `;

        row.append(employeeCell, emailCell, cellphoneCell, ageCell, departmentCell, actionsCell);
        tableBody.appendChild(row);
    });
}

// Delete: one listener for the whole table body
tableBody.addEventListener("click", async (e) => {
    const button = e.target.closest("[data-action='delete']");
    if (!button) return;

    const { id } = button.dataset;
    const { name } = button.closest("tr").dataset;

    const confirmed = confirm(`Delete ${name}? This cannot be undone.`);
    if (!confirmed) return;

    button.disabled = true;

    try {
        await deleteEmployee(id);
        await showEmployees();
    } catch (error) {
        console.error(error);
        alert("Could not delete the employee. Please try again.");
        button.disabled = false;
    }
});
// Paint the table when the page loads
showEmployees();