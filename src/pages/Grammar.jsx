import { useState } from 'react'
import grammar from '../data/grammar.json'
import LevelTabs from '../components/LevelTabs'
import AudioButton from '../components/AudioButton'

// HSK 3.0 ngữ pháp: cấp 1-7 (cấp 7 gồm 7-9)
const GRAMMAR_LEVELS = [1, 2, 3, 4, 5, 6, 7]

export default function Grammar() {
  const [level, setLevel] = useState(1)
  const [selectedId, setSelectedId] = useState(null)

  const levelItems = grammar.filter((g) => g.hsk === level)
  const selected = levelItems.find((g) => g.id === selectedId) ?? levelItems[0]

  const counts = {}
  for (const g of grammar) counts[g.hsk] = (counts[g.hsk] ?? 0) + 1

  // Nhóm theo danh mục để hiển thị có cấu trúc hơn
  const groups = {}
  for (const g of levelItems) {
    const key = g.categoryVi || g.category || 'Khác'
    if (!groups[key]) groups[key] = []
    groups[key].push(g)
  }

  return (
    <div className="page grammar-page">
      <h2>Ngữ pháp HSK 1-7 (HSK 3.0)</h2>
      <LevelTabs
        levels={GRAMMAR_LEVELS}
        active={level}
        onChange={(l) => {
          setLevel(l)
          setSelectedId(null)
        }}
        counts={counts}
      />
      <div className="grammar-layout">
        <nav className="grammar-nav">
          {Object.entries(groups).map(([cat, items]) => (
            <div className="grammar-group" key={cat}>
              <div className="grammar-group-title">{cat}</div>
              {items.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  className={`grammar-nav-item ${selected?.id === g.id ? 'active' : ''}`}
                  onClick={() => setSelectedId(g.id)}
                >
                  {g.title}
                </button>
              ))}
            </div>
          ))}
        </nav>
        {selected && (
          <article className="grammar-detail">
            <h3>{selected.title}</h3>
            {selected.categoryVi && (
              <div className="grammar-meta">
                {selected.categoryVi}
                {selected.subcategory ? ` · ${selected.subcategory}` : ''}
              </div>
            )}
            {selected.structure && <div className="structure">{selected.structure}</div>}
            {selected.explanation && <p className="explanation">{selected.explanation}</p>}
            {selected.examples && selected.examples.length > 0 && (
              <div className="examples">
                {selected.examples.map((ex, i) => (
                  <div className="example" key={i}>
                    <div className="example-hanzi">
                      {ex.hanzi}
                      <AudioButton text={ex.hanzi} />
                    </div>
                    <div className="example-pinyin">{ex.pinyin}</div>
                    <div className="example-vi">{ex.vi}</div>
                  </div>
                ))}
              </div>
            )}
            {selected.note && (
              <div className="note">⚠️ {selected.note}</div>
            )}
          </article>
        )}
      </div>
    </div>
  )
}
