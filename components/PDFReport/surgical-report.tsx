import { ArrowUpIcon, ArrowDownIcon } from "lucide-react"
import "./styles/pdf-print.css"

interface DepartmentDetail {
  serviceName: string
  caseVolume: number
  potentialCaseVolume: number
  blocks: number
  potentialBlocks: number
  potentialCostSaved: number
  potentialByBucket: {
    bucketName: string
    volumeIncreased: number
    blocksReduced: number
    costSaved: number
  }[]
}

type DetailedReportProps = {
  departmentDetails: Record<string, DepartmentDetail>
}

export default function SurgicalReport({
  departmentDetails,
}: DetailedReportProps) {
  const formatNumber = (num: number) =>
    new Intl.NumberFormat("en-US").format(num)

  const formatCurrency = (num: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(num)

  const serviceCategories = {
    Cardiac: "Cardiac",
    General: "General",
    Gynaecologic: "Gynaecologic",
    Neurosurgery: "Neurosurgery",
    Ophthalmic: "Ophthalmology",
    Orthopaedic: "Orthopaedic",
    Oral_and_Maxillofacial_and_Dentistry:
      "Oral and Maxillofacial and Dentistry",
    Otolaryngic_ENT: "Otolaryngic ENT",
    Urologic: "Urologic",
    Vascular: "Vascular",
    Plastic_and_Reconstructive: "Plastic and Reconstructive",
  }

  const departmentEntries = Object.entries(departmentDetails)

  return (
    <div className="bg-white text-black" id="final-report">
      {/* Fixed Header */}
      <header className="bg-magnet text-white p-4 print:fixed print:top-0 print:left-0 print:right-0">
        <div className="max-w-6xl mx-auto flex justify-between">
          <div></div>
          <div className="text-right text-lg font-semibold mx-auto">
            <div>
              <img
                src="/Surgitwin_Logo.png"
                alt="SifioHealth Logo"
                className="h-6"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto w-full px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="text-xl font-medium">Planning Report</div>
          <div className="text-gray-500 text-sm">
            {new Date().toLocaleDateString("en-CA", {
              timeZone: "America/Toronto",
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>

        <h2 className="text-center text-3xl font-bold text-magnet mb-4">
          Surgical Efficiency Opportunity Report
        </h2>
        <p className="text-center text-gray-600 mx-auto">
          Thank you for using the Sifio Health Efficiency Calculator. This
          report provides a tailored view of how your surgical department can
          unlock greater efficiency by addressing key operational levers. Based
          on your department’s characteristics and benchmarked data from 80+
          Canadian surgical centers, we’ve outlined specific opportunities to
          increase throughput, reduce wasted OR time, and boost financial
          performance.
        </p>

        {/* Service-Specific Performance */}
        {departmentEntries.map(([key, department]) => {
          const typedKey = key as keyof typeof serviceCategories
          const totalSurgeries =
            department.potentialCaseVolume - department.caseVolume
          const totalBlocks = department.blocks - department.potentialBlocks
          const totalCost = department.potentialCostSaved

          return (
            <div key={key} className="pt-16">
              <div className="bg-white border rounded-xl p-6 mb-12 shadow-sm no-break">
                <h3 className="text-lg font-semibold mb-4">
                  {serviceCategories[typedKey]} Surgery Department
                </h3>

                {/* Tables */}
                <p className="text-sm text-gray-600 mb-2">
                  Overall Performance Comparison Table (Before SurgiTwin vs.
                  After SurgiTwin)
                </p>
                <table className="w-full mb-6 border rounded-md overflow-hidden text-sm">
                  <thead className="bg-gray-50 text-left">
                    <tr>
                      <th className="p-3 border-b">Metric</th>
                      <th className="p-3 border-b text-center">
                        Current Performance
                      </th>
                      <th className="p-3 border-b text-center">
                        Optimized Performance
                      </th>
                      <th className="p-3 border-b text-center"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-3 border-b">Case Volume</td>
                      <td className="p-3 border-b text-center">
                        {formatNumber(department.caseVolume)}
                      </td>
                      <td className="p-3 border-b text-center">
                        {formatNumber(department.potentialCaseVolume)}
                      </td>
                      <td className="p-3 border-b text-center">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-magnet-faint text-magnet">
                          <ArrowUpIcon className="w-3 h-3 mr-1" />+
                          {formatNumber(totalSurgeries)} cases
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3">Estimated Blocks Used</td>
                      <td className="p-3 text-center">
                        {formatNumber(department.blocks)}
                      </td>
                      <td className="p-3 text-center">
                        {formatNumber(department.potentialBlocks)}
                      </td>
                      <td className="p-3 text-center">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-magnet-faint text-magnet">
                          <ArrowDownIcon className="w-3 h-3 mr-1" />-
                          {formatNumber(totalBlocks)} blocks
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Breakdown Table */}
                <p className="text-sm text-gray-600 mb-2">
                  Breakdown of Efficiency Improvements Table
                </p>
                <table className="w-full mb-6 border rounded-md overflow-hidden text-sm">
                  <thead className="bg-gray-50 text-left">
                    <tr>
                      <th className="p-3 border-b">Category</th>
                      <th className="p-3 border-b text-center">
                        Additional Surgeries Performed
                      </th>
                      <th className="p-3 border-b text-center">
                        Freed-Up Blocks
                      </th>
                      <th className="p-3 border-b text-center"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {department.potentialByBucket.map((bucket) => (
                      <tr key={bucket.bucketName}>
                        <td className="p-3 border-b">{bucket.bucketName}</td>
                        <td className="p-3 border-b text-center">
                          +{formatNumber(bucket.volumeIncreased)} Cases
                        </td>
                        <td className="p-3 border-b text-center">
                          {formatNumber(bucket.blocksReduced)} Blocks
                        </td>
                        <td className="p-3 border-b text-center">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-magnet-faint text-magnet">
                            <ArrowUpIcon className="w-3 h-3 mr-1" />
                            {formatCurrency(bucket.costSaved)} saved
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Summary */}
                <div className="bg-magnet-faint rounded-xl px-6 py-6 shadow-sm flex items-center justify-between text-magnet mt-4">
                  <div className="text-sm font-semibold">
                    Total {serviceCategories[typedKey]} Surgery Performance
                    Impact
                  </div>
                  <div className="flex gap-12 text-center">
                    <div>
                      <div className="text-3xl font-bold">
                        {formatNumber(totalSurgeries)}
                      </div>
                      <div className="text-xs mt-1 leading-tight">
                        additional surgeries
                        <br />
                        performed
                      </div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold">
                        {formatNumber(totalBlocks)}
                      </div>
                      <div className="text-xs mt-1 leading-tight">
                        freed-up
                        <br />
                        surgery blocks
                      </div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold">
                        {formatCurrency(totalCost)}
                      </div>
                      <div className="text-xs mt-1 leading-tight">
                        in cost savings
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        {/* What Drives These Improvements */}
        <div className="no-break">
          <section className="max-w-6xl mx-auto w-full px-6 pt-8">
            <h4 className="text-lg font-semibold text-magnet mb-6">
              What Drives These Improvements?
            </h4>
            <div className="grid gap-4 text-sm">
              <div className="flex">
                <span className="w-48 text-magnet font-semibold">
                  Planning Accuracy
                </span>
                <span>
                  Improve alignment between scheduled and actual case durations.
                  By refining surgical time estimates and optimizing block
                  allocation, departments can reduce idle time, minimize delays,
                  and make full use of available OR capacity.
                </span>
              </div>
              <div className="flex">
                <span className="w-48 text-magnet font-semibold">
                  Flow Smoothing
                </span>
                <span>
                  Reduce variability across surgical days and teams. Even
                  workload distribution and improved case sequencing reduce
                  bottlenecks, improve staff morale, and increase the number of
                  surgeries performed per block.
                </span>
              </div>
              <div className="flex">
                <span className="w-48 text-magnet font-semibold">
                  Priority Planning
                </span>
                <span>
                  Schedule cases based on clinical and operational priority.
                  Using data-driven metrics such as urgency, complexity, and
                  contribution margin allows better decision-making on which
                  cases to schedule and when — improving both patient outcomes
                  and resource utilization.
                </span>
              </div>
            </div>
          </section>
          {/* Next Steps */}
          <section className="max-w-6xl mx-auto w-full px-6 pt-12 pb-8 text-sm">
            <h4 className="text-lg font-semibold text-magnet mb-4">
              Next Steps: Unlock Your Department’s Full Potential
            </h4>
            <p className="mb-3">
              These findings reflect just the starting point. With Surgitwin,
              Sifio Health’s AI-powered surgical workflow platform, your team
              can implement and sustain these improvements through:
            </p>
            <ul className="list-disc ml-6 mb-4 space-y-1">
              <li>Accurate real-time surgical duration prediction</li>
              <li>Dynamic resource and staff planning</li>
              <li>
                Optimized scheduling to meet both clinical and financial goals
              </li>
            </ul>
            <p>
              <strong>Schedule a demo</strong> to explore how Surgitwin can help
              your surgical department achieve measurable impact.
              <br />
              <a
                href="https://sifiohealth.com/contact-us"
                className="text-magnet underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Click here to connect with our team
              </a>{" "}
              or connect with me directly.
            </p>
            <div className="mt-6">
              <p className="font-semibold">Warm Regards,</p>
              <p>JP Eskander, CEO</p>
              <p className="text-magnet">jp.eskander@sifiohealth.com</p>
            </div>
          </section>
        </div>
      </main>

      {/* Fixed Footer */}
      <footer className="bg-magnet text-white p-4 print:fixed print:bottom-0 print:left-0 print:right-0">
        <div className="max-w-6xl mx-auto flex justify-between items-center text-sm">
          <div className="font-semibold text-base">©sifio</div>
          <div>www.sifiohealth.com</div>
        </div>
      </footer>
    </div>
  )
}
