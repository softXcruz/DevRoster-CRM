// Base URL
const url = "http://localhost:3000/employees";

// CREATE EMPLOYEE
export const newEmployee = async (employee) => {
    const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(employee),
        headers: {
            "Content-Type": "application/json"
        }
    });

    if(!response.ok) {
        throw new Error("Could not create employee");
    }

    // Return the employee json
    return await response.json();
}

// GET EMPLOYEE
export const getEmployees =  async () => {
    const response = await fetch(`${url}?_expand=department`);
    if (!response.ok) {
        throw new Error("Could not load employees");
    }
    return await response.json();
}

// GET EMPLOYEE BY ID
export const getEmployeeById = async (id) => {
    const response = await fetch(`${url}/${id}`);

    if (!response.ok) {
        throw new Error("Could not load employee");
    }

    return await response.json();
};

// UPDATE EMPLOYEE
export const updateEmployee = async (id, employee) => {
    const response = await fetch(`${url}/${id}`, {
        method: "PATCH",
        body: JSON.stringify(employee),
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) {
        throw new Error("Could not update employee");
    }

    return await response.json();
};

// DELETE EMPLOYEE
export const deleteEmployee = async (id) => {
    const response = await fetch(`${url}/${id}`, {
        method: "DELETE"
    });

    if (!response.ok) {
        throw new Error("Could not delete employee");
    }
};