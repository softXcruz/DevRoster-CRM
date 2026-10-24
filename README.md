<h1 align="center">DevRoster</h1>

<p align="center">
  Employee and department management for a tech company, with full CRUD on both.
</p>

<p align="center">
  <a href="https://your-live-demo-url">Live demo</a> ·
  <a href="https://github.com/softXcruz/DevRoster/issues">Report a bug</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/Tailwind_CSS-0F172A?logo=tailwindcss&logoColor=38BDF8" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/json--server-000000?logo=json&logoColor=white" alt="json-server">
</p>

![DevRoster employees view](./public/devroster-employees.png)

## About

I built this to practice a complete CRUD without a framework: two related resources, a REST API, async/await, modals that work for both creating and editing, and a table that updates without reloading the page.

## What it does

- Lists, creates, edits and deletes **employees** and **departments**.
- Every employee belongs to a department, picked from a select that is filled from the API each time the modal opens.
- Each department shows how many employees it has. A department with employees cannot be deleted until they are reassigned or removed.
- The same modal handles creating and editing, with prefilled fields and a different title and button.
- Tables repaint after every change, with no page reload.
- Shows an empty state when there is no data and an error message when the API is unreachable.
- Closes modals with the X, Cancel, a click on the overlay or the Escape key.
- Responsive layout. Tables scroll horizontally on small screens.

## Stack

- HTML and vanilla JavaScript (ES modules, `fetch` with async/await)
- Tailwind CSS v4 (CLI)
- json-server 0.17.4 as a fake REST API
- Inter, loaded from Google Fonts

## Running it locally

You need Node 20 or newer.

```bash
git clone https://github.com/softXcruz/DevRoster.git
cd DevRoster
npm install
```

Start the API and the Tailwind compiler, each in its own terminal:

```bash
npm run api   # json-server on http://localhost:3000
npm run css   # Tailwind in watch mode
```

Then open `index.html` with a local server such as the VS Code **Live Server** extension. ES modules do not work when the file is opened directly from the file system.

## How it's put together

Project structure

```
index.html            employees page
departments.html      departments page
db.json               data served by json-server
src/
  css/
    input.css         Tailwind entry point
    output.css        generated, do not edit
  js/
    departmentApi.js  every request to /departments
    employeeApi.js    every request to /employees
    helpers.js        small shared utilities
    listDepartments.js, listEmployees.js     paint the tables and handle delete
    newDepartment.js, newEmployee.js         modals, create and edit
```

The API files only talk to the server. The other files only touch the DOM. Dependencies go in one direction (pages import the lists, lists import the API, the API imports nothing), which avoids circular imports.

## Decisions worth mentioning

**Employees and departments are separate collections.** Each employee stores a `departmentId` and the department is never nested inside it. json-server joins them on request: `/departments?_embed=employees` gives the count per department and `/employees?_expand=department` gives each employee's department name.

**Types matter for the relation.** Form fields always return text, and json-server compares ids strictly, so `"1"` does not match `1`. `departmentId` and `age` are converted to numbers before saving. The cellphone stays as text on purpose.

**The API layer throws, the UI catches.** Request functions check `response.ok` and throw, since `fetch` only fails on network errors. The modal or table decides what to show, so a failed save never closes the modal as if it had worked.

**`PATCH` instead of `PUT` for edits.** Only the fields sent are changed, so a field the form does not include is never wiped.

**One listener per table.** Rows are recreated on every repaint, so listeners on the buttons would be lost. A single listener on the table body uses `closest()` and `data-action` to find the button that was clicked.

**The select is filled before it gets a value.** When editing, the department options are loaded first and only then is the employee's department assigned. Doing it the other way around leaves the select empty.

**User text goes in with `textContent`.** Names and descriptions are never inserted as HTML, so a value like `<img onerror=...>` is displayed as text.

**The modals live in the HTML.** They are hidden with Tailwind's `hidden` class and JavaScript only toggles it. It keeps the markup readable and the styling in one place.

## Limitations

- json-server is a development tool. There is no authentication, validation on the server or real database.
- Referential integrity is only enforced in the interface. Editing `db.json` by hand can leave employees pointing to a department that no longer exists, and the table shows them as "No department".
- No pagination, search or sorting yet.
- The app needs the API running. A static host alone, such as GitHub Pages, will show the error state.

## Roadmap

- Search and filter employees by department.
- Replace the native `confirm()` with a styled confirmation modal.
- Field-level validation messages under each input.

## Credits

Built by [softXcruz](https://github.com/softXcruz). The data in `db.json` is fictional.
