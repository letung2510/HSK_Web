import { useMemo, useState } from 'react'
import vocabulary from '../data/vocabulary.json'
import LevelTabs from '../components/LevelTabs'
import SearchBar from '../components/SearchBar'
import WordCard from '../components/WordCard'

const PAGE_SIZE = 50

export default function Vocabulary() {
  const [level, setLevel] = useState(1)
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(0)

  const levelCounts = useMemo(() => {
    const counts = {}
    for (const w of vocabulary) counts[w.hsk] = (counts[w.hsk] ?? 0) + 1
    return counts
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = vocabulary.filter((w) => w.hsk === level)
    if (!q) return list
    return list.filter(
      (w) =>
        w.hanzi.includes(q) ||
        w.pinyin.toLowerCase().includes(q) ||
        w.meaningVi.toLowerCase().includes(q),
    )
  }, [level, query])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, pageCount - 1)
  const pageItems = filtered.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE)

  return (
    <div className="page">
      <h2>Từ vựng HSK 1-4</h2>
      <LevelTabs
        levels={[1, 2, 3, 4]}
        active={level}
        onChange={(l) => {
          setLevel(l)
          setPage(0)
        }}
        counts={levelCounts}
      />
      <SearchBar value={query} onChange={setQuery} />
      <p className="result-count">
        {filtered.length} từ{query && ` cho "${query}"`}
      </p>
      <div className="word-grid">
        {pageItems.map((w) => (
          <WordCard key={w.hanzi} word={w} />
        ))}
      </div>
      {pageCount > 1 && (
        <div className="pagination">
          <button
            type="button"
            className="btn"
            disabled={safePage === 0}
            onClick={() => setPage(safePage - 1)}
          >
            ← Trước
          </button>
          <span>
            Trang {safePage + 1} / {pageCount}
          </span>
          <button
            type="button"
            className="btn btn-primary"
            disabled={safePage >= pageCount - 1}
            onClick={() => setPage(safePage + 1)}
          >
            Sau →
          </button>
        </div>
      )}
    </div>
  )
}
