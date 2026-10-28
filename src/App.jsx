import { useState } from "react";
import "./App.css";

const getBallColor = (number) => {
  if (number <= 10) return "yellow";
  if (number <= 20) return "blue";
  if (number <= 30) return "red";
  if (number <= 40) return "gray";
  return "green";
};

function generateNumbers() {
  const numbers = Array.from({ length: 45 }, (_, i) => i + 1);
  for (let i = numbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
  }
  return numbers.slice(0, 6).sort((a, b) => a - b);
}

function App() {
  const [count, setCount] = useState(5);
  const [results, setResults] = useState([]);
  const [history, setHistory] = useState([]);
  const [copied, setCopied] = useState(false);

  const recommend = () => {
    const newResults = Array.from({ length: count }, () => generateNumbers());
    setResults(newResults);
    setHistory((prev) => [...newResults, ...prev].slice(0, 20));
    setCopied(false);
  };

  const copyNumbers = async (numbers) => {
    const text = numbers.join(", ");
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      window.prompt("번호를 복사하세요.", text);
    }
  };

  return (
    <main className="app">
      <header className="header">
        <a className="logo" href="#" aria-label="LottoPick 홈">
          <span className="logo-icon">L</span>
          <span>Lotto<span className="green">Pick</span></span>
        </a>
        <span className="header-label">LOTTO 6/45</span>
      </header>

      <section className="hero">
        <div className="eyebrow"><span className="status-dot" />YOUR LUCKY NUMBERS</div>
        <h1>오늘의 행운을<br /><span className="green">번호로 만나보세요.</span></h1>
        <p className="description">1부터 45까지, 중복 없이 6개의 번호를 추천해 드립니다.</p>

        <section className="generator" aria-labelledby="generator-title">
          <div className="generator-top">
            <div>
              <h2 id="generator-title">행운 번호 생성기</h2>
              <p>원하는 추천 조합 수를 선택하세요.</p>
            </div>
            <span className="round-tag">6 / 45</span>
          </div>
          <div className="count-options" aria-label="추천 조합 수">
            {[1, 5, 10].map((value) => (
              <button key={value} type="button"
                className={count === value ? "count active" : "count"}
                onClick={() => setCount(value)} aria-pressed={count === value}>
                {value}조합
              </button>
            ))}
          </div>
          <button className="generate-btn" type="button" onClick={recommend}>
            <span aria-hidden="true">✦</span> 행운 번호 추천받기
          </button>
          <p className="notice">모든 번호 조합은 무작위로 생성됩니다.</p>
        </section>
      </section>

      {results.length > 0 && (
        <section className="results" aria-labelledby="results-title">
          <div className="section-heading">
            <div><h2 id="results-title">추천 번호</h2><p>마음에 드는 조합을 선택해 보세요.</p></div>
            <button className="text-btn" type="button" onClick={recommend}>↻ 다시 추천</button>
          </div>
          <div className="result-grid">
            {results.map((numbers, index) => (
              <article className="result-card" key={index}>
                <div className="result-card-top">
                  <span>COMBINATION {index + 1}</span>
                  <button className="copy-btn" type="button"
                    onClick={() => copyNumbers(numbers)}
                    aria-label={`${index + 1}번 조합 복사`}>복사</button>
                </div>
                <div className="balls" aria-label={numbers.join(", ")}>
                  {numbers.map((number) => <span key={number} className={`ball ${getBallColor(number)}`}>{number}</span>)}
                </div>
              </article>
            ))}
          </div>
          {copied && <p className="copy-message" role="status">번호가 복사되었습니다!</p>}
        </section>
      )}

      <section className="history-section" aria-labelledby="history-title">
        <div className="section-heading">
          <div><h2 id="history-title">최근 추천 번호</h2><p>이번 접속 중 생성한 번호입니다.</p></div>
        </div>
        {history.length === 0 ? (
          <div className="empty-state"><span aria-hidden="true">◎</span><p>아직 추천 번호가 없습니다.</p><p>행운 번호 추천받기를 눌러 시작하세요.</p></div>
        ) : (
          <div className="history-list">
            {history.map((numbers, index) => (
              <div className="history-row" key={`${index}-${numbers.join("-")}`}>
                <span className="history-index">{String(index + 1).padStart(2, "0")}</span>
                <div className="mini-balls" aria-label={numbers.join(", ")}>
                  {numbers.map((number) => <span className={`mini-ball ${getBallColor(number)}`} key={number}>{number}</span>)}
                </div>
                <button className="copy-btn" type="button" onClick={() => copyNumbers(numbers)}>복사</button>
              </div>
            ))}
          </div>
        )}
      </section>

      <footer className="footer">
        <p>LOTTO PICK</p>
        <span>본 서비스는 번호 추천 도구이며 당첨을 보장하지 않습니다.</span>
      </footer>
    </main>
  );
}

export default App;