import React, { useEffect, useState } from "react";
import "./App.css";

const getBallColor = (number) => {
  if (number <= 10) return "yellow";
  if (number <= 20) return "blue";
  if (number <= 30) return "red";
  if (number <= 40) return "gray";
  return "green";
};

function generateGame() {
  const numbers = Array.from({ length: 45 }, (_, i) => i + 1);
  for (let i = numbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
  }

  const mainNumbers = numbers.slice(0, 5).sort((a, b) => a - b);
  const bonusNumber = numbers[5];
  return { numbers: mainNumbers, bonus: bonusNumber };
}

function App() {
  const [results, setResults] = useState([]);
  const [history, setHistory] = useState([]);
  const [copied, setCopied] = useState(false);
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("lottopick-theme") === "light" ? "light" : "dark";
    } catch {
      return "dark";
    }
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("lottopick-theme", theme);
    } catch {
      // Theme still works for this session if storage is unavailable.
    }
  }, [theme]);

  const toggleTheme = () => setTheme((current) => current === "dark" ? "light" : "dark");

  const recommend = () => {
    const newResults = Array.from({ length: 5 }, generateGame);
    setResults(newResults);
    setHistory((prev) => [...newResults, ...prev].slice(0, 20));
    setCopied(false);
  };

  const recommendMore = () => {
    const newResults = Array.from({ length: 5 }, generateGame);
    setResults((prev) => [...prev, ...newResults]);
    setHistory((prev) => [...newResults, ...prev].slice(0, 20));
    setCopied(false);
  };

  const copyNumbers = async (game) => {
    const text = [...game.numbers, "+", game.bonus].join(" ");
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      window.prompt("번호를 복사하세요.", text);
    }
  };

  const renderGameNumbers = (game, compact = false) => (
    <>
      {game.numbers.map((number) => (
        <span key={number} className={`${compact ? "mini-ball" : "ball"} ${getBallColor(number)}`}>{number}</span>
      ))}
      <span className={compact ? "mini-plus" : "bonus-plus"} aria-label="보너스 번호 구분">+</span>
      <span className={`${compact ? "mini-ball" : "ball"} bonus-ball ${getBallColor(game.bonus)}`}>{game.bonus}</span>
    </>
  );

  return (
    <main className={`app ${theme}-theme`}>
      <header className="header">
        <a className="logo" href="#" aria-label="LottoPick 홈">
          <span className="logo-icon">L</span>
          <span>Lotto<span className="green">Pick</span></span>
        </a>
        <div className="header-actions">
          <span className="header-label">LOTTO 6/45</span>
          <button className="theme-toggle" type="button" onClick={toggleTheme} aria-label={theme === "dark" ? "화이트모드로 변경" : "다크모드로 변경"} title={theme === "dark" ? "화이트모드" : "다크모드"}>
            <span aria-hidden="true">{theme === "dark" ? "☀" : "☾"}</span>
            <span>{theme === "dark" ? "화이트모드" : "다크모드"}</span>
          </button>
        </div>
      </header>

      <section className="hero">
        <div className="eyebrow"><span className="status-dot" />YOUR LUCKY NUMBERS</div>
        <h1>오늘의 행운을<br /><span className="green">번호로 만나보세요.</span></h1>
        <p className="description">게임마다 로또 번호 5개와 보너스 번호 1개를 추천합니다.</p>

        <section className="generator" aria-labelledby="generator-title">
          <div className="generator-top">
            <div>
              <h2 id="generator-title">행운 번호 생성기</h2>
              <p>한 번에 5게임씩 새로운 번호를 추천합니다.</p>
            </div>
            <span className="round-tag">5 GAMES</span>
          </div>
          <button className="generate-btn" type="button" onClick={recommend}>
            <span aria-hidden="true">✦</span> 로또 번호 추천받기
          </button>
          <p className="notice">다시 추천받으면 현재 추천 목록이 새 번호 5게임으로 바뀝니다.</p>
        </section>
      </section>

      {results.length > 0 && (
        <section className="results" aria-labelledby="results-title">
          <div className="section-heading">
            <div><h2 id="results-title">추천 번호 <span className="result-count">{results.length}게임</span></h2><p>‘+’ 오른쪽 숫자는 보너스 번호입니다.</p></div>
            <button className="text-btn" type="button" onClick={recommendMore}>＋ 5게임 더 추천</button>
          </div>
          <div className="result-grid">
            {results.map((game, index) => (
              <article className="result-card" key={`${index}-${game.numbers.join("-")}-${game.bonus}`}>
                <div className="result-card-top">
                  <span>GAME {String(index + 1).padStart(2, "0")}</span>
                  <button className="copy-btn" type="button" onClick={() => copyNumbers(game)} aria-label={`${index + 1}번 게임 번호 복사`}>복사</button>
                </div>
                <div className="balls" aria-label={`로또 번호 ${game.numbers.join(", ")} 보너스 번호 ${game.bonus}`}>
                  {renderGameNumbers(game)}
                </div>
              </article>
            ))}
          </div>
          {copied && <p className="copy-message" role="status">번호가 복사되었습니다!</p>}
        </section>
      )}

      <section className="history-section" aria-labelledby="history-title">
        <div className="section-heading">
          <div><h2 id="history-title">최근 추천 번호</h2><p>이번 접속 중 생성한 최근 20게임입니다.</p></div>
        </div>
        {history.length === 0 ? (
          <div className="empty-state"><span aria-hidden="true">◎</span><p>아직 추천 번호가 없습니다.</p><p>로또 번호 추천받기를 눌러 시작하세요.</p></div>
        ) : (
          <div className="history-list">
            {history.map((game, index) => (
              <div className="history-row" key={`${index}-${game.numbers.join("-")}-${game.bonus}`}>
                <span className="history-index">{String(index + 1).padStart(2, "0")}</span>
                <div className="mini-balls" aria-label={`로또 번호 ${game.numbers.join(", ")} 보너스 번호 ${game.bonus}`}>
                  {renderGameNumbers(game, true)}
                </div>
                <button className="copy-btn" type="button" onClick={() => copyNumbers(game)}>복사</button>
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
