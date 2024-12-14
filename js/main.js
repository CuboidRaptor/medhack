// Check for Notification permission
if (Notification.permission !== "granted") {
    Notification.requestPermission();
}

var medications;
if (localStorage.getItem("data") === null) {
    medications = [];
}
else {
    medications = JSON.parse(localStorage.getItem("data"));
}
displayMedications();
console.log(medications);

// Handle adding medication
document.getElementById("add-medication-btn").addEventListener("click", function() {
    const medicationName = document.getElementById("medication-name").value;
    const dose = document.getElementById("dose").value;
    const frequency = document.getElementById("frequency").value;
    const duration = document.getElementById("duration").value;
    const extraInstructions = document.getElementById("extra-instructions").value;
    const reminderTime = document.getElementById("reminder-time").value;

    ["medication-name", "dose", "frequency", "duration", "extra-instructions", "reminder-time"].forEach(
        (element) => {document.getElementById(element).value = "";}
    )

    if (!medicationName || !dose || !frequency || !duration || !reminderTime) {
        alert("Please fill in all required fields.");
        return;
    }

    const medication = {
        name: medicationName,
        dose: dose,
        frequency: frequency,
        duration: duration,
        instructions: extraInstructions,
        reminderTime: reminderTime,
    };

    medications.push(medication);
    displayMedications();
    setReminder(medication);
});

// Display the medications
function displayMedications() {
    const medicationsList = document.getElementById("medications-list");
    medicationsList.innerHTML = "";

    medications.forEach((med, index) => {
        const medBox = document.createElement("div");
        medBox.classList.add("medication");
        medBox.classList.add("medication-box");
        medBox.innerHTML = `
            <strong>${med.name}</strong> <br>
            Dosage: ${med.dose} <br>
            Frequency: ${med.frequency} <br>
            Duration: ${med.duration} <br>
            Instructions: ${med.instructions || "None"} <br>
            Reminder Time: ${med.reminderTime} <br>
            <button class="btn" onclick="removeMedication(${index})">Remove</button>
        `;
        medicationsList.appendChild(medBox);
    });

    // store medications
    localStorage.setItem("data", JSON.stringify(medications));
}

// Remove medication
function removeMedication(index) {
    medications.splice(index, 1);
    displayMedications();
}

// Set reminders (5 minutes before reminder time)
function setReminder(medication) {
    const reminderTime = medication.reminderTime;
    const [hours, minutes] = reminderTime.split(":");
    const reminderDate = new Date();
    reminderDate.setHours(hours, minutes, 0, 0);
    
    // Set reminder for 5 minutes before
    const reminderTimeInMillis = reminderDate.getTime() - 5 * 60 * 1000;

    // Create a notification
    if (reminderTimeInMillis - Date.now() < 0) {
        console.log("time in past, skipped");
    }
    else {
        setTimeout(() => {
            if (Notification.permission === "granted") {
                new Notification(`Reminder: Time to take your medication: ${medication.name}`, {
                    body: `${medication.dose} - ${medication.instructions}`
                });
            }
        }, reminderTimeInMillis - Date.now());
    }
}