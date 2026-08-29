import { useCallback, useEffect, useRef, useState } from 'react'

// Nhận dạng giọng nói qua Web Speech API (SpeechRecognition).
// Chạy trên Chrome/Edge; nhận dạng liên tục cho tới khi stop() được gọi,
// sau đó trả về transcript (chữ Hán) cuối cùng qua onResult.
export function useSpeechRecognition({ lang = 'zh-CN', onResult, onEnd } = {}) {
  const [supported] = useState(
    () => 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window,
  )
  const [listening, setListening] = useState(false)
  const [error, setError] = useState(null)
  const recRef = useRef(null)
  // Transcript mới nhất có được trong phiên — chấm điểm khi phiên kết thúc
  const latestResultsRef = useRef([])
  // Lưu callback mới nhất vào ref để effect chính không phải chạy lại
  // khi component rerender (tránh abort recognition giữa chừng).
  const onResultRef = useRef(onResult)
  const onEndRef = useRef(onEnd)
  useEffect(() => {
    onResultRef.current = onResult
    onEndRef.current = onEnd
  })

  useEffect(() => {
    if (!supported) return
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    const rec = new SR()
    rec.lang = lang
    rec.interimResults = false
    rec.maxAlternatives = 3
    rec.continuous = true
    rec.onstart = () => setListening(true)
    rec.onend = () => {
      setListening(false)
      const results = latestResultsRef.current
      onResultRef.current?.(results)
      onEndRef.current?.(results)
    }
    rec.onerror = (e) => setError(e.error)
    rec.onresult = (e) => {
      // Cụm kết quả mới nhất của phiên (continuous mode)
      const last = e.results[e.results.length - 1]
      const results = []
      for (let i = 0; i < last.length; i++) {
        const item = last[i]
        results.push(item.transcript.trim())
      }
      // Chỉ lưu khi có transcript thực sự, tránh ghi đè kết quả tốt bằng chuỗi rỗng
      if (results.some(Boolean)) latestResultsRef.current = results
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
  }, [supported, lang])

  const start = useCallback(() => {
    latestResultsRef.current = []
    setError(null)
    try {
      recRef.current?.start()
    } catch {
      // trình duyệt chưa sẵn sàng — bỏ qua
    }
  }, [])

  const stop = useCallback(() => {
    try {
      recRef.current?.stop()
    } catch {
      // chưa bắt đầu — bỏ qua
    }
  }, [])

  return { supported, listening, error, start, stop }
}
