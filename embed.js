document.addEventListener("DOMContentLoaded", async () => {
  console.log("Embed.js executed!")
  await initCalculator()
})

async function initCalculator() {
  console.log("Initializing calculator...")

  // Fetch and inject HTML structure from index.html
  const response = await fetch(
    "https://rishhi-patel.github.io/hospital-impact-calculator/index.html"
  )
  const html = await response.text()

  // Create container and add fetched HTML
  const container = document.createElement("div")
  container.id = "hospital-impact-calculator"
  container.innerHTML = html
  document.body.appendChild(container)
  console.log("Calculator HTML injected")

  // Load CSS dynamically
  const style = document.createElement("link")
  style.rel = "stylesheet"
  style.href =
    "https://rishhi-patel.github.io/hospital-impact-calculator/styles.css"
  document.head.appendChild(style)
  console.log("Styles loaded")

  // Load main.js
  const script = document.createElement("script")
  script.src =
    "https://rishhi-patel.github.io/hospital-impact-calculator/js/main.js"
  script.defer = true
  script.onload = () => console.log("Main.js injected!")
  document.body.appendChild(script)
}
