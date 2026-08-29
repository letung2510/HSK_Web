import { useCallback, useEffect, useState } from 'react'

const VOICE_NAME = 'zh-CN'
let cachedVoices = null

function loadVoices() {
  if (!('speechSynthesis' in window)) return []
  const voices = window.speechSynthesis.getVoices()
  if (voices.length > 0) {
    cachedVoices = voices
  }
  return voices
}

export function useSpeech() {
  const [supported] = useState(() => 'speechSynthesis' in window)
  const [speaking, setSpeaking] = useState(false)

  useEffect(() => {
    if (!supported) return
    loadVoices()
    // Chrome tải giọng nói bất đồng bộ
    window.speechSynthesis.onvoiceschanged = () => loadVoices()
    return () => {
      window.speechSynthesis.onvoiceschanged = null
      window.speechSynthesis.cancel()
    }
  }, [supported])

  const speak = useCallback(
    (text) => {
      if (!supported || !text) return
      const synth = window.speechSynthesis
      synth.cancel()
      const utter = new SpeechSynthesisUtterance(text)
      utter.lang = 'zh-CN'
      const voices = cachedVoices ?? loadVoices()
      const zhVoice = voices.find(
        (v) => v.lang === VOICE_NAME || v.lang.startsWith('zh'),
      )
      if (zhVoice) utter.voice = zhVoice
      utter.rate = 0.9
      utter.onstart = () => setSpeaking(true)
      utter.onend = () => setSpeaking(false)
      utter.onerror = () => setSpeaking(false)
      synth.speak(utter)
    },
    [supported],
  )

  return { supported, speaking, speak }
}
