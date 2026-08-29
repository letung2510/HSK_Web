export default function LevelTabs({ levels, active, onChange, counts }) {
  return (
    <div className="level-tabs" role="tablist">
      {levels.map((l) => (
        <button
          key={l}
          type="button"
          role="tab"
          aria-selected={active === l}
          className={`level-tab ${active === l ? 'active' : ''}`}
          onClick={() => onChange(l)}
        >
          HSK {l}
          {counts?.[l] != null && <span className="tab-count">{counts[l]}</span>}
        </button>
      ))}
    </div>
  )
}
