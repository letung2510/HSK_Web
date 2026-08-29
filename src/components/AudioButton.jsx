import { useSpeech } from '../hooks/useSpeech'

export default function AudioButton({ text, label }) {
  const { supported, speak } = useSpeech()
  if (!supported) return null
  return (
    <button
      type="button"
      className="audio-btn"
      onClick={() => speak(text)}
      aria-label={label ?? `Phát âm ${text}`}
    >
      🔊
    </button>
  )
}
