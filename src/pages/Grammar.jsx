import { useState } from 'react'
import grammar from '../data/grammar.json'
import LevelTabs from '../components/LevelTabs'
import AudioButton from '../components/AudioButton'

export default function Grammar() {
  const [level, setLevel] = useState(1)
  const [selectedId, setSelectedId] = useState(null)

  const levelItems = grammar.filter((g) => g.hsk === level)
  const selected = levelItems.find((g) => g.id === selectedId) ?? levelItems[0]

  const counts = {}
  for (const g of grammar) counts[g.hsk] = (counts[g.hsk] ?? 0) + 1

  return (
    <div className="page grammar-page">
      <h2>Ngữ pháp HSK 1-4</h2>
      <LevelTabs
        levels={[1, 2, 3, 4]}
        active={level}
        onChange={(l) => {
          setLevel(l)
          setSelectedId(null)
        }}
        counts={counts}
      />
      <div className="grammar-layout">
        <nav className="grammar-nav">
          {levelItems.map((g) => (
            <button
              key={g.id}
              type="button"
              className={`grammar-nav-item ${selected?.id === g.id ? 'active' : ''}`}
              onClick={() => setSelectedId(g.id)}
            >
              {g.title}
            </button>
          ))}
        </nav>
        {selected && (
          <article className="grammar-detail">
            <h3>{selected.title}</h3>
            <div className="structure">{selected.structure}</div>
            <p className="explanation">{selected.explanation}</p>
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
            {selected.note && (
              <div className="note">⚠️ {selected.note}</div>
            )}
          </article>
        )}
      </div>
    </div>
  )
}
