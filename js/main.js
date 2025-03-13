document.addEventListener("DOMContentLoaded", () => {
  const resultsDiv = document.getElementById("results")
  const emailSection = document.createElement("div") // Email input section
  emailSection.id = "emailSection"
  emailSection.classList.add("hidden")
  resultsDiv.parentNode.appendChild(emailSection)

  const serviceSelect = document.getElementById("surgicalServices")
  const serviceVolumeContainer = document.createElement("div")
  serviceVolumeContainer.id = "serviceVolumeContainer"
  serviceSelect.parentNode.insertBefore(
    serviceVolumeContainer,
    serviceSelect.nextSibling
  )

  const calculateBtn = document.getElementById("calculateImpact")

  // When services are selected, dynamically generate case volume input fields
  serviceSelect.addEventListener("change", () => {
    serviceVolumeContainer.innerHTML = "" // Clear previous inputs

    Array.from(serviceSelect.selectedOptions).forEach((option) => {
      const serviceName = option.value
      const inputDiv = document.createElement("div")

      inputDiv.innerHTML = `
              <label class="block font-medium mt-2">${serviceName} Case Volume</label>
              <input type="number" id="caseVolume_${serviceName}" class="w-full p-2 border rounded" placeholder="Enter case volume for ${serviceName}" />
          `
      serviceVolumeContainer.appendChild(inputDiv)
    })
  })

  calculateBtn.addEventListener("click", async () => {
    showLoading(calculateBtn)

    // Get user input values
    const hospitalType = document.getElementById("hospitalType").value
    const blockDuration =
      parseInt(document.getElementById("blockDuration").value) || 480
    const costRate = parseInt(document.getElementById("costRate").value) || 40
    const quartileInit = document.getElementById("quartileInit").value
    const quartileTarget = document.getElementById("quartileTarget").value

    // Get selected services and their corresponding case volumes
    const selectedServices = Array.from(serviceSelect.selectedOptions).map(
      (option) => {
        const serviceName = option.value
        const caseVolumeInput = document.getElementById(
          `caseVolume_${serviceName}`
        )
        return {
          serviceName,
          caseVolume: caseVolumeInput
            ? parseInt(caseVolumeInput.value) || 1000
            : 1000, // Default case volume
        }
      }
    )

    // API request payload
    const requestBody = {
      parameters: {
        hospitalType,
        blockDuration,
        costRate,
        quartileInit,
        quartileTarget,
        services: selectedServices,
      },
    }

    // ✅ CORS Proxy Fix for Testing
    const apiUrl = "http://localhost:3000/calculate-impact"

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) throw new Error("API request failed")

      const responseData = await response.json()
      displayInitialSummary(responseData.data)
      hideLoading(calculateBtn, "Calculate Impact")
    } catch (error) {
      console.error("CORS Error:", error)
      alert(
        "CORS issue: Try enabling access at https://cors-anywhere.herokuapp.com/"
      )
      hideLoading(calculateBtn, "Calculate Impact")
    }
  })
})

// ✅ Function to display only the initial summary (matches Figma)
function displayInitialSummary(data) {
  const resultsDiv = document.getElementById("results")
  resultsDiv.innerHTML = `
      <h3 class='text-lg font-semibold'>Your Hospital's Performance Impact</h3>
      <div class='bg-gray-100 p-4 border rounded mt-2'>
          <p>🔹 <strong>Total Surgical Blocks Estimate:</strong> Estimated ${
            data.Cardiac?.blocks || 0
          } blocks based on services.</p>
          <p>🔹 <strong>Potential Block Reduction:</strong> Improving efficiency could reduce this total by ${
            data.Cardiac?.potentialBlocks || 0
          } blocks.</p>
          <p>🔹 <strong>Projected Case Volume Increase:</strong> Additional ${
            data.Cardiac?.potentialCaseVolume - data.Cardiac?.caseVolume || 0
          } cases per year.</p>
          <p>🔹 <strong>Financial Impact:</strong> Estimated cost impact: $${data.Cardiac?.potentialCostSaved.toLocaleString()} per year.</p>
          <p>💡 These improvements come from key factors such as Planning Accuracy, Flow Smoothing, and Priority Planning.</p>
      </div>
  `

  resultsDiv.classList.remove("hidden")
  displayEmailSection()
}

// ✅ Function to show the email input section
function displayEmailSection() {
  const emailSection = document.getElementById("emailSection")
  emailSection.innerHTML = `
      <h3 class='text-lg font-semibold mt-4'>Enter your email to see detailed insights</h3>
      <input type="email" id="emailInput" class="w-full p-2 border rounded mt-2" placeholder="Enter your email">
      <button id="submitEmail" class="w-full bg-green-600 text-white p-2 rounded mt-2">Submit</button>
      <p id="emailError" class="text-red-500 text-sm mt-1 hidden">Please enter a valid email address.</p>
  `

  emailSection.classList.remove("hidden")

  document
    .getElementById("submitEmail")
    .addEventListener("click", validateEmail)
}

// ✅ Function to validate email before unlocking details
function validateEmail() {
  const emailInput = document.getElementById("emailInput").value.trim()
  const emailError = document.getElementById("emailError")

  if (!emailInput || !/^\S+@\S+\.\S+$/.test(emailInput)) {
    emailError.classList.remove("hidden")
    return
  }

  emailError.classList.add("hidden")
  displayDetailedResults()
}

// ✅ Function to display full details after email validation
function displayDetailedResults() {
  const resultsDiv = document.getElementById("results")

  resultsDiv.innerHTML += `
      <h3 class='text-lg font-semibold mt-4'>Detailed Breakdown</h3>
      <table class='w-full border-collapse border border-gray-300 mt-2'>
          <thead>
              <tr class='bg-gray-200'>
                  <th class='border p-2'>Service</th>
                  <th class='border p-2'>Initial Case Volume</th>
                  <th class='border p-2'>Potential Case Volume</th>
                  <th class='border p-2'>Estimated Blocks</th>
                  <th class='border p-2'>Potential Blocks</th>
                  <th class='border p-2'>Cost Savings</th>
              </tr>
          </thead>
          <tbody>
              ${Object.entries(data)
                .map(
                  ([service, details]) => `
                  <tr>
                      <td class='border p-2'>${service}</td>
                      <td class='border p-2'>${details.caseVolume}</td>
                      <td class='border p-2'>${details.potentialCaseVolume}</td>
                      <td class='border p-2'>${details.blocks}</td>
                      <td class='border p-2'>${details.potentialBlocks}</td>
                      <td class='border p-2'>\$${details.potentialCostSaved.toLocaleString()}</td>
                  </tr>
              `
                )
                .join("")}
          </tbody>
      </table>
  `
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
