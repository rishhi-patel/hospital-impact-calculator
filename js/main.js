// 📄 main.js (Fix ReferenceError & Handle Negative Cost Savings)

document.addEventListener("DOMContentLoaded", () => {
  const resultsDiv = document.getElementById("results") // Ensure resultsDiv is globally accessible
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
      displayResults(responseData.data)
      hideLoading(calculateBtn, "Calculate Impact")
    } catch (error) {
      console.error("Error:", error)
      alert(
        "CORS issue: Try enabling access at https://cors-anywhere.herokuapp.com/"
      )
      hideLoading(calculateBtn, "Calculate Impact")
    }
  })
})

// ✅ Fixed: Function now correctly references `resultsDiv`
function displayResults(data) {
  const resultsDiv = document.getElementById("results") // Ensure resultsDiv is correctly referenced

  resultsDiv.innerHTML = `
      <h3 class='text-lg font-semibold'>Hospital Performance Impact</h3>
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
                      <td class='border p-2 ${
                        details.potentialCostSaved < 0 ? "text-red-600" : ""
                      }'>
                          \$${details.potentialCostSaved.toLocaleString()}
                      </td>
                  </tr>
              `
                )
                .join("")}
          </tbody>
      </table>

      <h4 class='text-md font-semibold mt-4'>Potential Bucket Breakdown</h4>
      <table class='w-full border-collapse border border-gray-300 mt-2'>
          <thead>
              <tr class='bg-gray-200'>
                  <th class='border p-2'>Potential Bucket</th>
                  <th class='border p-2'>Volume Increase</th>
                  <th class='border p-2'>Blocks Reduced</th>
                  <th class='border p-2'>Cost Savings</th>
              </tr>
          </thead>
          <tbody>
              ${Object.entries(data)
                .map(([service, details]) =>
                  details.potentialByBucket
                    .map(
                      (bucket) => `
                      <tr>
                          <td class='border p-2'>${bucket.bucketName}</td>
                          <td class='border p-2'>${bucket.volumeIncreased}</td>
                          <td class='border p-2'>${bucket.blocksReduced}</td>
                          <td class='border p-2 ${
                            bucket.costSaved < 0 ? "text-red-600" : ""
                          }'>
                              \$${bucket.costSaved.toLocaleString()}
                          </td>
                      </tr>
                  `
                    )
                    .join("")
                )
                .join("")}
          </tbody>
      </table>
  `
  resultsDiv.classList.remove("hidden")
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
