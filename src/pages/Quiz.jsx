import { useMemo, useState } from 'react'
import vocabulary from '../data/vocabulary.json'
import LevelTabs from '../components/LevelTabs'
import AudioButton from '../components/AudioButton'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { generateQuiz } from '../utils/quiz'
import { HSK_LEVELS } from '../utils/levels'

export default function Quiz() {
  const [level, setLevel] = useState(1)
  const [count, setCount] = useState(10)
  const [started, setStarted] = useState(false)
  const [questions, setQuestions] = useState([])
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [answers, setAnswers] = useState([])
  const [finished, setFinished] = useState(false)
  const [bestScore, setBestScore] = useLocalStorage('hsk-quiz-best', {})

  const levelCounts = useMemo(() => {
    const counts = {}
    for (const w of vocabulary) counts[w.hsk] = (counts[w.hsk] ?? 0) + 1
    return counts
  }, [])

  const start = () => {
    const pool = vocabulary.filter((w) => w.hsk === level)
    setQuestions(generateQuiz(pool, count))
    setIndex(0)
    setSelected(null)
    setAnswers([])
    setFinished(false)
    setStarted(true)
  }

  const choose = (option) => {
    if (selected != null) return
    setSelected(option)
    const correct = option === questions[index].answer
    setAnswers((prev) => [...prev, { ...questions[index], chosen: option, correct }])
  }

  const next = () => {
    if (index + 1 >= questions.length) {
      const score = answers.filter((a) => a.correct).length
      const key = `hsk${level}`
      setBestScore((prev) => ({ ...prev, [key]: Math.max(prev[key] ?? 0, score) }))
      setFinished(true)
    } else {
      setIndex(index + 1)
      setSelected(null)
    }
  }

  const score = answers.filter((a) => a.correct).length
  const q = questions[index]

  if (finished) {
    return (
      <div className="page quiz-page">
        <h2>Kết quả</h2>
        <div className="score-big">
          {score} / {questions.length}
        </div>
        <div className="score-percent">
          {Math.round((score / questions.length) * 100)}%
        </div>
        <div className="review-list">
          {answers.map((a, i) => (
            <div
              key={i}
              className={`review-item ${a.correct ? 'correct' : 'wrong'}`}
            >
              <div className="review-prompt">
                {i + 1}. {a.prompt}
              </div>
              <div className="review-line">
                {a.correct ? '✅' : `❌ Bạn chọn: ${a.chosen}`}
              </div>
              {!a.correct && (
                <div className="review-line">Đáp án: {a.answer}</div>
              )}
              <div className="review-line review-word">
                {a.word.hanzi} {a.word.pinyin} — {a.word.meaningVi}
              </div>
            </div>
          ))}
        </div>
        <button type="button" className="btn btn-primary" onClick={start}>
          Làm lại
        </button>
      </div>
    )
  }

  if (!started) {
    return (
      <div className="page quiz-page">
        <h2>Quiz trắc nghiệm</h2>
        <LevelTabs
          levels={HSK_LEVELS}
          active={level}
          onChange={setLevel}
          counts={levelCounts}
        />
        <div className="quiz-setup">
          <p>Chọn số câu hỏi:</p>
          <div className="filter-row">
            {[10, 20, 30].map((c) => (
              <button
                key={c}
                type="button"
                className={`chip ${count === c ? 'active' : ''}`}
                onClick={() => setCount(c)}
              >
                {c} câu
              </button>
            ))}
          </div>
          {bestScore[`hsk${level}`] != null && (
            <p className="best-score">
              Điểm cao nhất của bạn (HSK {level}): {bestScore[`hsk${level}`]}
            </p>
          )}
          <button type="button" className="btn btn-primary" onClick={start}>
            Bắt đầu
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="page quiz-page">
      <div className="quiz-header">
        <span>
          Câu {index + 1} / {questions.length}
        </span>
        <span className="quiz-level">HSK {level}</span>
      </div>
      <div className="quiz-progress">
        <div
          className="quiz-progress-bar"
          style={{ width: `${((index + (selected != null ? 1 : 0)) / questions.length) * 100}%` }}
        />
      </div>
      <div className="quiz-prompt">
        {q.promptType === 0 || q.promptType === 2 ? (
          <>
            <div className="quiz-hanzi">{q.prompt}</div>
            <AudioButton text={q.prompt} />
          </>
        ) : (
          <div className="quiz-prompt-text">{q.prompt}</div>
        )}
      </div>
      <div className="quiz-options">
        {q.options.map((opt, i) => (
          <button
            key={i}
            type="button"
            className={`quiz-option ${
              selected != null
                ? opt === q.answer
                  ? 'correct'
                  : opt === selected
                    ? 'wrong'
                    : ''
                : ''
            }`}
            onClick={() => choose(opt)}
            disabled={selected != null}
          >
            {opt}
          </button>
        ))}
      </div>
      {selected != null && (
        <button type="button" className="btn btn-primary" onClick={next}>
          {index + 1 >= questions.length ? 'Xem kết quả' : 'Câu tiếp theo →'}
        </button>
      )}
    </div>
  )
}
