import { useSpeech } from '../hooks/useSpeech'

const POS_VI = {
  n: 'danh từ',
  v: 'động từ',
  adj: 'tính từ',
  adv: 'phó từ',
  pron: 'đại từ',
  num: 'số từ',
  classifier: 'lượng từ',
  prep: 'giới từ',
  conj: 'liên từ',
  time: 'danh từ thời gian',
  part: 'trợ từ',
  aux: 'trợ từ',
  morph: 'hình vị',
  int: 'thán từ',
  onom: 'từ tượng thanh',
  expr: 'thành ngữ',
  idiom: 'thành ngữ',
  abbr: 'từ viết tắt',
  suf: 'hậu tố',
  pref: 'tiền tố',
  sym: 'ký hiệu',
  mq: 'số lượng từ',
  qv: 'đại từ nghi vấn',
  qt: 'lượng từ',
  cc: 'liên từ',
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
