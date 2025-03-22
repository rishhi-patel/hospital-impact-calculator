import { Suspense } from "react"
import SurgicalEstimator from "@/components/surgical-estimator"
import { Toaster } from "@/components/ui/toaster"

export default function Home() {
  return (
    <main className="min-h-screen bg-white py-12">
      <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
        <SurgicalEstimator />
      </Suspense>
      <Toaster />
    </main>
  )
}

