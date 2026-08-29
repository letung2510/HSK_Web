import { useSpeech } from '../hooks/useSpeech'

const POS_VI = {
  名: 'danh từ',
  动: 'động từ',
  形: 'tính từ',
  副: 'phó từ',
  代: 'đại từ',
  数: 'số từ',
  量: 'lượng từ',
  介: 'giới từ',
  连: 'liên từ',
  助: 'trợ từ',
  叹: 'thán từ',
  拟声: 'từ tượng thanh',
  前缀: 'tiền tố',
  后缀: 'hậu tố',
  成语: 'thành ngữ',
  数量: 'số lượng từ',
}

export default function WordCard({ word, showPinyin = true, showAudio = true }) {
  const { supported, speak } = useSpeech()

  return (
    <div className="word-card">
      <div className="word-card-main">
        <button
          type="button"
          className={`hanzi ${supported && showAudio ? 'clickable' : ''}`}
          onClick={() => speak(word.hanzi)}
          title="Bấm để nghe phát âm"
          disabled={!supported || !showAudio}
        >
          {word.hanzi}
        </button>
        {showPinyin && <div className="pinyin">{word.pinyin}</div>}
        <div className="pos">{word.pos.map((p) => POS_VI[p] ?? p).join(', ')}</div>
      </div>
      <div className="word-card-meaning">{word.meaningVi}</div>
      {supported && showAudio && (
        <button
          type="button"
          className="audio-btn"
          onClick={() => speak(word.hanzi)}
          aria-label={`Phát âm ${word.hanzi}`}
        >
          🔊
        </button>
      )}
    </div>
  )
}
