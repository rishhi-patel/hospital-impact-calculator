// 📄 hubspot.js (Handles static email validation & submission UI behavior)

document.addEventListener("DOMContentLoaded", () => {
  const emailInput = document.createElement("input")
  emailInput.type = "email"
  emailInput.id = "userEmail"
  emailInput.placeholder = "Enter your email to see detailed insights"
  emailInput.classList = "w-full p-2 border rounded mt-4"

  const submitEmailBtn = document.createElement("button")
  submitEmailBtn.textContent = "Submit"
  submitEmailBtn.classList = "w-full bg-green-600 text-white p-2 rounded mt-2"

  const resultsDiv = document.getElementById("results")
  resultsDiv.appendChild(emailInput)
  resultsDiv.appendChild(submitEmailBtn)

  submitEmailBtn.addEventListener("click", () => {
    const email = emailInput.value.trim()

    if (validateEmail(email)) {
      alert("Email submitted successfully! Personalized report unlocked.")
      showPersonalizedReport()
    } else {
      alert("Please enter a valid email address.")
    }
  })
})

function validateEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailPattern.test(email)
}

function showPersonalizedReport() {
  const personalizedReport = document.createElement("div")
  personalizedReport.id = "personalizedReport"
  personalizedReport.classList = "mt-4 p-4 bg-gray-50 border rounded"
  personalizedReport.innerHTML = `
        <h3 class="text-lg font-semibold">Your Personalized Report</h3>
        <p>This report contains static insights based on your selections.</p>
        <ul class="list-disc ml-6 mt-2">
            <li>Service 1: Efficiency increased by 10%</li>
            <li>Service 2: Cost savings estimated at $50,000</li>
            <li>Service 3: Patient throughput improved by 8%</li>
        </ul>
    `

  document.getElementById("results").appendChild(personalizedReport)
}
