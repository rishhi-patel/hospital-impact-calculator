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

  // Load Tailwind CSS using a proper <link> tag
  const tailwindLink = document.createElement("link")
  tailwindLink.rel = "stylesheet"
  tailwindLink.href =
    "https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" // Using CDN for Tailwind CSS
  document.head.appendChild(tailwindLink)
  console.log("Tailwind CSS loaded")

  // Load main.js
  const script = document.createElement("script")
  script.src =
    "https://rishhi-patel.github.io/hospital-impact-calculator/js/main.js"
  script.defer = true
  script.onload = () => {
    console.log("Main.js injected!")
    // Ensure Tailwind applies styles properly after script loads
    setTimeout(() => {
      tailwind.config = {
        theme: {
          extend: {},
        },
      }
    }, 500)
  }
  document.body.appendChild(script)
}
