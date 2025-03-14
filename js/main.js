const serviceSelect = document.getElementById("surgicalServices")

document.addEventListener("DOMContentLoaded", () => {
  const resultsDiv = document.getElementById("results")
  const emailSection = document.createElement("div")
  emailSection.id = "emailSection"
  emailSection.classList.add("hidden")
  resultsDiv.parentNode.appendChild(emailSection)

  const serviceVolumeContainer = document.createElement("div")
  serviceVolumeContainer.id = "serviceVolumeContainer"
  serviceSelect.parentNode.insertBefore(
    serviceVolumeContainer,
    serviceSelect.nextSibling
  )

  const calculateBtn = document.getElementById("calculateImpact")

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

    const hospitalType = document.getElementById("hospitalType").value
    const blockDuration =
      parseInt(document.getElementById("blockDuration").value) || 480
    const costRate = parseInt(document.getElementById("costRate").value) || 40
    const quartileInit = document.getElementById("quartileInit").value
    const quartileTarget = document.getElementById("quartileTarget").value

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
            : 1000,
        }
      }
    )

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
    const apiUrl = "https://hospital-impact-api.vercel.app/calculate-impact"

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) throw new Error("API request failed")

      const responseData = await response.json()
      displayInitialSummary(responseData.data)
      hideLoading(calculateBtn, "Calculate Impact")
    } catch (error) {
      console.error("API Error:", error)
      alert(
        "An error occurred while processing your request. Please try again later."
      )
      hideLoading(calculateBtn, "Calculate Impact")
    }
  })
})

//  Function to display initial summary using real API data
function displayInitialSummary(data) {
  const resultsDiv = document.getElementById("results")
  resultsDiv.innerHTML = `
      <h3 class='text-lg font-semibold'>Your Hospital's Performance Impact</h3>
      <div class="bg-gray-100 p-4 border rounded mt-2">
          <p>🔹 <strong>Total Surgical Blocks Estimate:</strong> You have an estimated <strong>${Object.values(
            data
          ).reduce(
            (sum, service) => sum + service.blocks,
            0
          )}</strong> blocks based on your services.</p>
          <p>🔹 <strong>Potential Block Reduction:</strong> By improving efficiency, you could reduce this total by <strong>${Object.values(
            data
          ).reduce(
            (sum, service) => sum + (service.blocks - service.potentialBlocks),
            0
          )}</strong> blocks.</p>
          <p>🔹 <strong>Projected Case Volume Increase:</strong> You could perform an additional <strong>${Object.values(
            data
          ).reduce(
            (sum, service) =>
              sum + (service.potentialCaseVolume - service.caseVolume),
            0
          )}</strong> cases per year.</p>
          <p>🔹 <strong>Financial Impact (Cost Savings or Revenue Increase):</strong> With improved performance, your potential $ impact is <strong>$${Object.values(
            data
          )
            .reduce((sum, service) => sum + service.potentialCostSaved, 0)
            .toLocaleString()}</strong> per year.</p>
          <p>💡 These improvements come from key factors such as Planning Accuracy, Flow Smoothing, and Priority Planning.</p>
      </div>
  `

  resultsDiv.classList.remove("hidden")
  displayEmailSection(data)
}

//  Function to show email input section
function displayEmailSection(apiData) {
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
    .addEventListener("click", () => validateEmail(apiData))
}

//  Function to validate email before unlocking detailed report
function validateEmail(apiData) {
  const emailInput = document.getElementById("emailInput").value.trim()
  const emailError = document.getElementById("emailError")
  const emailSection = document.getElementById("emailSection")

  if (!emailInput || !/^\S+@\S+\.\S+$/.test(emailInput)) {
    emailError.classList.remove("hidden")
    return
  }

  emailError.classList.add("hidden")

  //  Hide email section after successful validation
  emailSection.classList.add("hidden")

  displayDetailedReport(apiData)
}

//  Function to display detailed report using Figma layout
function displayDetailedReport(apiData) {
  const resultsDiv = document.getElementById("results")
  resultsDiv.innerHTML += `<h3 class='text-lg font-semibold mt-4'>Your Personalized Report</h3>`

  Object.entries(apiData).forEach(([service, values]) => {
    resultsDiv.innerHTML += `
          <div class="mt-4 p-4 bg-gray-50 border rounded shadow">
              <h4 class="text-md font-semibold mb-2">Chart for ${service}</h4>
              <div class="chart-container" style="position: relative; height: 300px; width: 100%;">
                  <canvas id="chart_${service.replace(/\s+/g, "_")}"></canvas>
              </div>
              <div class="bg-white p-3 mt-2 border rounded">
                  <p>ℹ️ <strong>This is an explanation that will open up once the user hovers over the icon.</strong></p>
              </div>
          </div>
      `
  })

  //  Generate charts dynamically
  setTimeout(() => {
    Object.entries(apiData).forEach(([service, values]) => {
      const ctx = document
        .getElementById(`chart_${service.replace(/\s+/g, "_")}`)
        .getContext("2d")

      if (!ctx) {
        console.error(`Chart canvas not found for ${service}!`)
        return
      }

      new Chart(ctx, {
        type: "bar",
        data: {
          labels: values.potentialByBucket.map((bucket) => bucket.bucketName),
          datasets: [
            {
              label: "Volume Increase",
              data: values.potentialByBucket.map(
                (bucket) => bucket.volumeIncreased
              ),
              backgroundColor: "rgba(54, 162, 235, 0.6)",
              yAxisID: "y-left",
            },
            {
              label: "Blocks Reduced",
              data: values.potentialByBucket.map(
                (bucket) => bucket.blocksReduced
              ),
              backgroundColor: "rgba(75, 192, 192, 0.6)",
              yAxisID: "y-left",
            },
            {
              label: "Cost Savings ($)",
              data: values.potentialByBucket.map((bucket) => bucket.costSaved),
              backgroundColor: "rgba(255, 99, 132, 0.6)",
              yAxisID: "y-right",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            "y-left": {
              position: "left",
              beginAtZero: true,
              title: {
                display: true,
                text: "Volume & Blocks",
              },
            },
            "y-right": {
              position: "right",
              beginAtZero: true,
              title: {
                display: true,
                text: "Cost Savings ($)",
              },
              grid: {
                drawOnChartArea: false,
              },
            },
          },
        },
      })
    })
  }, 500)
}

//  Show Loading State
function showLoading(button) {
  button.disabled = true
  button.innerHTML = `<span class='loader'></span> Calculating...`
}

//  Hide Loading State
function hideLoading(button, text) {
  button.disabled = false
  button.innerHTML = text
}
