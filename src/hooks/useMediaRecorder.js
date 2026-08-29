import { useCallback, useEffect, useRef, useState } from 'react'

// Thu âm giọng người dùng qua MediaRecorder.
// Trả về audioUrl (blob URL) để phát lại bản thu.
export function useMediaRecorder() {
  const [supported] = useState(
    () => 'MediaRecorder' in window && !!navigator.mediaDevices?.getUserMedia,
  )
  const [recording, setRecording] = useState(false)
  const [audioUrl, setAudioUrl] = useState(null)
  const recorderRef = useRef(null)
  const streamRef = useRef(null)
  const chunksRef = useRef([])
  const urlRef = useRef(null)

  useEffect(() => {
    return () => {
      if (urlRef.current) URL.revokeObjectURL(urlRef.current)
      streamRef.current?.getTracks().forEach((t) => t.stop())
    }
  }, [])

  const start = useCallback(async () => {
    if (!supported) return
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      chunksRef.current = []
      const rec = new MediaRecorder(stream)
      recorderRef.current = rec
      rec.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }
      rec.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        if (urlRef.current) URL.revokeObjectURL(urlRef.current)
        const url = URL.createObjectURL(blob)
        urlRef.current = url
        setAudioUrl(url)
        stream.getTracks().forEach((t) => t.stop())
      }
      rec.start()
      setRecording(true)
    } catch {
      // người dùng từ chối quyền mic hoặc lỗi khác — bỏ qua, vẫn dùng recognition
    }
  }, [supported])

  const stop = useCallback(() => {
    recorderRef.current?.stop()
    recorderRef.current = null
    setRecording(false)
  }, [])

  const clear = useCallback(() => {
    if (urlRef.current) URL.revokeObjectURL(urlRef.current)
    urlRef.current = null
    setAudioUrl(null)
  }, [])

  return { supported, recording, audioUrl, start, stop, clear }
}
