// Grab DOM elements
const planForm = document.getElementById('planForm');
const destinationInput = document.getElementById('destinationInput');
const dateInput = document.getElementById('dateInput');
const notesInput = document.getElementById('notesInput');
const planIndex = document.getElementById('planIndex');
const planList = document.getElementById('planList');
const formTitle = document.getElementById('formTitle');
const cancelBtn = document.getElementById('cancelBtn');

// Load saved plans from Local Storage when page loads
document.addEventListener('DOMContentLoaded', displayPlans);

// Handle Create and Update (Form Submit)
planForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const destination = destinationInput.value.trim();
    const date = dateInput.value;
    const notes = notesInput.value.trim();
    const index = planIndex.value;

    if (!destination || !date || !notes) {
        alert("Please fill in all fields.");
        return;
    }

    let plans = JSON.parse(localStorage.getItem('jomjalan_plans')) || [];

    if (index === "") {
        // CREATE: Add new plan object
        plans.push({ destination, date, notes });
    } else {
        // UPDATE: Modify existing plan object
        plans[index] = { destination, date, notes };
        resetForm();
    }

    // Save back to Local Storage
    localStorage.setItem('jomjalan_plans', JSON.stringify(plans));

    // Reset form and refresh display
    planForm.reset();
    displayPlans();
});

// READ: Display plans from Local Storage
function displayPlans() {
    let plans = JSON.parse(localStorage.getItem('jomjalan_plans')) || [];
    planList.innerHTML = "";

    if (plans.length === 0) {
        planList.innerHTML = "<p style='color: #666;'>No travel plans saved yet.</p>";
        return;
    }

    plans.forEach((plan, idx) => {
        const li = document.createElement('li');
        li.style.cssText = "background: #f9f9f9; border: 1px solid #ddd; padding: 12px; margin-bottom: 10px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;";
        
        li.innerHTML = `
            <div>
                <strong>📍 ${plan.destination}</strong> (${plan.date})<br>
                <small>${plan.notes}</small>
            </div>
            <div>
                <button onclick="editPlan(${idx})" style="background-color: #ffc107; color: #000; margin-right: 5px; padding: 5px 10px;">Edit</button>
                <button onclick="deletePlan(${idx})" style="background-color: #dc3545; padding: 5px 10px;">Delete</button>
            </div>
        `;
        planList.appendChild(li);
    });
}

// UPDATE: Load plan data into form for editing
window.editPlan = function(idx) {
    let plans = JSON.parse(localStorage.getItem('jomjalan_plans')) || [];
    const plan = plans[idx];

    destinationInput.value = plan.destination;
    dateInput.value = plan.date;
    notesInput.value = plan.notes;
    planIndex.value = idx;

    formTitle.innerText = "Edit Travel Plan";
    cancelBtn.style.display = "inline-block";
}

// Cancel Edit Mode
cancelBtn.addEventListener('click', () => {
    resetForm();
    planForm.reset();
});

function resetForm() {
    planIndex.value = "";
    formTitle.innerText = "Create New Travel Plan";
    cancelBtn.style.display = "none";
}

// DELETE: Remove plan from Local Storage
window.deletePlan = function(idx) {
    if (confirm("Are you sure you want to delete this travel plan?")) {
        let plans = JSON.parse(localStorage.getItem('jomjalan_plans')) || [];
        plans.splice(idx, 1);
        localStorage.setItem('jomjalan_plans', JSON.stringify(plans));
        displayPlans();
        resetForm();
    }
}