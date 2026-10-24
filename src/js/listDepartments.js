// Import libraries
import { getDepartments, deleteDepartment } from "./departmentApi.js";

// Get the table body and create the classes for the cells
const tableBody = document.getElementById("departmentsTable");
if (!tableBody) {
    throw new Error("#departmentsTable not found: this script is loaded on a page without the departments table");
}
const cell_class = "border-t border-slate-200 px-4 py-3.5 text-sm";

// Delete: one listener for the whole table body
tableBody.addEventListener("click", async (e) => {
    const button = e.target.closest("[data-action='delete']");
    if (!button) return;

    const { id, employees } = button.dataset;
    const name = button.closest("tr").firstElementChild.textContent;

    // If the department has employees, do nothing
    if (Number(employees) > 0) return;

    const confirmed = confirm(`Delete the ${name} department? This cannot be undone.`);
    if (!confirmed) return;

    button.disabled = true;

    try {
        await deleteDepartment(id);
        await showDepartments();
    } catch (error) {
        console.error(error);
        alert("Could not delete the department. Please try again.");
        button.disabled = false;
    }
});

// Row with a single message (empty state or error)
function createMessageRow(text, isError = false) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 4;
    cell.className = `px-4 py-10 text-center text-sm ${isError ? "font-medium text-red-700" : "text-slate-600"}`;
    cell.textContent = text;
    row.appendChild(cell);
    return row;   // return it, don't append it here
}

// Show departments
export async function showDepartments() {
    let departments;

    try {
        departments = await getDepartments();
    } catch (error) {
        console.error(error);
        tableBody.replaceChildren(
            createMessageRow("Could not load departments. Is the API running?", true)
        );
        return;
    }

    // Clear the table before painting
    tableBody.replaceChildren();

    if (departments.length === 0) {
        tableBody.appendChild(
            createMessageRow("No departments yet. Click “Add Department” to create the first one.")
        );
        return;
    }

    departments.forEach((department) => {
        const { id, name, description, employees = [] } = department;
        const employeeCount = employees.length;

        const row = document.createElement("tr");
        row.className = "hover:bg-slate-50";
        row.dataset.id = id;

        const nameCell = document.createElement("td");
        nameCell.className = `${cell_class} font-semibold text-slate-900`;
        nameCell.textContent = name;

        const descriptionCell = document.createElement("td");
        descriptionCell.className = `${cell_class} break-words text-slate-700`;
        descriptionCell.textContent = description;

        const teamCell = document.createElement("td");
        teamCell.className = `${cell_class} whitespace-nowrap`;

        const teamBadge = document.createElement("span");
        const colors = employeeCount === 0
            ? "bg-slate-100 text-slate-600"
            : "bg-indigo-100 text-indigo-800";
        teamBadge.className = `rounded-full px-2.5 py-1 text-xs font-semibold ${colors}`;
        teamBadge.textContent = `${employeeCount} ${employeeCount === 1 ? "Employee" : "Employees"}`;
        teamCell.appendChild(teamBadge);

        const actionsCell = document.createElement("td");
        actionsCell.className = `${cell_class} text-right`;
        actionsCell.innerHTML = `
            <button type="button" data-action="edit" data-id="${id}" class="cursor-pointer rounded-lg px-3 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                Edit
            </button>
            <button type="button" data-action="delete" data-id="${id}" data-employees="${employeeCount}"
                ${employeeCount > 0 ? 'disabled title="Reassign or remove its employees first"' : ""}
                class="cursor-pointer rounded-lg px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent">
                Delete
            </button>
        `;

        row.append(nameCell, descriptionCell, teamCell, actionsCell);
        tableBody.appendChild(row);
    });
}

// Paint the table when the page loads
showDepartments();