// Chuẩn hóa chuỗi để so sánh: bỏ khoảng trắng, ký tự đặc biệt
function normalize(s) {
  return String(s ?? '').replace(/[\s，。！？、,.!?]/g, '')
}

// Tính tỉ lệ khớp giữa transcript và từ đích (0-1)
// So sánh ký tự Hán theo thứ tự + đếm số ký tự trùng
function similarity(a, b) {
  if (!a || !b) return 0
  if (a === b) return 1
  let match = 0
  const len = Math.max(a.length, b.length)
  for (let i = 0; i < len; i++) {
    if (a[i] === b[i]) match++
  }
  // Cũng tính số ký tự chung (không cần cùng vị trí) để bắt gần đúng
  const seen = new Set()
  let common = 0
  for (const ch of a) {
    if (b.includes(ch) && !seen.has(ch)) {
      common++
      seen.add(ch)
    }
  }
  return Math.max(match / len, common / len)
}

// So sánh transcript với từ đích, trả về kết quả đánh giá
export function compareSpeech(transcript, target) {
  const heard = normalize(transcript)
  const expected = normalize(target)
  if (!heard) return { score: 0, level: 'none', message: 'Chưa nghe thấy gì' }

  const exact = heard === expected
  const sim = similarity(heard, expected)
  let level = 'wrong'
  let message = 'Chưa đúng, thử lại nhé'
  if (exact || sim >= 0.8) {
    level = 'perfect'
    message = 'Tuyệt vời! Phát âm chuẩn 🎉'
  } else if (sim >= 0.5) {
    level = 'close'
    message = 'Gần đúng rồi! Nghe lại và thử lần nữa'
  } else {
    message = 'Chưa đúng. Bấm 🔊 nghe lại rồi thử nhé'
  }
  return { score: Math.round(sim * 100), level, message, heard, expected }
}
