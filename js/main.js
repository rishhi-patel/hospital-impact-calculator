document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("impactForm")
  const resultsDiv = document.getElementById("results")
  const calculateBtn = document.getElementById("calculateImpact")

  calculateBtn.addEventListener("click", () => {
    showLoading(calculateBtn)

    setTimeout(() => {
      // Get user selections
      const surgicalType = document.getElementById("surgicalType").value
      const blockDuration =
        parseInt(document.getElementById("blockDuration").value) || 1
      const selectedServices = Array.from(
        document.getElementById("surgicalServices").selectedOptions
      ).map((opt) => opt.value)
      const costPerBlock =
        parseInt(document.getElementById("costRevenue").value) || 2000

      // Define base values for each surgical type
      const baseData = {
        cardiac: { caseVolume: 1800, estimatedBlocks: 356 },
        orthopedic: { caseVolume: 2200, estimatedBlocks: 412 },
        neurology: { caseVolume: 1500, estimatedBlocks: 290 },
      }

      const { caseVolume, estimatedBlocks } = baseData[surgicalType]

      // Define impact per selected service
      const serviceImpacts = {
        planning_accuracy: { volumeIncrease: 11, blocksReduced: 2 },
        flow_smoothing: { volumeIncrease: 15, blocksReduced: 3 },
        priority_planning: { volumeIncrease: 55, blocksReduced: 11 },
      }

      let totalVolumeIncrease = 0
      let totalBlocksReduced = 0
      let costSavings = 0

      selectedServices.forEach((service) => {
        if (serviceImpacts[service]) {
          totalVolumeIncrease += serviceImpacts[service].volumeIncrease
          totalBlocksReduced += serviceImpacts[service].blocksReduced
          costSavings += serviceImpacts[service].blocksReduced * costPerBlock
        }
      })

      // Calculate potential values
      const potentialVolume = caseVolume + totalVolumeIncrease
      const potentialBlocks = estimatedBlocks - totalBlocksReduced

      // Update results UI
      resultsDiv.innerHTML = `
              <h3 class='text-lg font-semibold'>Your Hospital’s Performance Impact</h3>
              <table class='w-full border-collapse border border-gray-300 mt-2'>
                  <thead>
                      <tr class='bg-gray-200'>
                          <th class='border p-2'>Case Volume</th>
                          <th class='border p-2'>Estimated Blocks</th>
                          <th class='border p-2'>Cost Savings</th>
                      </tr>
                  </thead>
                  <tbody>
                      <tr>
                          <td class='border p-2'>${caseVolume}</td>
                          <td class='border p-2'>${estimatedBlocks}</td>
                          <td class='border p-2'>-</td>
                      </tr>
                      <tr class='bg-green-100 font-semibold'>
                          <td class='border p-2'>${potentialVolume}</td>
                          <td class='border p-2'>${potentialBlocks}</td>
                          <td class='border p-2'>\$${costSavings.toLocaleString()}</td>
                      </tr>
                  </tbody>
              </table>

              <h4 class='text-md font-semibold mt-4'>Potential Bucket Breakdown</h4>
              <table class='w-full border-collapse border border-gray-300 mt-2'>
                  <thead>
                      <tr class='bg-gray-200'>
                          <th class='border p-2'>Category</th>
                          <th class='border p-2'>Volume Increase</th>
                          <th class='border p-2'>Blocks Reduced</th>
                          <th class='border p-2'>Cost Savings</th>
                      </tr>
                  </thead>
                  <tbody>
                      ${selectedServices
                        .map(
                          (service) => `
                          <tr>
                              <td class='border p-2'>${service.replace(
                                "_",
                                " "
                              )}</td>
                              <td class='border p-2'>${
                                serviceImpacts[service].volumeIncrease
                              }</td>
                              <td class='border p-2'>${
                                serviceImpacts[service].blocksReduced
                              }</td>
                              <td class='border p-2'>\$${(
                                serviceImpacts[service].blocksReduced *
                                costPerBlock
                              ).toLocaleString()}</td>
                          </tr>
                      `
                        )
                        .join("")}
                  </tbody>
              </table>

              <!-- Email Section -->
              <div id="emailSection" class="mt-4 p-4 bg-gray-50 border rounded fade-in">
                  <h3 class="text-lg font-semibold">Enter your email for a detailed breakdown</h3>
                  <input type="email" id="userEmail" placeholder="Enter your email" class="w-full p-2 border rounded mt-2">
                  <button id="submitEmail" class="w-full bg-green-600 text-white p-2 rounded mt-2">Submit</button>
                  <p id="emailError" class="text-red-500 text-sm mt-2 hidden">Please enter a valid email address.</p>
              </div>
          `

      resultsDiv.classList.remove("hidden")
      hideLoading(calculateBtn, "Calculate Impact")

      // Attach email submission event listener
      document
        .getElementById("submitEmail")
        .addEventListener("click", handleEmailSubmission)
    }, 2000)
  })
})

// Email submission handler
function handleEmailSubmission() {
  const emailInput = document.getElementById("userEmail").value.trim()
  const emailError = document.getElementById("emailError")

  if (validateEmail(emailInput)) {
    emailError.classList.add("hidden")
    showPersonalizedReport()
  } else {
    emailError.classList.remove("hidden")
  }
}

// ✅ Corrected Email Validation Function
function validateEmail(email) {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
}

// Show Personalized Report after email submission
function showPersonalizedReport() {
  document.getElementById("emailSection").remove()
  const personalizedReport = document.createElement("div")
  personalizedReport.id = "personalizedReport"
  personalizedReport.classList = "mt-4 p-4 bg-gray-50 border rounded fade-in"
  personalizedReport.innerHTML = `
      <h3 class='text-lg font-semibold'>Your Personalized Report</h3>
      <p>Based on your selected services and hospital type, we've compiled additional insights for cost savings and efficiency improvements.</p>
      <ul class='list-disc ml-6 mt-2'>
          <li>Advanced Planning: +10% efficiency</li>
          <li>Cost Reductions: Estimated savings of \$${Math.floor(
            Math.random() * 50000
          ).toLocaleString()}</li>
          <li>Optimized Resource Utilization: Improved scheduling reduces blocks</li>
      </ul>
  `

  document.getElementById("results").appendChild(personalizedReport)
}

// Loading functions
function showLoading(button) {
  button.disabled = true
  button.innerHTML = `<span class='loader'></span> Calculating...`
}

function hideLoading(button, text) {
  button.disabled = false
  button.innerHTML = text
}
