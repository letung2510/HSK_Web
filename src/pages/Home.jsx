import { Link } from 'react-router-dom'
import vocabulary from '../data/vocabulary.json'
import grammar from '../data/grammar.json'

const LEVEL_INFO = [
  { level: 1, desc: '150 từ cơ bản nhất — chào hỏi, số đếm, gia đình' },
  { level: 2, desc: '150 từ mở rộng — sinh hoạt hàng ngày, công việc' },
  { level: 3, desc: '300 từ — giao tiếp tự tin trong nhiều tình huống' },
  { level: 4, desc: '600 từ — gần đạt trình độ trung cấp' },
]

export default function Home() {
  const vocabCount = vocabulary.length
  const grammarCount = grammar.length
  const levelCounts = [1, 2, 3, 4].map(
    (l) => vocabulary.filter((w) => w.hsk === l).length,
  )

  return (
    <div className="home">
      <section className="hero-section">
        <h1>Học tiếng Trung miễn phí</h1>
        <p className="subtitle">
          {vocabCount} từ vựng + {grammarCount} chủ điểm ngữ pháp HSK 1-4 —
          flashcard, quiz và phát âm chuẩn ngay trong trình duyệt.
        </p>
        <div className="hero-actions">
          <Link to="/vocabulary" className="btn btn-primary">
            Học từ vựng
          </Link>
          <Link to="/grammar" className="btn">
            Ngữ pháp
          </Link>
        </div>
      </section>

      <section className="stats">
        {LEVEL_INFO.map((info, i) => (
          <Link to="/vocabulary" className="stat-card" key={info.level}>
            <div className="stat-level">HSK {info.level}</div>
            <div className="stat-count">{levelCounts[i]} từ</div>
            <div className="stat-desc">{info.desc}</div>
          </Link>
        ))}
      </section>

      <section className="features">
        <div className="feature-card">
          <h3>📖 Từ vựng</h3>
          <p>Tìm kiếm nhanh theo chữ Hán, pinyin, nghĩa Việt — kèm phát âm.</p>
        </div>
        <div className="feature-card">
          <h3>🃏 Flashcard</h3>
          <p>Ôn tập theo trí nhớ, tự động lưu tiến độ trên máy.</p>
        </div>
        <div className="feature-card">
          <h3>✅ Quiz</h3>
          <p>Trắc nghiệm 4 dạng câu hỏi, chấm điểm và xem lại đáp án.</p>
        </div>
        <div className="feature-card">
          <h3>📚 Ngữ pháp</h3>
          <p>{grammarCount} chủ điểm từ cơ bản đến trung cấp, kèm ví dụ.</p>
        </div>
      </section>
    </div>
  )
}
