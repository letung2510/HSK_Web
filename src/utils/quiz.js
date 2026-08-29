import { sample, shuffle } from './shuffle'

// Sinh câu hỏi trắc nghiệm từ danh sách từ vựng.
// 4 dạng: Hán→nghĩa Việt, nghĩa Việt→Hán, Hán→pinyin, pinyin→Hán.
// Trả về mảng câu hỏi, mỗi câu: { word, prompt, promptType, options, answer }
export function generateQuiz(words, count) {
  const pool = shuffle(words)
  const picked = pool.slice(0, Math.min(count, pool.length))
  return picked.map((word) => makeQuestion(word, pool))
}

function makeQuestion(word, pool) {
  const type = Math.floor(Math.random() * 4)
  const distractors = sample(
    pool.filter((w) => w.hanzi !== word.hanzi),
    3,
  )
  const question = { word, promptType: type }

  if (type === 0) {
    // Chữ Hán → chọn nghĩa tiếng Việt
    question.prompt = word.hanzi
    question.options = shuffle([word, ...distractors]).map((w) => w.meaningVi)
    question.answer = word.meaningVi
  } else if (type === 1) {
    // Nghĩa tiếng Việt → chọn chữ Hán
    question.prompt = word.meaningVi
    question.options = shuffle([word, ...distractors]).map((w) => w.hanzi)
    question.answer = word.hanzi
  } else if (type === 2) {
    // Chữ Hán → chọn pinyin
    question.prompt = word.hanzi
    question.options = shuffle([word, ...distractors]).map((w) => w.pinyin)
    question.answer = word.pinyin
  } else {
    // Pinyin → chọn chữ Hán
    question.prompt = word.pinyin
    question.options = shuffle([word, ...distractors]).map((w) => w.hanzi)
    question.answer = word.hanzi
  }
  return question
}
