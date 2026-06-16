document.addEventListener('DOMContentLoaded', () => {
    // 1. Pricing database
    const pricingData = {
        kitchen: {
            basic: "₹1,50,000 - ₹2,50,000",  // Cosmetic / Modular modular units
            full: "₹3,50,000 - ₹6,00,000",   // Full remodel, counter tops, chimney & plumbing
            luxury: "₹7,50,000+"             // Premium Italian finishes, built-in appliances
        },
        bath: {
            basic: "₹80,000 - ₹1,50,000",    // Quick sanitaryware update, basic tiling
            full: "₹2,00,000 - ₹3,50,000",   // Complete waterproof tiling, premium fixtures & shower
            luxury: "₹5,00,000+"             // Luxury stone cladding, custom vanity & glass enclosures
        },
        deck: {
            basic: "₹50,000 - ₹1,00,000",    // Basic terrace tiling / balcony wooden floor
            full: "₹1,50,000 - ₹3,00,000",   // Quality weather-resistant composite decking & pergola
            luxury: "₹4,50,000+"             // Large custom outdoor terrace deck with lighting & sit-outs
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