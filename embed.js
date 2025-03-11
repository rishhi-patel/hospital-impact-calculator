// 📄 embed.js (This script will embed the Hospital Impact Calculator in WordPress)

document.addEventListener("DOMContentLoaded", () => {
  initCalculator()
})

function initCalculator() {
  // Inject the calculator HTML into the target container
  const container = document.createElement("div")
  container.id = "hospital-impact-calculator"
  document.body.appendChild(container)

  // Load the main script dynamically
  const script = document.createElement("script")
  script.src = "./js/main.js" // Adjust path if needed
  script.defer = true
  document.body.appendChild(script)
}
