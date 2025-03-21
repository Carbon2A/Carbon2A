document.addEventListener("DOMContentLoaded", () => {
    // Select elements
    const materialDropdown = document.getElementById("material");
    const gradeDropdown = document.getElementById("grade");
    const unitDropdown = document.getElementById("unit");
    const quantityInput = document.getElementById("quantity");
    const addButton = document.getElementById("add-material");
    const materialsList = document.getElementById("material-items");
    const calculateButton = document.getElementById("calculate");
    const resultDiv = document.getElementById("result");

    let materials = [];

    // Grade options based on material selection
    const gradeOptions = {
        "Cement": ["OPC 33", "OPC 43", "OPC 53", "PPC", "PSC"],
        "Steel": ["Fe 415", "Fe 500", "Fe 550", "Fe 600"],
        "Sand": ["River Sand", "M-Sand"],
        "Bricks": ["Clay Bricks", "Fly Ash Bricks", "AAC Blocks"]
    };

    // Unit options based on material selection
    const unitOptions = {
        "Cement": "kg",
        "Steel": "kg",
        "Sand": "m³",
        "Bricks": "Numbers"
    };

    // Correct Emission Factors
    const emissionFactors = {
        "Cement": {
            "OPC 33": 0.9, "OPC 43": 0.9, "OPC 53": 0.9,
            "PPC": 0.7, "PSC": 0.6
        },
        "Steel": {
            "Fe 415": 2.55, "Fe 500": 2.55, "Fe 550": 2.55, "Fe 600": 2.55
        },
        "Sand": {
            "River Sand": 12.16, "M-Sand": 14.7
        },
        "Bricks": {
            "Clay Bricks": 0.28, "Fly Ash Bricks": 0.08, "AAC Blocks": 0.07
        }
    };

    // Update dropdowns dynamically when material is selected
    materialDropdown.addEventListener("change", () => {
        const selectedMaterial = materialDropdown.value;

        // Update grade dropdown
        gradeDropdown.innerHTML = `<option value="" disabled selected>Select Grade</option>`;
        if (gradeOptions[selectedMaterial]) {
            gradeOptions[selectedMaterial].forEach(grade => {
                let option = document.createElement("option");
                option.value = grade;
                option.textContent = grade;
                gradeDropdown.appendChild(option);
            });
            gradeDropdown.disabled = false;
        } else {
            gradeDropdown.disabled = true;
        }

        // Set unit dropdown
        unitDropdown.innerHTML = `<option value="${unitOptions[selectedMaterial]}" selected>${unitOptions[selectedMaterial]}</option>`;
        unitDropdown.disabled = false;
        quantityInput.disabled = false;
    });

    // Function to update material list UI
    function updateMaterialList() {
        materialsList.innerHTML = ""; // Clear the list before updating

        materials.forEach((item, index) => {
            const listItem = document.createElement("li");
            listItem.classList.add("material-item"); // Styled list items
            listItem.innerHTML = `
                <span>${item.material} (${item.grade}) - ${item.quantity} ${item.unit}</span>
                <button class="delete-btn" onclick="removeMaterial(${index})">✖</button>
            `;
            materialsList.appendChild(listItem);
        });
    }

    // Function to add material
    addButton.addEventListener("click", () => {
        const material = materialDropdown.value;
        const grade = gradeDropdown.value;
        const unit = unitDropdown.value;
        const quantity = parseFloat(quantityInput.value);

        if (material && grade && quantity > 0) {
            materials.push({ material, grade, quantity, unit });
            updateMaterialList(); // Refresh UI
            quantityInput.value = ""; // Clear input after adding
        } else {
            alert("Please select all fields and enter a valid quantity.");
        }
    });

    // Function to remove material
    window.removeMaterial = (index) => {
        materials.splice(index, 1);
        updateMaterialList();
    };

    // Function to calculate carbon footprint (Ensuring output is in kg CO₂)
    calculateButton.addEventListener("click", () => {
        if (materials.length === 0) {
            alert("Please add at least one material.");
            return;
        }

        let totalCarbon = 0;

        materials.forEach(item => {
            if (emissionFactors[item.material] && emissionFactors[item.material][item.grade]) {
                totalCarbon += item.quantity * emissionFactors[item.material][item.grade];
            } else {
                console.warn(`No emission factor found for ${item.material} (${item.grade})`);
            }
        });

        // Styled output
        resultDiv.innerHTML = `<h3 class="result-text">Total Carbon Footprint: <span>${totalCarbon.toFixed(2)} kg CO₂</span></h3>`;
    });
});
