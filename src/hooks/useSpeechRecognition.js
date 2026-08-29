import { useCallback, useEffect, useRef, useState } from 'react'

// Nhận dạng giọng nói qua Web Speech API (SpeechRecognition).
// Chạy trên Chrome/Edge; trả về transcript (chữ Hán) khi có kết quả.
export function useSpeechRecognition({ lang = 'zh-CN', onResult } = {}) {
  const [supported] = useState(
    () => 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window,
  )
  const [listening, setListening] = useState(false)
  const [error, setError] = useState(null)
  const recRef = useRef(null)

  useEffect(() => {
    if (!supported) return
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    const rec = new SR()
    rec.lang = lang
    rec.interimResults = false
    rec.maxAlternatives = 3
    rec.continuous = false
    rec.onstart = () => setListening(true)
    rec.onend = () => setListening(false)
    rec.onerror = (e) => setError(e.error)
    rec.onresult = (e) => {
      const results = []
      for (let i = 0; i < e.results[0].length; i++) {
        const item = e.results[0][i]
        results.push(item.transcript.trim())
      }
      onResult?.(results)
    }
    recRef.current = rec
    return () => {
      rec.onresult = null
      rec.onerror = null
      rec.onend = null
      rec.onstart = null
      try {
        rec.abort()
      } catch {
        // bỏ qua
      }
    }
  }, [supported, lang, onResult])

  const start = useCallback(() => {
    setError(null)
    try {
      recRef.current?.start()
    } catch {
      // trình duyệt chưa sẵn sàng — bỏ qua
    }
  }, [])

  const stop = useCallback(() => {
    recRef.current?.stop()
  }, [])

  return { supported, listening, error, start, stop }
}
