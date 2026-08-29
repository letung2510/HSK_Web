import { useCallback, useMemo, useState } from 'react'
import vocabulary from '../data/vocabulary.json'
import LevelTabs from '../components/LevelTabs'
import { useSpeech } from '../hooks/useSpeech'
import { useSpeechRecognition } from '../hooks/useSpeechRecognition'
import { compareSpeech } from '../utils/compareSpeech'
import { sample } from '../utils/shuffle'

const DEFAULT_PACK = [
  '你好', '谢谢', '再见', '对不起', '没关系', '我爱你',
  '我是学生', '我去学校', '今天天气很好', '我喜欢学中文',
  '多少钱', '请问洗手间在哪里', '欢迎光临', '新年快乐',
  '一路顺风', '身体健康', '万事如意',
]

export default function Speaking() {
  const [level, setLevel] = useState(null)
  const [mode, setMode] = useState('word') // word | phrase
  const [current, setCurrent] = useState(null)
  const [result, setResult] = useState(null)
  const [attempts, setAttempts] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)

  const { supported: speechOk, speak } = useSpeech()
  const onResult = useCallback(
    (results) => {
      if (!current) return
      const best = results[0]
      const r = compareSpeech(best, current.hanzi)
      setResult({ ...r, alternatives: results })
      setAttempts((a) => a + 1)
      if (r.level === 'perfect') setCorrectCount((c) => c + 1)
    },
    [current],
  )
  const { supported: recOk, listening, error, start, stop } = useSpeechRecognition({
    lang: 'zh-CN',
    onResult,
  })

  const levelCounts = useMemo(() => {
    const counts = {}
    for (const w of vocabulary) counts[w.hsk] = (counts[w.hsk] ?? 0) + 1
    return counts
  }, [])

  const pickWord = () => {
    const pool = vocabulary.filter((w) => w.hsk === (level ?? 1))
    const w = sample(pool, 1)[0]
    setCurrent({ type: 'word', hanzi: w.hanzi, pinyin: w.pinyin, vi: w.meaningVi })
    setResult(null)
  }

  const pickPhrase = () => {
    setCurrent({ type: 'phrase', hanzi: sample(DEFAULT_PACK, 1)[0] })
    setResult(null)
  }

  const next = () => {
    if (mode === 'word') pickWord()
    else pickPhrase()
  }

  const startListen = () => {
    setResult(null)
    start()
  }

  const toggleMode = (m) => {
    setMode(m)
    setCurrent(null)
    setResult(null)
  }

  return (
    <div className="page speaking-page">
      <h2>🎤 Luyện nói</h2>
      <p className="speaking-intro">
        Nghe từ chuẩn, bấm nút 🎤 và đọc theo — ứng dụng sẽ nhận dạng và chấm điểm
        phát âm của bạn. (Hoạt động trên Chrome/Edge, cần quyền sử dụng micro.)
      </p>

      <div className="filter-row">
        <button
          type="button"
          className={`chip ${mode === 'word' ? 'active' : ''}`}
          onClick={() => toggleMode('word')}
        >
          Từ vựng
        </button>
        <button
          type="button"
          className={`chip ${mode === 'phrase' ? 'active' : ''}`}
          onClick={() => toggleMode('phrase')}
        >
          Câu giao tiếp
        </button>
      </div>

      {mode === 'word' && (
        <LevelTabs
          levels={[1, 2, 3, 4]}
          active={level ?? 1}
          onChange={(l) => {
            setLevel(l)
            setCurrent(null)
            setResult(null)
          }}
          counts={levelCounts}
        />
      )}

      {!speechOk && (
        <div className="note">
          Trình duyệt của bạn không hỗ trợ phát âm (Web Speech API). Hãy dùng Chrome
          hoặc Edge mới nhất.
        </div>
      )}
      {!recOk && (
        <div className="note">
          Trình duyệt của bạn không hỗ trợ nhận dạng giọng nói. Hãy dùng Chrome hoặc
          Edge mới nhất.
        </div>
      )}

      {!current ? (
        <div className="empty-state">
          <p>Chọn một từ hoặc câu để bắt đầu luyện tập.</p>
          <button type="button" className="btn btn-primary" onClick={next}>
            Bắt đầu
          </button>
        </div>
      ) : (
        <div className="speaking-session">
          <div className="speaking-card">
            <div className="speaking-hanzi">{current.hanzi}</div>
            {current.pinyin && <div className="speaking-pinyin">{current.pinyin}</div>}
            {current.vi && <div className="speaking-vi">{current.vi}</div>}
            <div className="speaking-actions">
              {speechOk && (
                <button
                  type="button"
                  className="btn"
                  onClick={() => speak(current.hanzi)}
                >
                  🔊 Nghe mẫu
                </button>
              )}
              {recOk && (
                <button
                  type="button"
                  className={`btn btn-mic ${listening ? 'listening' : ''}`}
                  onClick={listening ? stop : startListen}
                  disabled={!recOk}
                >
                  {listening ? '⏹ Đang nghe…' : '🎤 Bắt đầu nói'}
                </button>
              )}
            </div>
            {listening && <div className="listening-hint">Đang lắng nghe… hãy đọc từ này</div>}
            {error && <div className="speaking-error">Lỗi: {error}</div>}
          </div>

          {result && (
            <div className={`speaking-result ${result.level}`}>
              <div className="result-score">{result.score}%</div>
              <div className="result-message">{result.message}</div>
              <div className="result-detail">
                <span>Bạn nói: </span>
                <strong>{result.heard || '…'}</strong>
              </div>
              <div className="result-detail">
                <span>Chuẩn: </span>
                <strong>{result.expected}</strong>
              </div>
              <div className="result-actions">
                <button
                  type="button"
                  className="btn"
                  onClick={() => speak(current.hanzi)}
                >
                  🔊 Nghe lại
                </button>
                <button type="button" className="btn" onClick={startListen}>
                  🔁 Nói lại
                </button>
                <button type="button" className="btn btn-primary" onClick={next}>
                  Từ tiếp theo →
                </button>
              </div>
            </div>
          )}

          <div className="speaking-stats">
            <span>Đã luyện: {attempts} từ</span>
            <span>Đúng: {correctCount} từ</span>
          </div>
        </div>
      )}
    </div>
  )
}
