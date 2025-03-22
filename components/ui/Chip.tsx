import React from "react"

interface ChipProps {
  value: string
  helperText?: string
}

const Chip: React.FC<ChipProps> = ({ value, helperText }) => {
  return (
    <div className="inline-flex items-center px-4 py-2 rounded-full bg-gray-100 shadow text-green-800 font-medium text-lg">
      {Number(value) <= 0 ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7 13l5 5m0 0l5-5m-5 5V6"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17 11l-5-5m0 0l-5 5m5-5v12"
          />
        </svg>
      )}
      <span>
        <span className="font-bold">{value}</span> {helperText}
      </span>
    </div>
  )
}

export default Chip
