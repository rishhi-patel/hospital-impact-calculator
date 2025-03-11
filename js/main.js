// 📄 main.js (Optimized for Embedding & Performance)

document.addEventListener("DOMContentLoaded", () => {
  const calculateBtn = document.getElementById("calculateImpact")

  calculateBtn.addEventListener("click", () => {
    showLoading(calculateBtn)

    setTimeout(() => {
      updateResults()
      hideLoading(calculateBtn, "Calculate Impact")
      showEmailInput()
    }, 1500) // Optimized delay for performance
  })
})

function updateResults() {
  const resultsDiv = document.getElementById("results")
  resultsDiv.innerHTML = `
        <h3 class='text-lg font-semibold'>Your Hospital’s Performance Impact</h3>
        <ul class='list-disc ml-6 mt-2'>
            <li>Total Surgical Blocks Estimate: <strong>1,631</strong></li>
            <li>Potential Block Reduction: <strong>97</strong></li>
            <li>Projected Case Volume Increase: <strong>1,034</strong></li>
            <li>Financial Impact: <strong>$1,777,816 per year</strong></li>
        </ul>
    `
  resultsDiv.classList.remove("hidden")
  resultsDiv.classList.add("fade-in")
}

function showEmailInput() {
  const emailSection = document.createElement("div")
  emailSection.id = "emailSection"
  emailSection.classList = "mt-4 p-4 bg-gray-50 border rounded fade-in"
  emailSection.innerHTML = `
        <h3 class='text-lg font-semibold'>Enter your email for a personalized report</h3>
        <input type='email' id='userEmail' placeholder='Enter your email' class='w-full p-2 border rounded mt-2'>
        <button id='submitEmail' class='w-full bg-green-600 text-white p-2 rounded mt-2'>Submit</button>
    `
  document.getElementById("results").appendChild(emailSection)
  document
    .getElementById("submitEmail")
    .addEventListener("click", handleEmailSubmission)
}

function handleEmailSubmission() {
  const emailInput = document.getElementById("userEmail").value.trim()
  if (validateEmail(emailInput)) {
    showPersonalizedReport()
  } else {
    alert("Please enter a valid email address.")
  }
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function showPersonalizedReport() {
  document.getElementById("emailSection").remove()
  const personalizedReport = document.createElement("div")
  personalizedReport.id = "personalizedReport"
  personalizedReport.classList = "mt-4 p-4 bg-gray-50 border rounded fade-in"
  personalizedReport.innerHTML = `
        <h3 class='text-lg font-semibold'>Your Personalized Report</h3>
        <ul class='list-disc ml-6 mt-2'>
            <li>Service 1: Efficiency increased by <strong>10%</strong></li>
            <li>Service 2: Cost savings estimated at <strong>$50,000</strong></li>
            <li>Service 3: Patient throughput improved by <strong>8%</strong></li>
        </ul>
    `
  document.getElementById("results").appendChild(personalizedReport)
}

function showLoading(button) {
  button.disabled = true
  button.innerHTML = `<span class='loader'></span> Calculating...`
}

function hideLoading(button, text) {
  button.disabled = false
  button.innerHTML = text
}

// Inject necessary styles dynamically for embedding
document.head.insertAdjacentHTML(
  "beforeend",
  `
    <style>
        .fade-in { opacity: 0; animation: fadeIn 0.5s ease-in forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .loader { display: inline-block; width: 12px; height: 12px; border: 2px solid white; border-radius: 50%; border-top-color: transparent; animation: spin 0.8s linear infinite; margin-right: 5px; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    </style>
`
)
