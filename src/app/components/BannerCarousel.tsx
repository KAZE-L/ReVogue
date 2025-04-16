'use client'

import 'keen-slider/keen-slider.min.css'
import { useKeenSlider } from 'keen-slider/react'
import { useEffect, useState, useRef } from 'react'
import clsx from 'clsx'

export default function BannerCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const timer = useRef<NodeJS.Timeout | null>(null)

  const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: { perView: 1 },
    mode: 'snap',
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel)
    },
  })

  // 自動播放
  useEffect(() => {
    if (!slider.current) return

    const interval = setInterval(() => {
      slider.current?.next()
    }, 3000)

    return () => clearInterval(interval)
  }, [slider])

  return (
    <div className="w-full">
      {/* 輪播主體 */}
      <div
        ref={sliderRef}
        className="keen-slider w-full h-[300px] overflow-hidden rounded-xl"
      >
        <div className="keen-slider__slide flex items-center justify-center bg-gray-300 text-2xl">
          ✨ 主打新品 ✨
        </div>
        <div className="keen-slider__slide flex items-center justify-center bg-gray-400 text-2xl">
          🧥 冬季折扣 🧥
        </div>
        <div className="keen-slider__slide flex items-center justify-center bg-gray-500 text-2xl">
          👜 配件推薦 👜
        </div>
        <div className="keen-slider__slide flex items-center justify-center bg-gray-200 text-2xl">
          💄 視覺饗宴 💄
        </div>
      </div>

      <div className="mt-4 flex justify-center gap-2">
        {[0, 1, 2, 3].map((idx) => (
          <button
            key={idx}
            className={clsx(
              'h-2 w-2 rounded-full',
              currentSlide === idx ? 'bg-black' : 'bg-gray-400'
            )}
            onClick={() => slider.current?.moveToIdx(idx)}
          />
        ))}
      </div>
    </div>
  )
}
