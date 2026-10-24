// Function to show alert
export function showAlert(msg) {
    // Create alert
    const alert = document.querySelector(".bg-red-100");

    // Add classes and html
    if(!alert) {
        const alert = document.createElement("P");
        alert.classList = "fixed top-5 right-5 z-50 flex items-center gap-3 p-4 w-64 bg-red-50 border border-red-200 text-red-800 rounded-xl shadow-xl";

        alert.innerHTML = 
        `
        <svg class="w-5 h-5 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
        </svg>
        <div>
            <strong class="font-semibold block text-red-900">Error</strong>
            <span class="text-sm">${msg}</span>
        </div>
        `;

        // Append on the body
        document.querySelector("body").appendChild(alert);
        // Time out 3.5s
        setTimeout(() => {
            alert.remove();
        }, 3500);
    }
}