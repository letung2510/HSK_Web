// Tra pinyin-pro cho các trường hợp đặc biệt: pinyin theo ngữ cảnh từ nghĩa
import { pinyin } from 'pinyin-pro'

const cases = [
  // [hanzi, meaningVi để xác định ngữ cảnh]
  ['了', 'rồi (trợ từ chỉ hành động đã xảy ra)'],
  ['还', 'vẫn; còn; cũng'],
  ['着', 'đang (trợ từ); chiêu; nước cờ'],
  ['地', '(trợ từ) một cách'],
  ['行', 'hàng, dãy; ngành nghề; công ty'],
  ['大夫', 'bác sĩ; đại phu (quan thời xưa)'],
  ['弹', 'đạn; viên đạn'],
  ['重点', 'trọng điểm; điểm chính'],
  ['便宜', 'rẻ; tiện lợi'],
  ['谁', 'ai'],
]

for (const [hanzi, vi] of cases) {
  const p = pinyin(hanzi, { toneType: 'symbol' })
  const p2 = pinyin(hanzi, { toneType: 'symbol', type: 'array' }).join(' ')
  console.log(`${hanzi} | ${p} | [${p2}] | nghĩa: ${vi}`)
}
