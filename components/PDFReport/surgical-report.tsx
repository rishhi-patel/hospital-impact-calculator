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
          <div className="text-right text-lg font-semibold">
            <span className="font-bold">surgi</span>
            <span className="font-light">twin</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto w-full px-6 py-8 print:mt-[100px] print:mb-[80px]">
        <div className="flex justify-between items-center mb-6">
          <div className="text-xl font-medium">Planning Report</div>
          <div className="text-gray-500 text-sm">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>

        <h2 className="text-center text-3xl font-bold mb-2">
          Surgi<span className="font-light">Twin™</span> Performance Insights
          for Surgical Departments
        </h2>
        <p className="text-center text-gray-600 max-w-3xl mx-auto">
          These improvements are driven by key factors such as Planning
          Accuracy, Flow Smoothing, and Priority Planning. See how each factor
          has impacted your department's efficiency based on your input.
        </p>

        {/* Paginate 1-2 services per page */}
        {departmentEntries.map(([key, department], index) => {
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
                      <th className="p-3 border-b">Current Performance</th>
                      <th className="p-3 border-b">Optimized Performance</th>
                      <th className="p-3 border-b"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-3 border-b">Case Volume</td>
                      <td className="p-3 border-b">
                        {formatNumber(department.caseVolume)}
                      </td>
                      <td className="p-3 border-b">
                        {formatNumber(department.potentialCaseVolume)}
                      </td>
                      <td className="p-3 border-b">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-magnet-faint text-magnet">
                          <ArrowUpIcon className="w-3 h-3 mr-1" />+
                          {formatNumber(totalSurgeries)} cases
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3">Estimated Blocks Used</td>
                      <td className="p-3">{formatNumber(department.blocks)}</td>
                      <td className="p-3">
                        {formatNumber(department.potentialBlocks)}
                      </td>
                      <td className="p-3">
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
                      <th className="p-3 border-b">
                        Additional Surgeries Performed
                      </th>
                      <th className="p-3 border-b">Freed-Up Blocks</th>
                      <th className="p-3 border-b"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {department.potentialByBucket.map((bucket) => (
                      <tr key={bucket.bucketName}>
                        <td className="p-3 border-b">{bucket.bucketName}</td>
                        <td className="p-3 border-b">
                          +{formatNumber(bucket.volumeIncreased)} Cases
                        </td>
                        <td className="p-3 border-b">
                          {formatNumber(bucket.blocksReduced)} Blocks
                        </td>
                        <td className="p-3 border-b">
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

        {/* Key Definitions */}
        <section className="max-w-6xl mx-auto w-full px-6 pt-16">
          <h4 className="text-lg font-semibold text-magnet mb-6">
            Key Definitions
          </h4>
          <div className="grid gap-4 text-sm">
            <div className="flex">
              <span className="w-48 text-magnet font-semibold">
                Planning Accuracy
              </span>
              <span>
                SurgiTwin™ improves planning accuracy by aligning estimated
                case durations with actual times, reducing over- and
                under-scheduling.
              </span>
            </div>
            <div className="flex">
              <span className="w-48 text-magnet font-semibold">
                Flow Smoothing
              </span>
              <span>
                SurgiTwin™ minimizes disruptions like same-day cancellations
                and delays to ensure a smoother, more reliable surgical
                schedule.
              </span>
            </div>
            <div className="flex">
              <span className="w-48 text-magnet font-semibold">
                Priority Planning
              </span>
              <span>
                SurgiTwin™ optimizes case start times and turnaround times to
                help departments fit more surgeries into available OR blocks.
              </span>
            </div>
          </div>
        </section>
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
