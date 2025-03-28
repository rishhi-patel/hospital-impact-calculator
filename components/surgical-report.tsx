import { ArrowUpIcon, ArrowDownIcon } from "lucide-react"

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

  return (
    <div>
      <div
        className="flex flex-col min-h-screen bg-white"
        id="pdf-report"
        style={{ margin: 0, padding: 0 }}
      >
        {/* Header */}
        <header className="bg-emerald-800 text-white p-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-right">
              <span className="font-semibold">surgi</span>
              <span className="font-light">twin</span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 max-w-6xl mx-auto w-full p-6">
          <div className="flex justify-between items-center border-b pb-4 mb-6">
            <h1 className="text-xl font-medium">Planning Report</h1>
            <p className="text-gray-600">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">
              SurgiTwin™ Performance Insights for Surgical Departments
            </h2>
            <p className="text-center text-gray-700 max-w-3xl mx-auto mb-8">
              These improvements are driven by key factors such as Planning
              Accuracy, Flow Smoothing, and Priority Planning. See how each
              factor has impacted your department's efficiency based on your
              input.
            </p>

            {/* Dynamic Department Cards */}
            {Object.keys(departmentDetails).map((departmentKey) => {
              const department = departmentDetails[departmentKey]
              return (
                <div key={departmentKey} className="border rounded-lg p-6 mb-8">
                  <h3 className="font-medium mb-4">
                    {departmentKey} Surgery Department
                  </h3>

                  {/* Comparison Table */}
                  <div className="mb-6">
                    <h4 className="text-sm text-gray-600 mb-2">
                      Overall Performance Comparison Table (Before SurgiTwin vs.
                      After SurgiTwin)
                    </h4>

                    <div className="border rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="text-left p-3 border-b">Metric</th>
                            <th className="text-left p-3 border-b">
                              Current Performance
                            </th>
                            <th className="text-left p-3 border-b">
                              Optimized Performance
                            </th>
                            <th className="text-left p-3 border-b"></th>
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
                            <td
                              className="p-3 border-b"
                              style={{ width: "170px" }}
                            >
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-magnet-faint text-magnet">
                                <ArrowUpIcon className="w-3 h-3 mr-1" />+
                                {formatNumber(
                                  department.potentialCaseVolume -
                                    department.caseVolume
                                )}{" "}
                                cases
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td className="p-3">Estimated Blocks Used</td>
                            <td className="p-3">
                              {formatNumber(department.blocks)}
                            </td>
                            <td className="p-3">
                              {formatNumber(department.potentialBlocks)}
                            </td>
                            <td className="p-3">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-magnet-faint text-magnet">
                                <ArrowDownIcon className="w-3 h-3 mr-1" />-
                                {formatNumber(
                                  department.blocks - department.potentialBlocks
                                )}{" "}
                                blocks
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Breakdown Table */}
                  <div className="mb-6">
                    <h4 className="text-sm text-gray-600 mb-2">
                      Breakdown of Efficiency Improvements Table
                    </h4>

                    <div className="border rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="text-left p-3 border-b">Category</th>
                            <th className="text-left p-3 border-b">
                              Additional Surgeries Performed
                            </th>
                            <th className="text-left p-3 border-b">
                              Freed-Up Blocks
                            </th>
                            <th className="text-left p-3 border-b"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {department.potentialByBucket.map((bucket) => (
                            <tr key={bucket.bucketName}>
                              <td className="p-3 border-b">
                                {bucket.bucketName}
                              </td>
                              <td className="p-3 border-b">
                                +{formatNumber(bucket.volumeIncreased)} Cases
                              </td>
                              <td className="p-3 border-b">
                                {formatNumber(bucket.blocksReduced)} Blocks
                              </td>
                              <td
                                className="p-3 border-b"
                                style={{ width: "170px" }}
                              >
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-magnet-faint text-magnet">
                                  <ArrowUpIcon className="w-3 h-3 mr-1" />
                                  {formatCurrency(bucket.costSaved)} saved
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="grid grid-cols-10 gap-2">
                      <div className="col-span-3">
                        <p className="text-sm text-emerald-700 font-medium mb-2">
                          Total {departmentKey} Surgery Department Performance
                          Impact
                        </p>
                      </div>
                      <div className="col-span-2 text-center">
                        <p className="text-4xl font-bold text-emerald-800">
                          {formatNumber(
                            department.potentialCaseVolume -
                              department.caseVolume
                          )}
                        </p>
                        <p className="text-xs text-emerald-700">
                          additional surgeries
                          <br />
                          performed
                        </p>
                      </div>
                      <div className="col-span-2 text-center">
                        <div className="text-4xl font-bold text-emerald-800">
                          {formatNumber(
                            department.blocks - department.potentialBlocks
                          )}
                        </div>
                        <p className="text-xs text-emerald-700">
                          freed-up
                          <br />
                          surgery blocks
                        </p>
                      </div>
                      <div className="col-span-3 text-center">
                        <div className="text-4xl font-bold text-emerald-800">
                          {formatCurrency(department.potentialCostSaved)}
                        </div>
                        <p className="text-xs text-emerald-700">
                          in cost savings
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-emerald-800 text-white p-4">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div className="text-white font-semibold text-lg">©sifio</div>
            <div className="text-sm">www.sifiohealth.com</div>
          </div>
        </footer>
      </div>
    </div>
  )
}
