import React from "react"

interface ChipProps {
  value: string
  helperText?: string
}

const Chip: React.FC<ChipProps> = ({ value, helperText }) => {
  const isNegative = Number(value.replace(/[^0-9.-]+/g, "")) <= 0

  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-[#2C615017] px-4 py-2 shadow text-[#2C6150]">
      {isNegative ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
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
          className="h-4 w-4"
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
      <span className="text-lg font-bold">{value}</span>
      {helperText && (
        <span className="text-base font-normal">{helperText}</span>
      )}
    </div>
  )
}

export default Chip
