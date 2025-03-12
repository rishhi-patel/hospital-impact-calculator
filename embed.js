// 📄 embed.js (This script will embed the Hospital Impact Calculator)
document.addEventListener("DOMContentLoaded", async () => {
  await initCalculator()
})

async function initCalculator() {
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

  // Load Tailwind dynamically
  const tailwind = document.createElement("script")
  tailwind.src = "https://cdn.tailwindcss.com"
  document.head.appendChild(tailwind)
  console.log("Tailwind loaded")

  // Load main.js
  const script = document.createElement("script")
  script.src =
    "https://rishhi-patel.github.io/hospital-impact-calculator/js/main.js"
  script.defer = true
  script.onload = () => console.log("Main.js injected!")
  document.body.appendChild(script)
}
