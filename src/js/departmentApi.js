// Base URL
const url = "http://localhost:3000/departments";

// CREATE DEPARTMENT
export const newDepartment = async (department) => {
    const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(department),
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) {
        throw new Error("Could not create department");
    }

    return await response.json();
};

// READ: all departments (with their employees)
export const getDepartments = async () => {
    const response = await fetch(`${url}?_embed=employees`);

    if (!response.ok) {
        throw new Error("Could not load departments");
    }

    return await response.json();
};

// READ: one department by id
export const getDepartmentById = async (id) => {
    const response = await fetch(`${url}/${id}`);

    if (!response.ok) {
        throw new Error("Could not load department");
    }

    return await response.json();
};

// UPDATE
export const updateDepartment = async (id, department) => {
    const response = await fetch(`${url}/${id}`, {
        method: "PATCH",
        body: JSON.stringify(department),
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) {
        throw new Error("Could not update department");
    }

    return await response.json();
};

// DELETE
export const deleteDepartment = async (id) => {
    const response = await fetch(`${url}/${id}`, {
        method: "DELETE"
    });

    if (!response.ok) {
        throw new Error("Could not delete department");
    }
};