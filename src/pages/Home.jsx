import { Link } from 'react-router-dom'
import vocabulary from '../data/vocabulary.json'
import grammar from '../data/grammar.json'

const LEVEL_INFO = [
  { level: 1, desc: '300 từ cơ bản nhất — chào hỏi, số đếm, gia đình' },
  { level: 2, desc: '204 từ mở rộng — sinh hoạt hàng ngày, công việc' },
  { level: 3, desc: '507 từ — giao tiếp tự tin trong nhiều tình huống' },
  { level: 4, desc: '1019 từ — trình độ trung cấp' },
  { level: 5, desc: '1638 từ — nâng cao' },
  { level: 6, desc: '1815 từ — cao cấp' },
  { level: 7, desc: '1874 từ — thành thạo' },
  { level: 8, desc: '1874 từ — chuyên sâu' },
  { level: 9, desc: '1874 từ — tinh thông' },
]

export default function Home() {
  const vocabCount = vocabulary.length
  const grammarCount = grammar.length
  const levelCounts = [1, 2, 3, 4, 5, 6, 7, 8, 9].map(
    (l) => vocabulary.filter((w) => w.hsk === l).length,
  )

  return (
    <div className="home">
      <section className="hero-section">
        <h1>Học tiếng Trung miễn phí</h1>
        <p className="subtitle">
          {vocabCount} từ vựng + {grammarCount} chủ điểm ngữ pháp HSK 3.0 (1-9) —
          flashcard, quiz và phát âm chuẩn ngay trong trình duyệt.
        </p>
        <div className="hero-actions">
          <Link to="/vocabulary" className="btn btn-primary">
            Học từ vựng
          </Link>
          <Link to="/speaking" className="btn btn-primary">
            🎤 Luyện nói
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
        <Link to="/vocabulary" className="feature-card">
          <h3>📖 Từ vựng</h3>
          <p>Tìm kiếm nhanh theo chữ Hán, pinyin, nghĩa Việt — kèm phát âm.</p>
        </Link>
        <Link to="/flashcard" className="feature-card">
          <h3>🃏 Flashcard</h3>
          <p>Ôn tập theo trí nhớ, tự động lưu tiến độ trên máy.</p>
        </Link>
        <Link to="/quiz" className="feature-card">
          <h3>✅ Quiz</h3>
          <p>Trắc nghiệm 4 dạng câu hỏi, chấm điểm và xem lại đáp án.</p>
        </Link>
        <Link to="/speaking" className="feature-card">
          <h3>🎤 Luyện nói</h3>
          <p>Đọc theo từ mẫu, nhận dạng giọng nói và chấm điểm phát âm.</p>
        </Link>
        <Link to="/grammar" className="feature-card">
          <h3>📚 Ngữ pháp</h3>
          <p>{grammarCount} chủ điểm từ cơ bản đến nâng cao, kèm ví dụ.</p>
        </Link>
      </section>
    </div>
  )
}
