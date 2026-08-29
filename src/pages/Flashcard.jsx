import { useMemo, useState } from 'react'
import vocabulary from '../data/vocabulary.json'
import LevelTabs from '../components/LevelTabs'
import AudioButton from '../components/AudioButton'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { shuffle } from '../utils/shuffle'

export default function Flashcard() {
  const [level, setLevel] = useState(1)
  const [filter, setFilter] = useState('all') // all | known | unknown
  const [flipped, setFlipped] = useState(false)
  const [progress, setProgress] = useLocalStorage('hsk-flashcard-progress', {})
  const [queue, setQueue] = useState(() => shuffle(vocabulary.filter((w) => w.hsk === 1)))

  const levelCounts = useMemo(() => {
    const counts = {}
    for (const w of vocabulary) counts[w.hsk] = (counts[w.hsk] ?? 0) + 1
    return counts
  }, [])

  const pool = useMemo(() => {
    let list = vocabulary.filter((w) => w.hsk === level)
    if (filter === 'known') list = list.filter((w) => progress[w.hanzi])
    if (filter === 'unknown') list = list.filter((w) => !progress[w.hanzi])
    return list
  }, [level, filter, progress])

  const startSession = () => {
    setQueue(shuffle(pool))
    setFlipped(false)
  }

  const current = queue[0]

  const answer = (known) => {
    if (!current) return
    const next = { ...progress, [current.hanzi]: known }
    setProgress(next)
    // Thẻ chưa biết quay lại cuối hàng đợi
    const rest = queue.slice(1)
    const newQueue = known || rest.length === 0 ? rest : [...rest, current]
    setQueue(newQueue)
    setFlipped(false)
  }

  return (
    <div className="page flashcard-page">
      <h2>Flashcard</h2>
      <LevelTabs
        levels={[1, 2, 3, 4]}
        active={level}
        onChange={(l) => setLevel(l)}
        counts={levelCounts}
      />
      <div className="filter-row">
        <button
          type="button"
          className={`chip ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Tất cả
        </button>
        <button
          type="button"
          className={`chip ${filter === 'known' ? 'active' : ''}`}
          onClick={() => setFilter('known')}
        >
          Đã thuộc
        </button>
        <button
          type="button"
          className={`chip ${filter === 'unknown' ? 'active' : ''}`}
          onClick={() => setFilter('unknown')}
        >
          Chưa thuộc
        </button>
        <span className="filter-count">{pool.length} từ</span>
      </div>

      {!current && (
        <div className="empty-state">
          <p>
            {filter === 'all'
              ? 'Không có từ nào trong bộ này.'
              : 'Không có từ nào khớp bộ lọc này.'}
          </p>
          {pool.length > 0 && (
            <button type="button" className="btn btn-primary" onClick={startSession}>
              Bắt đầu ôn tập
            </button>
          )}
        </div>
      )}

      {current && (
        <>
          <div
            className={`flashcard ${flipped ? 'flipped' : ''}`}
            onClick={() => setFlipped((f) => !f)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') setFlipped((f) => !f)
            }}
          >
            <div className="flashcard-inner">
              <div className="flashcard-face flashcard-front">
                <div className="flashcard-hanzi">{current.hanzi}</div>
                <AudioButton text={current.hanzi} />
                <div className="flashcard-hint">Bấm để lật thẻ</div>
              </div>
              <div className="flashcard-face flashcard-back">
                <div className="flashcard-pinyin">{current.pinyin}</div>
                <div className="flashcard-meaning">{current.meaningVi}</div>
              </div>
            </div>
          </div>
          <div className="flashcard-actions">
            <button type="button" className="btn btn-unknown" onClick={() => answer(false)}>
              Chưa biết
            </button>
            <button type="button" className="btn btn-known" onClick={() => answer(true)}>
              Biết rồi
            </button>
          </div>
          <div className="queue-info">Còn {queue.length} thẻ trong phiên</div>
        </>
      )}
    </div>
  )
}
