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

  // Load Tailwind CSS
  const tailwindLink = document.createElement("link")
  tailwindLink.rel = "stylesheet"
  tailwindLink.href =
    "https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
  document.head.appendChild(tailwindLink)

  // Wait before loading main.js to ensure HTML is ready
  setTimeout(() => {
    const script = document.createElement("script")
    script.src =
      "https://rishhi-patel.github.io/hospital-impact-calculator/js/main.js"
    script.defer = true
    document.body.appendChild(script)
  }, 500) // Small delay to ensure HTML is fully loaded
}
