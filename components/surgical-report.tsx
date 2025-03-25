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
  return (
    <div
      style={{
        visibility: "hidden", // Make it invisible but still part of the layout
        position: "absolute", // Remove it from the flow but still in the DOM
        width: "0",
        height: "0",
        display: "none",
      }}
    >
      <div
        className="flex flex-col min-h-screen bg-white"
        id="pdf-report"
        style={{
          margin: 0,
          padding: 0,
        }}
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
            <p className="text-gray-600">Thursday, October 3rd, 2024</p>
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
                  <h3 className="font-medium mb-4">{department.serviceName}</h3>

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
                              {department.caseVolume}
                            </td>
                            <td className="p-3 border-b">
                              {department.potentialCaseVolume}
                            </td>
                            <td className="p-3 border-b">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-green-100 text-green-800">
                                <ArrowUpIcon className="w-3 h-3 mr-1" />+
                                {department.potentialCaseVolume -
                                  department.caseVolume}{" "}
                                cases
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td className="p-3">Estimated Blocks Used</td>
                            <td className="p-3">{department.blocks}</td>
                            <td className="p-3">
                              {department.potentialBlocks}
                            </td>
                            <td className="p-3">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-green-100 text-green-800">
                                <ArrowDownIcon className="w-3 h-3 mr-1" />-
                                {department.blocks - department.potentialBlocks}{" "}
                                blocks
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

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
                                +{bucket.volumeIncreased} Cases
                              </td>
                              <td className="p-3 border-b">
                                {bucket.blocksReduced} Blocks
                              </td>
                              <td className="p-3 border-b">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-green-100 text-green-800">
                                  <ArrowUpIcon className="w-3 h-3 mr-1" />$
                                  {bucket.costSaved.toLocaleString()} saved
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Summary Stats */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-emerald-700 font-medium mb-2">
                          Total {department.serviceName} Performance Impact
                        </p>
                        <div className="text-center">
                          <p className="text-4xl font-bold text-emerald-800">
                            {department.potentialCaseVolume -
                              department.caseVolume}
                          </p>
                          <p className="text-xs text-emerald-700 text-center">
                            additional surgeries
                            <br />
                            performed
                          </p>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-4xl font-bold text-emerald-800">
                          {department.blocks - department.potentialBlocks}
                        </div>
                        <p className="text-xs text-emerald-700">
                          freed-up
                          <br />
                          surgery blocks
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="text-4xl font-bold text-emerald-800">
                          ${department.potentialCostSaved.toLocaleString()}
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
            <div className="text-white">
              <svg
                width="80"
                height="24"
                viewBox="0 0 80 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6ZM4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12Z"
                  fill="white"
                />
                <path
                  d="M32 8H28V16H30V13H32C34.2091 13 36 11.2091 36 9C36 6.79086 34.2091 5 32 5H28V7H32C33.1046 7 34 7.89543 34 9C34 10.1046 33.1046 11 32 11H30V8H32Z"
                  fill="white"
                />
                <path d="M40 5H38V17H40V5Z" fill="white" />
                <path
                  d="M48 8H44V16H46V13H48C50.2091 13 52 11.2091 52 9C52 6.79086 50.2091 5 48 5H44V7H48C49.1046 7 50 7.89543 50 9C50 10.1046 49.1046 11 48 11H46V8H48Z"
                  fill="white"
                />
                <path
                  d="M58 5H56V17H58V12L62 17H64.5L60 11.5L64.5 5H62L58 10.5V5Z"
                  fill="white"
                />
              </svg>
            </div>
            <div className="text-sm">www.sifiohealth.com</div>
          </div>
        </footer>
      </div>
    </div>
  )
}
