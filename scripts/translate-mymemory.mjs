// Dịch nghĩa tiếng Anh (CC-CEDICT) → tiếng Việt qua MyMemory Free API.
// Giới hạn: 1000 request/ngày (theo IP). Script có checkpoint, chạy lại được.
// Cách dùng: node scripts/translate-mymemory.mjs [số-lượng-tối-đa]
//   - Mặc định dịch tối đa 950 từ/lần chạy (chừa quota an toàn)
//   - Chạy lại nhiều lần trong nhiều ngày để dịch dần toàn bộ
import { readFileSync, writeFileSync, existsSync } from 'node:fs'

const SCRATCH = 'C:/Users/Hp/AppData/Local/Temp/commandcode/C--Users-Hp-hsk-web/353dd39c-151d-48c9-b312-5258909bc118/scratchpad'
const OUT = 'src/data/vocabulary.json'
const CHECKPOINT = `${SCRATCH}/vi-mymemory.json`

const MAX_PER_RUN = parseInt(process.argv[2] || '950', 10)
const DELAY_MS = 300 // tránh rate-limit

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// Đọc vocabulary.json hiện tại
const vocab = JSON.parse(readFileSync(OUT, 'utf8'))
const translations = existsSync(CHECKPOINT) ? JSON.parse(readFileSync(CHECKPOINT, 'utf8')) : {}

// Các từ chưa có nghĩa Việt (meaningVi đang là tiếng Anh thuần = meaningEn)
// Dùng checkpoint làm nguồn chân lý để tránh dịch lại từ đã dịch
const todo = vocab.filter(
  (w) =>
    !translations[w.meaningEn] &&
    w.meaningVi === w.meaningEn, // meaningVi chưa được thay thế
)

console.log(`Total words: ${vocab.length}, already translated: ${Object.keys(translations).length}, to do: ${todo.length}`)
console.log(`Running up to ${MAX_PER_RUN} requests...`)

let done = 0
let quotaExhausted = false
let consecutiveFails = 0

for (const w of todo) {
  if (done >= MAX_PER_RUN) {
    console.log(`Reached max ${MAX_PER_RUN} for this run.`)
    break
  }
  const text = w.meaningEn
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|vi`
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 15000)
    const res = await fetch(url, { signal: controller.signal })
    clearTimeout(timer)
    const data = await res.json()
    const raw = data.responseData?.translatedText || ''
    let vi = raw.replace(/<[^>]+>/g, '').trim()
    // Dừng khi hết quota (API trả warning thay vì bản dịch)
    if (
      data.quotaFinished ||
      vi.includes('MYMEMORY WARNING') ||
      vi.includes('USED ALL AVAILABLE') ||
      raw.includes('QUERY LENGTH LIMIT')
    ) {
      console.log('Quota exhausted or API limit — stopping.')
      quotaExhausted = true
      break
    }
    if (data.responseStatus === 200 && vi) {
      if (!translations[w.meaningEn]) translations[w.meaningEn] = vi
      done++
      consecutiveFails = 0
      if (done % 25 === 0) console.log(`  ${done}/${MAX_PER_RUN} (total ${Object.keys(translations).length})`)
    } else {
      // Không có bản dịch hợp lệ — đếm lỗi liên tiếp, dừng nếu quá nhiều
      consecutiveFails++
      console.log(`  no translation for: ${text.slice(0, 40)} (status ${data.responseStatus})`)
      if (consecutiveFails >= 5) {
        console.log('Too many consecutive failures — stopping.')
        break
      }
    }
  } catch (e) {
    consecutiveFails++
    console.log(`Error for "${text.slice(0, 40)}": ${e.message}`)
    if (consecutiveFails >= 5) {
      console.log('Too many consecutive errors — stopping.')
      break
    }
  }
  await sleep(DELAY_MS)
}

// Ghi checkpoint + cập nhật vocabulary.json
writeFileSync(CHECKPOINT, JSON.stringify(translations))
let updated = 0
for (const w of vocab) {
  if (translations[w.meaningEn] && w.meaningVi !== translations[w.meaningEn]) {
    w.meaningVi = translations[w.meaningEn]
    updated++
  }
}
writeFileSync(OUT, JSON.stringify(vocab))
console.log(`DONE. Translated ${done} this run. Total translations: ${Object.keys(translations).length}. Updated vocab: ${updated}.`)
if (quotaExhausted) console.log('NOTE: quota hết — chạy lại script vào ngày mai để dịch tiếp.')
