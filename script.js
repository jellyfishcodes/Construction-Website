document.addEventListener('DOMContentLoaded', () => {
    // 1. Pricing database
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

    const typeRadios = document.querySelectorAll('input[name="project_type"]');
    const scopeSelect = document.getElementById('project_scope');
    const priceOutput = document.getElementById('estimate-output');
    const estimatorForm = document.getElementById('estimator-form');
    const submitBtn = document.getElementById('submit-btn');

    // Apply a transition property to the output for the fade effect
    priceOutput.style.transition = "opacity 0.2s ease-in-out";

    // Update the estimate display
    function updateEstimate() {
        const selectedType = document.querySelector('input[name="project_type"]:checked').value;
        const selectedScope = scopeSelect.value;
        const newPrice = pricingData[selectedType][selectedScope];

        priceOutput.style.opacity = 0;
        setTimeout(() => {
            priceOutput.textContent = newPrice;
            priceOutput.style.opacity = 1;
        }, 200);
    }

    typeRadios.forEach(radio => {
        radio.addEventListener('change', updateEstimate);
    });
    
    scopeSelect.addEventListener('change', updateEstimate);

    // 2. Web3Forms AJAX Submission
    estimatorForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Stop standard page reload

        // Change button state to "Sending..." and disable it
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending...";
        submitBtn.style.opacity = "0.7";

        // Gather all form fields
        const formData = new FormData(estimatorForm);
        
        // Append the calculated estimate to the payload explicitly
        formData.append("Calculated Estimate", priceOutput.textContent);

        // Convert FormData to JSON for clean API delivery
        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);

        // POST to Web3Forms Endpoint
        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: json
        })
        .then(async (response) => {
            let res = await response.json();
            
            if (response.status === 200) {
                // Set a clean, standard height for the success card to match the map on the right
                estimatorForm.style.minHeight = "380px";

                // Display the beautiful thank you card
                const clientName = document.getElementById('name').value;
                const cleanFirstName = clientName.split(' ')[0]; // Grab just the first name
                
                estimatorForm.innerHTML = `
                    <div class="form-success-card">
                        <div class="success-icon-wrapper">
                            <svg viewBox="0 0 24 24">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>
                        <h3>Thank You, ${cleanFirstName}!</h3>
                        <p>We have successfully received your project scope and details. Our team is reviewing the specifications and will call you within 24 business hours to discuss your quote.</p>
                        <div class="success-metadata">Apex Builders • Family-Owned Since 2012</div>
                    </div>
                `;

                // Smoothly scroll the window back to the top of the contact section
                document.getElementById('contact').scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            } else {
                // Handle failure response from Web3Forms
                alert(res.message || "Something went wrong. Please try again.");
                resetSubmitButton();
            }
        })
        .catch(error => {
            // Handle network/connection failure
            alert("Network error. Please check your connection and try again.");
            resetSubmitButton();
        });
    });

    function resetSubmitButton() {
        submitBtn.disabled = false;
        submitBtn.textContent = "Send Details & Schedule Visit";
        submitBtn.style.opacity = "1";
    }
});