"use client"

import type React from "react"

import { useEffect, useRef } from "react"

export function useFade(
  isVisible: boolean,
  duration = 500,
): { ref: React.RefObject<HTMLDivElement>; style: React.CSSProperties } {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const element = ref.current

    if (isVisible) {
      let opacity = 0
      element.style.opacity = "0"
      element.style.display = "block"

      const startTime = performance.now()

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime
        opacity = Math.min(elapsed / duration, 1)
        element.style.opacity = opacity.toString()

        if (opacity < 1) {
          requestAnimationFrame(animate)
        }
      }

      requestAnimationFrame(animate)
    } else {
      let opacity = 1
      element.style.opacity = "1"

      const startTime = performance.now()

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime
        opacity = Math.max(1 - elapsed / duration, 0)
        element.style.opacity = opacity.toString()

        if (opacity > 0) {
          requestAnimationFrame(animate)
        } else {
          element.style.display = "none"
        }
      }

      requestAnimationFrame(animate)
    }
  }, [isVisible, duration])

  return {
    ref,
    style: {
      opacity: 0,
      transition: `opacity ${duration}ms ease-in-out`,
    },
  }
}

