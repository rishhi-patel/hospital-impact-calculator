// 📄 main.js (Enhanced with Better Multi-Select Handling)

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("impactForm")
  const resultsDiv = document.getElementById("results")
  const calculateBtn = document.getElementById("calculateImpact")
  const surgicalServicesSelect = document.getElementById("surgicalServices")

  // Enhance Multi-Select Dropdown UI
  surgicalServicesSelect.addEventListener("click", (event) => {
    event.stopPropagation() // Prevent dropdown from closing on click
  })

  calculateBtn.addEventListener("click", () => {
    // Show loading animation
    showLoading(calculateBtn)

    setTimeout(() => {
      // Simulated Static Calculation
      const blockEstimate = "1,631"
      const blockReduction = "97"
      const caseVolume = "1,034"
      const financialImpact = "$1,777,816 per year"

      // Fetch selected services
      const selectedServices = Array.from(
        surgicalServicesSelect.selectedOptions
      )
        .map((option) => option.value)
        .join(", ")

      // Insert values into the results section
      document.getElementById("blockEstimate").textContent = blockEstimate
      document.getElementById("blockReduction").textContent = blockReduction
      document.getElementById("caseVolume").textContent = caseVolume
      document.getElementById("financialImpact").textContent = financialImpact

      // Hide loading animation
      hideLoading(calculateBtn, "Calculate Impact")

      // Show results section with fade-in animation
      resultsDiv.classList.remove("hidden")
      resultsDiv.classList.add("fade-in")
    }, 2000)
  })
})

function showLoading(button) {
  button.disabled = true
  button.innerHTML = `<span class='loader'></span> Calculating...`
}

function hideLoading(button, text) {
  button.disabled = false
  button.innerHTML = text
}

// Adding smooth animations & improved styling
document.head.insertAdjacentHTML(
  "beforeend",
  `
    <style>
        .fade-in {
            opacity: 0;
            animation: fadeIn 0.5s ease-in forwards;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .loader {
            display: inline-block;
            width: 12px;
            height: 12px;
            border: 2px solid white;
            border-radius: 50%;
            border-top-color: transparent;
            animation: spin 0.8s linear infinite;
            margin-right: 5px;
        }

        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
    </style>
`
)
