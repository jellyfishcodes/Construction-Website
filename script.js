document.addEventListener('DOMContentLoaded', () => {
    // Step 1: Define our "database" of rough estimates based on industry averages
    const pricingData = {
        kitchen: {
            basic: "$15,000 - $25,000",
            full: "$35,000 - $60,000",
            luxury: "$75,000+"
        },
        bath: {
            basic: "$8,000 - $15,000",
            full: "$20,000 - $35,000",
            luxury: "$45,000+"
        },
        deck: {
            basic: "$5,000 - $12,000",
            full: "$15,000 - $28,000",
            luxury: "$35,000+"
        }
    };

    // Step 2: Grab the HTML elements we need to interact with
    const typeRadios = document.querySelectorAll('input[name="project_type"]');
    const scopeSelect = document.getElementById('project_scope');
    const priceOutput = document.getElementById('estimate-output');

    // Step 3: Function to calculate and update the UI
    function updateEstimate() {
        // Find which radio button is currently checked
        const selectedType = document.querySelector('input[name="project_type"]:checked').value;
        // Find the value of the dropdown
        const selectedScope = scopeSelect.value;

        // Look up the price string from our object above
        const newPrice = pricingData[selectedType][selectedScope];

        // Add a quick little fade animation so it feels instant but smooth
        priceOutput.style.opacity = 0;
        setTimeout(() => {
            priceOutput.textContent = newPrice;
            priceOutput.style.opacity = 1;
        }, 200); // 200ms matches a nice CSS transition
    }

    // Apply a transition property to the output for the fade effect
    priceOutput.style.transition = "opacity 0.2s ease-in-out";

    // Step 4: Listen for clicks/changes and run the update function
    typeRadios.forEach(radio => {
        radio.addEventListener('change', updateEstimate);
    });
    
    scopeSelect.addEventListener('change', updateEstimate);
    
    // Prevent default form submission just for the demo
    document.getElementById('estimator-form').addEventListener('submit', function(e) {
        e.preventDefault();
        alert("Thanks! Your estimate request and details have been sent to Apex Builders.");
    });
});