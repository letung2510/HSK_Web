export default function SearchBar({ value, onChange, placeholder }) {
  return (
    <input
      type="search"
      className="search-bar"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder ?? 'Tìm theo chữ Hán, pinyin hoặc nghĩa tiếng Việt…'}
    />
  )
}
