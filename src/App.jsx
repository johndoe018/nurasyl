import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowDownToLine,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  BookOpen,
  Bookmark,
  Check,
  CheckCheck,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Clock3,
  Code2,
  CornerDownLeft,
  ExternalLink,
  Home,
  Layers3,
  Lightbulb,
  LoaderCircle,
  LockKeyhole,
  Moon,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  Sprout,
  Sun,
  TrendingUp,
  Triangle,
  X,
  Zap,
} from "lucide-react";
import { LEVELS, checkAnswer, makeProblem, pretty } from "./math.js";
import { buildMessages } from "./prompts.js";

const BASE = import.meta.env.BASE_URL;
const EMPTY_DATA = { completed: [], history: [], bookmarks: [], theme: "dark" };

function readSaved() {
  try {
    const data = JSON.parse(localStorage.getItem("axiom-learning-v1"));
    if (
      !data ||
      !Array.isArray(data.completed) ||
      !Array.isArray(data.history) ||
      !Array.isArray(data.bookmarks)
    )
      return EMPTY_DATA;
    return {
      ...EMPTY_DATA,
      ...data,
      history: data.history
        .filter(
          (row) =>
            row &&
            LEVELS.some((level) => level.id === row.level) &&
            Number.isSafeInteger(row.variation) &&
            row.variation >= 0,
        )
        .slice(0, 100),
    };
  } catch {
    return EMPTY_DATA;
  }
}

function Logo({ small = false }) {
  return (
    <span className={`brand ${small ? "brand-small" : ""}`}>
      <svg viewBox="0 0 36 36" aria-hidden="true">
        <path
          d="M5 29 18 5l13 24H5Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path d="m11 18 14 11" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="18" cy="5" r="2.8" fill="#1d9bf0" />
      </svg>
      {!small && (
        <span>
          axiom<span className="brand-period">.</span>
        </span>
      )}
    </span>
  );
}

function Avatar({ size = "", person = false }) {
  return (
    <span className={`avatar ${size} ${person ? "person-avatar" : ""}`}>
      {person ? "NN" : <Logo small />}
    </span>
  );
}

function TriangleDiagram({ problem, compact = false }) {
  const { level, a, b, c, unit } = problem;
  if (level === "advanced")
    return (
      <div className={`diagram ${compact ? "compact" : ""}`}>
        <span className="diagram-tag">
          <span className="live-dot" />
          EXPLORE THE SURFACE
        </span>
        <svg
          viewBox="0 0 500 220"
          role="img"
          aria-label={`Rectangular box with dimensions ${a}, ${b}, and ${c} centimetres. Find a route along its surface between opposite corners.`}
        >
          <defs>
            <linearGradient id="boxFill" x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="#1d9bf0" stopOpacity=".12" />
              <stop offset="1" stopColor="#1d9bf0" stopOpacity=".02" />
            </linearGradient>
          </defs>
          <path
            d="M126 73 310 73 375 33 191 33Z"
            fill="url(#boxFill)"
            stroke="#516474"
            strokeWidth="1.5"
          />
          <path
            d="M310 73 375 33 375 146 310 186Z"
            fill="#1d9bf0"
            fillOpacity=".08"
            stroke="#516474"
            strokeWidth="1.5"
          />
          <path
            d="M126 73H310V186H126Z"
            fill="url(#boxFill)"
            stroke="#8ba3b6"
            strokeWidth="1.5"
          />
          <path
            d={`M126 73 ${191 + (184 * a) / (a + b)} 33 375 146`}
            fill="none"
            stroke="#1d9bf0"
            strokeWidth="2.8"
            strokeDasharray="6 5"
          />
          <path
            d="M126 186 191 146H375M191 33V146"
            fill="none"
            stroke="#516474"
            strokeDasharray="4 5"
          />
          <circle cx="126" cy="73" r="4.5" fill="#1d9bf0" />
          <circle cx="375" cy="146" r="4.5" fill="#1d9bf0" />
          <text x="215" y="210" textAnchor="middle">
            {c} cm
          </text>
          <text x="103" y="134" textAnchor="end">
            {b} cm
          </text>
          <text x="353" y="24" textAnchor="middle">
            {a} cm
          </text>
          <text x="113" y="59" className="point-label">
            A
          </text>
          <text x="389" y="151" className="point-label">
            B
          </text>
        </svg>
        <div className="diagram-caption">
          A new dimension. The same theorem.
        </div>
      </div>
    );
  const isStandard = level === "standard";
  return (
    <div className={`diagram ${compact ? "compact" : ""}`}>
      <span className="diagram-tag">
        <span className="live-dot" />
        {isStandard
          ? "FROM THEORY TO THE REAL WORLD"
          : "EVERY SIDE HAS A STORY"}
      </span>
      <svg
        viewBox="0 0 500 220"
        role="img"
        aria-label={`Right triangle. Horizontal leg ${a} ${unit}, vertical leg ${isStandard ? "unknown" : b + " " + unit}, hypotenuse ${isStandard ? c + " " + unit : "unknown"}.`}
      >
        <defs>
          <linearGradient id="triangleFill" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#1d9bf0" stopOpacity=".16" />
            <stop offset="1" stopColor="#1d9bf0" stopOpacity=".02" />
          </linearGradient>
        </defs>
        {isStandard && (
          <>
            <path
              d="M147 22v159h229"
              stroke="#536471"
              strokeWidth="7"
              fill="none"
              strokeLinecap="square"
            />
            <path
              d="M134 40h-12m12 25h-12m12 25h-12m12 25h-12m12 25h-12"
              stroke="#536471"
              strokeWidth="1"
            />
          </>
        )}
        <path d="M155 178V40L357 178Z" fill="url(#triangleFill)" />
        <path
          d="M155 40V178H357"
          fill="none"
          stroke="#d4e3ec"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M155 40 357 178"
          fill="none"
          stroke="#1d9bf0"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={isStandard ? undefined : "7 6"}
        />
        {isStandard && (
          <path
            d="m173 55-5 8m23 5-5 8m23 5-5 8m23 5-5 8m23 5-5 8m23 5-5 8m23 5-5 8m23 5-5 8m23 5-5 8"
            stroke="#1d9bf0"
            strokeWidth="2"
          />
        )}
        <path
          d="M155 159h19v19"
          fill="none"
          stroke="#8ba3b6"
          strokeWidth="1.5"
        />
        <circle cx="155" cy="40" r="3.5" fill="#d4e3ec" />
        <circle cx="155" cy="178" r="3.5" fill="#d4e3ec" />
        <circle cx="357" cy="178" r="3.5" fill="#1d9bf0" />
        <text
          x="131"
          y="112"
          textAnchor="end"
          className={isStandard ? "unknown-label" : ""}
        >
          {isStandard ? "h = ?" : `${b} ${unit}`}
        </text>
        <text x="257" y="207" textAnchor="middle">
          {a} {unit}
        </text>
        <g transform="translate(278 94) rotate(34)">
          <rect
            x="-38"
            y="-17"
            width="76"
            height="28"
            rx="14"
            className="side-label-bg"
          />
          <text
            textAnchor="middle"
            y="3"
            className={!isStandard ? "unknown-label" : ""}
          >
            {isStandard ? `${c} ${unit}` : "c = ?"}
          </text>
        </g>
      </svg>
      <div className="diagram-caption">
        {isStandard ? (
          "Find the height. Reach a little higher."
        ) : (
          <>
            a² + b² = c² <span>·</span> A classic for a reason.
          </>
        )}
      </div>
    </div>
  );
}

function Modal({ onClose, children, title }) {
  const ref = useRef();
  useEffect(() => {
    const original = document.activeElement;
    ref.current?.querySelector("button")?.focus();
    const handler = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab") return;
      const elements = ref.current.querySelectorAll(
        'button, a[href], input, [tabindex="0"]',
      );
      const first = elements[0],
        last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handler);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = overflow;
      original?.focus();
    };
  }, [onClose]);
  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        ref={ref}
      >
        <button
          className="icon-button modal-close"
          onClick={onClose}
          aria-label="Close dialog"
        >
          <X size={21} />
        </button>
        <div className="modal-logo">
          <Logo />
        </div>
        <h2 id="modal-title">{title}</h2>
        {children}
      </section>
    </div>
  );
}

function App() {
  const [saved, setSaved] = useState(readSaved);
  const [view, setView] = useState("learn");
  const [level, setLevel] = useState("foundation");
  const [variation, setVariation] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [hints, setHints] = useState(0);
  const [solution, setSolution] = useState(false);
  const [modal, setModal] = useState(null);
  const closeModal = useCallback(() => setModal(null), []);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [ai, setAi] = useState({
    status: "idle",
    text: "",
    error: "",
    progress: 0,
  });
  const worker = useRef(null);
  const requestId = useRef(0);
  const requestTimer = useRef(null);
  const inputRef = useRef(null);
  const problem = makeProblem(level, variation);
  const levelInfo = LEVELS.find((item) => item.id === level);
  const bookmarked = saved.bookmarks.includes(problem.id);
  const solved = saved.history.some(
    (row) => row.id === problem.id && row.correct && !row.revealed,
  );
  const mastered = LEVELS.filter((item) => saved.completed.includes(item.id));
  const totalCorrect = new Set(
    saved.history
      .filter((row) => row.correct && !row.revealed)
      .map((row) => row.id),
  ).size;

  useEffect(() => {
    document.documentElement.dataset.theme = saved.theme;
    try {
      localStorage.setItem("axiom-learning-v1", JSON.stringify(saved));
    } catch {
      /* Private browsing or storage quota: keep this session usable. */
    }
  }, [saved]);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 3500);
    return () => clearTimeout(timer);
  }, [toast]);
  useEffect(
    () => () => {
      worker.current?.terminate();
      clearTimeout(requestTimer.current);
    },
    [],
  );

  function resetProblem(nextLevel = level, nextVariation = variation) {
    requestId.current += 1;
    worker.current?.terminate();
    worker.current = null;
    clearTimeout(requestTimer.current);
    setLevel(nextLevel);
    setVariation(nextVariation);
    setAnswer("");
    setFeedback(null);
    setHints(0);
    setSolution(false);
    setAi({ status: "idle", text: "", error: "", progress: 0 });
  }

  function navigate(next) {
    setView(next);
    setSearchOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function startPractice(nextLevel = "foundation", nextVariation = 0) {
    resetProblem(nextLevel, nextVariation);
    navigate("learn");
  }

  function submitAnswer(event) {
    event.preventDefault();
    const result = checkAnswer(answer, problem);
    setFeedback(result);
    if (result.invalid) {
      inputRef.current?.focus();
      return;
    }
    const revealed = solution;
    setSaved((current) => ({
      ...current,
      completed:
        result.correct && !revealed
          ? [...new Set([...current.completed, level])]
          : current.completed,
      history: [
        {
          id: problem.id,
          level,
          variation,
          correct: result.correct,
          revealed,
          answer,
          time: new Date().toISOString(),
        },
        ...current.history,
      ].slice(0, 100),
    }));
    if (result.correct && revealed)
      setFeedback({
        ...result,
        message:
          "That matches the solution. Try a new variation on your own to complete this level.",
      });
  }

  function toggleBookmark() {
    setSaved((current) => ({
      ...current,
      bookmarks: bookmarked
        ? current.bookmarks.filter((id) => id !== problem.id)
        : [...current.bookmarks, problem.id],
    }));
    setToast(
      bookmarked
        ? "Removed from your bookmarks"
        : "Saved. Come back to this problem anytime.",
    );
  }

  function runAI() {
    if (["loading", "generating"].includes(ai.status)) return;
    const id = ++requestId.current;
    setAi({ status: "loading", text: "", error: "", progress: 0 });
    if (!worker.current)
      worker.current = new Worker(new URL("./ai.worker.js", import.meta.url), {
        type: "module",
      });
    worker.current.onerror = () => {
      clearTimeout(requestTimer.current);
      setAi({
        status: "error",
        text: "",
        error:
          "The AI runtime could not start in this browser. Try a recent Chrome, Edge, Firefox, or Safari. Verified hints are still available.",
        progress: 0,
      });
      worker.current?.terminate();
      worker.current = null;
    };
    worker.current.onmessage = ({ data }) => {
      if (requestId.current !== id) return;
      if (data.type === "progress")
        setAi((current) => ({
          ...current,
          progress: Math.max(
            current.progress,
            Math.min(99, Math.round(data.progress || 0)),
          ),
        }));
      if (data.type === "generating")
        setAi((current) => ({
          ...current,
          status: "generating",
          progress: 100,
        }));
      if (data.type === "result") {
        clearTimeout(requestTimer.current);
        setAi({ status: "done", text: data.text, error: "", progress: 100 });
      }
      if (data.type === "error") {
        clearTimeout(requestTimer.current);
        setAi({ status: "error", text: "", error: data.message, progress: 0 });
      }
    };
    clearTimeout(requestTimer.current);
    requestTimer.current = setTimeout(() => {
      worker.current?.terminate();
      worker.current = null;
      setAi({
        status: "error",
        text: "",
        error:
          "The model is taking too long to respond. Please try again on a faster connection or use the verified hints below.",
        progress: 0,
      });
    }, 180000);
    worker.current.postMessage({
      messages: buildMessages(problem, Math.max(0, hints - 1)),
      requestId: id,
    });
  }

  const navigation = [
    { id: "learn", label: "Home", icon: Home },
    { id: "progress", label: "My progress", icon: TrendingUp },
    { id: "bookmarks", label: "Bookmarks", icon: Bookmark },
    { id: "about", label: "How it works", icon: CircleHelp },
  ];

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <aside className="left-sidebar" aria-label="Main navigation">
        <button
          className="brand-button"
          onClick={() => navigate("learn")}
          aria-label="Axiom home"
        >
          <Logo />
        </button>
        <nav className="main-nav">
          {navigation.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`nav-item ${view === id ? "active" : ""}`}
              onClick={() =>
                id === "about" ? setModal("about") : navigate(id)
              }
              aria-current={view === id ? "page" : undefined}
            >
              <Icon
                size={25}
                strokeWidth={view === id ? 2.5 : 1.7}
                fill={id === "learn" && view === id ? "currentColor" : "none"}
              />
              <span>{label}</span>
              {id === "bookmarks" && saved.bookmarks.length > 0 && (
                <span className="nav-count">{saved.bookmarks.length}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="workspace-label">YOUR CLASSROOM</div>
        <button className="topic-nav" onClick={() => startPractice()}>
          <span className="topic-icon">
            <Triangle size={18} />
          </span>
          <span>
            Geometry
            <span className="topic-subtitle">The Pythagorean theorem</span>
          </span>
        </button>
        <button
          className="primary-button sidebar-cta"
          onClick={() => {
            startPractice(level, variation);
            setTimeout(() => inputRef.current?.focus(), 150);
          }}
        >
          <Plus size={18} />
          <span>Let’s practice</span>
        </button>
        <div className="sidebar-note">
          <span className="note-line" />
          <p>
            A little curiosity
            <br />
            goes a long way.
          </p>
          <Sparkles size={15} />
        </div>
        <div className="profile">
          <Avatar person />
          <span>
            <strong>Nurasyl Nurbay</strong>
            <small>@nurasyl · student</small>
          </span>
          <button
            className="icon-button"
            aria-label={`Switch to ${saved.theme === "dark" ? "light" : "dark"} mode`}
            onClick={() =>
              setSaved((current) => ({
                ...current,
                theme: current.theme === "dark" ? "light" : "dark",
              }))
            }
          >
            {saved.theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}
          </button>
        </div>
      </aside>

      <main className="main-column" id="main-content">
        <header className="main-header">
          <div>
            <h1>
              {view === "learn"
                ? "Your learning space"
                : view === "progress"
                  ? "My progress"
                  : "Bookmarks"}
              <span className="header-dot" />
            </h1>
            <span className="header-subtitle">
              A new way to see what you can do.
            </span>
          </div>
          <button
            className="icon-button"
            aria-label="About Axiom"
            onClick={() => setModal("about")}
          >
            <Sparkles size={21} />
          </button>
        </header>
        {view === "learn" && (
          <>
            <div
              className="feed-tabs"
              role="tablist"
              aria-label="Learning views"
            >
              <button className="selected" role="tab" aria-selected="true">
                For you
              </button>
              <button
                role="tab"
                aria-selected="false"
                onClick={() => navigate("progress")}
              >
                Your journey{" "}
                <span className="tab-counter">{mastered.length}/3</span>
              </button>
            </div>
            <section className="welcome">
              <div className="welcome-copy">
                <span className="eyebrow">
                  <span />A LITTLE CURIOSITY. A LOT OF POSSIBILITY.
                </span>
                <h2>
                  Find your angle<span>.</span>
                </h2>
                <p>
                  One big idea. Three ways to make it yours.
                  <br /> Let’s look at geometry a little differently.
                </p>
                <span className="welcome-topic">
                  <Triangle size={13} />
                  Geometry <span>·</span> The Pythagorean theorem
                </span>
              </div>
              <svg
                className="hero-art"
                viewBox="0 0 170 170"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="heroGradient" x1="0" y1="0" x2="1" y2="1">
                    <stop stopColor="#1d9bf0" stopOpacity=".14" />
                    <stop offset="1" stopColor="#1d9bf0" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <circle
                  cx="90"
                  cy="88"
                  r="67"
                  fill="none"
                  stroke="#1d9bf0"
                  strokeOpacity=".13"
                />
                <circle
                  cx="90"
                  cy="88"
                  r="48"
                  fill="none"
                  stroke="#1d9bf0"
                  strokeOpacity=".1"
                  strokeDasharray="3 6"
                />
                <path
                  d="M39 126V43L137 126Z"
                  fill="url(#heroGradient)"
                  stroke="#1d9bf0"
                  strokeWidth="1.3"
                />
                <path d="M39 113h13v13" stroke="#8ba3b6" fill="none" />
                <path d="M39 43 137 126" stroke="#e7f1f8" strokeWidth="1.5" />
                <circle cx="39" cy="43" r="3" fill="#1d9bf0" />
                <circle cx="137" cy="126" r="3" fill="#1d9bf0" />
                <text
                  x="80"
                  y="89"
                  fill="#8ba3b6"
                  fontSize="14"
                  transform="rotate(40 80 89)"
                >
                  c
                </text>
                <text x="21" y="89" fill="#8ba3b6" fontSize="13">
                  b
                </text>
                <text x="82" y="145" fill="#8ba3b6" fontSize="13">
                  a
                </text>
              </svg>
            </section>
            <div className="section-divider">
              <span>YOUR NEXT SMALL DISCOVERY</span>
              <span>
                <span className="live-dot" /> Ready when you are
              </span>
            </div>
            <article className="practice-post">
              <header className="post-header">
                <Avatar />
                <div className="post-author">
                  <div>
                    <strong>Axiom tutor</strong>
                    <BadgeCheck
                      size={17}
                      className="verified"
                      fill="currentColor"
                    />
                    <span>@axiom</span>
                    <span>·</span>
                    <span>For you</span>
                  </div>
                  <small>A challenge that meets you where you are.</small>
                </div>
                <button
                  className={`icon-button bookmark-top ${bookmarked ? "is-bookmarked" : ""}`}
                  aria-label={
                    bookmarked ? "Remove bookmark" : "Bookmark this problem"
                  }
                  aria-pressed={bookmarked}
                  onClick={toggleBookmark}
                >
                  <Bookmark
                    size={19}
                    fill={bookmarked ? "currentColor" : "none"}
                  />
                </button>
              </header>
              <div className="post-body">
                <div className="level-intro">
                  <h3>Choose your starting point</h3>
                  <span>No pressure. Just progress.</span>
                </div>
                <div className="level-picker" aria-label="Difficulty level">
                  {LEVELS.map((item, index) => {
                    const Icon = [Sprout, Layers3, Zap][index];
                    return (
                      <button
                        key={item.id}
                        className={`level-button ${level === item.id ? "is-selected" : ""}`}
                        aria-pressed={level === item.id}
                        onClick={() => {
                          if (level !== item.id) resetProblem(item.id, 0);
                        }}
                      >
                        <span className="level-top">
                          <Icon size={16} />
                          <span>0{index + 1}</span>
                          {saved.completed.includes(item.id) && (
                            <Check size={13} className="level-complete" />
                          )}
                        </span>
                        <strong>{item.name}</strong>
                        <small>{item.subtitle}</small>
                      </button>
                    );
                  })}
                </div>
                <div className="problem-meta">
                  <span className={`difficulty-chip ${level}`}>
                    <span />
                    {levelInfo.name}
                  </span>
                  <span>
                    <Clock3 size={12} />
                    {levelInfo.minutes} min practice
                  </span>
                  {solved && (
                    <span className="solved-marker">
                      <CheckCheck size={14} />
                      Completed
                    </span>
                  )}
                </div>
                <h2 className="problem-title">{problem.title}</h2>
                <p className="problem-question">{problem.question}</p>
                <TriangleDiagram problem={problem} />
                <form
                  className="answer-form"
                  onSubmit={submitAnswer}
                  noValidate
                >
                  <label htmlFor="answer">{problem.answerLabel}</label>
                  <div className="answer-row">
                    <div
                      className={`answer-input-wrap ${feedback?.correct ? "correct-input" : feedback && !feedback.correct ? "error-input" : ""}`}
                    >
                      <input
                        id="answer"
                        ref={inputRef}
                        inputMode="decimal"
                        autoComplete="off"
                        placeholder="Your answer"
                        value={answer}
                        onChange={(event) => {
                          setAnswer(event.target.value);
                          setFeedback(null);
                        }}
                        aria-invalid={
                          feedback && !feedback.correct ? "true" : undefined
                        }
                        aria-describedby={
                          feedback ? "answer-feedback" : "answer-help"
                        }
                      />
                      <span>{problem.unit}</span>
                    </div>
                    <button
                      className="primary-button check-button"
                      type="submit"
                    >
                      Check answer <ArrowRight size={17} />
                    </button>
                  </div>
                  <div id="answer-help" className="input-help">
                    <CornerDownLeft size={12} />
                    Press Enter to check <span>·</span>{" "}
                    {level === "advanced"
                      ? "Round to 2 decimal places"
                      : "Take your time. You’ve got this."}
                  </div>
                </form>
                {feedback && (
                  <div
                    id="answer-feedback"
                    className={`feedback ${feedback.correct ? "success" : "retry"}`}
                    role="status"
                  >
                    {feedback.correct ? (
                      <CheckCheck size={19} />
                    ) : (
                      <Lightbulb size={19} />
                    )}
                    <div>
                      <strong>
                        {feedback.correct
                          ? "A little win. A big step forward."
                          : feedback.invalid
                            ? "Let’s start with a number."
                            : "You’re on the right track. Try again."}
                      </strong>
                      <p>{feedback.message}</p>
                      {feedback.correct && !solution && (
                        <button
                          className="text-button"
                          onClick={() => resetProblem(level, variation + 1)}
                        >
                          Try another variation <ArrowRight size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                )}
                <div className="help-actions">
                  <button
                    onClick={() =>
                      setHints((current) => Math.min(3, current + 1))
                    }
                    disabled={hints >= 3}
                  >
                    <Lightbulb size={16} />
                    {hints === 0
                      ? "A little hint?"
                      : hints === 3
                        ? "All hints revealed"
                        : "Another hint"}
                    {hints > 0 && <span className="hint-count">{hints}/3</span>}
                  </button>
                  <button onClick={() => setModal("ai")} className="ai-action">
                    <Sparkles size={16} />
                    Ask AI tutor
                    <ArrowUpRight size={13} />
                  </button>
                </div>
                {hints > 0 && (
                  <div className="hints-panel" aria-live="polite">
                    {problem.hints.slice(0, hints).map((hint, index) => (
                      <div className="hint-row" key={`${problem.id}-${index}`}>
                        <span>{index + 1}</span>
                        <p>{hint}</p>
                      </div>
                    ))}
                  </div>
                )}
                <div className="solution-section">
                  <button
                    onClick={() => setSolution(!solution)}
                    className="solution-toggle"
                    aria-expanded={solution}
                  >
                    <BookOpen size={16} />
                    <span>
                      {solution
                        ? "The idea, step by step"
                        : "See the worked solution"}
                    </span>
                    <ChevronDown
                      size={16}
                      className={solution ? "rotated" : ""}
                    />
                  </button>
                  {solution && (
                    <div className="solution-content">
                      {problem.steps.map((step, index) => (
                        <div className="solution-step" key={step.title}>
                          <span>{index + 1}</span>
                          <div>
                            <h4>{step.title}</h4>
                            <p>{step.text}</p>
                          </div>
                        </div>
                      ))}
                      <p className="takeaway">
                        <Sparkles size={15} />
                        {problem.takeaway}
                      </p>
                      <p className="solution-note">
                        To complete a level, solve a new variation before
                        opening its solution.
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <footer className="post-footer">
                <span>
                  <LockKeyhole size={13} />
                  Your pace. Your progress.
                </span>
                <button onClick={() => resetProblem(level, variation + 1)}>
                  <RefreshCw size={14} />
                  New variation
                </button>
              </footer>
            </article>
            <section className="concept-post">
              <Avatar size="small" />
              <div>
                <div className="concept-author">
                  <strong>A thought to take with you</strong>
                  <span>·</span>
                  <span>Geometry, simplified</span>
                </div>
                <p>
                  You don’t need to see the whole staircase.
                  <br />
                  Just find the next right triangle.
                </p>
                <span className="concept-tag">
                  #KeepExploring <span>#OneStepAtATime</span>
                </span>
              </div>
            </section>
            <div className="feed-end">
              <span />
              Made for the way you learn.
              <span />
            </div>
          </>
        )}

        {view === "progress" && (
          <section className="subpage">
            <div className="page-eyebrow">
              <TrendingUp size={16} /> EVERY STEP COUNTS
            </div>
            <h2>
              Look how far
              <br />
              you can go<span>.</span>
            </h2>
            <p className="subpage-intro">
              Your journey is yours. Small wins count, too.
            </p>
            <div className="stat-grid">
              <div>
                <strong>{totalCorrect}</strong>
                <span>problems solved</span>
              </div>
              <div>
                <strong>
                  {mastered.length}
                  <small>/3</small>
                </strong>
                <span>levels completed</span>
              </div>
              <div>
                <strong>{saved.history.length}</strong>
                <span>answers explored</span>
              </div>
            </div>
            <h3 className="subsection-heading">Three paths. One big idea.</h3>
            <div className="path-list">
              {LEVELS.map((item, index) => (
                <button key={item.id} onClick={() => startPractice(item.id)}>
                  <span
                    className={`path-number ${saved.completed.includes(item.id) ? "done" : ""}`}
                  >
                    {saved.completed.includes(item.id) ? (
                      <Check size={18} />
                    ) : (
                      `0${index + 1}`
                    )}
                  </span>
                  <span>
                    <strong>{item.name}</strong>
                    <small>{item.eyebrow}</small>
                  </span>
                  <span className="path-status">
                    {saved.completed.includes(item.id)
                      ? "Completed"
                      : "Start learning"}
                    <ArrowUpRight size={16} />
                  </span>
                </button>
              ))}
            </div>
            <h3 className="subsection-heading">Your recent discoveries</h3>
            {saved.history.length === 0 ? (
              <div className="empty-state">
                <Sprout size={32} />
                <h3>Your first discovery is waiting.</h3>
                <p>
                  Try a problem, follow your curiosity, and watch your progress
                  grow.
                </p>
                <button
                  className="primary-button"
                  onClick={() => startPractice()}
                >
                  Take the first step
                  <ArrowRight size={16} />
                </button>
              </div>
            ) : (
              <div className="history-list">
                {saved.history.slice(0, 12).map((row, index) => (
                  <div key={`${row.time}-${index}`}>
                    <span
                      className={`history-icon ${row.correct && !row.revealed ? "done" : ""}`}
                    >
                      {row.correct && !row.revealed ? (
                        <Check size={16} />
                      ) : (
                        <RefreshCw size={15} />
                      )}
                    </span>
                    <div>
                      <strong>
                        {LEVELS.find((item) => item.id === row.level).name} ·
                        Variation {row.variation + 1}
                      </strong>
                      <small>
                        {row.revealed
                          ? "Explored with the worked solution"
                          : row.correct
                            ? "Solved independently"
                            : "A learning step — keep exploring"}
                      </small>
                    </div>
                    <button
                      className="icon-button"
                      aria-label="Revisit this problem"
                      onClick={() => startPractice(row.level, row.variation)}
                    >
                      <ArrowUpRight size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <p className="storage-note">
              <LockKeyhole size={13} />
              Progress stays in this browser. No account required.
            </p>
          </section>
        )}

        {view === "bookmarks" && (
          <section className="subpage">
            <div className="page-eyebrow">
              <Bookmark size={16} /> IDEAS WORTH COMING BACK TO
            </div>
            <h2>
              A space for your
              <br />
              next discoveries<span>.</span>
            </h2>
            <p className="subpage-intro">
              Pick up a problem right where you left it.
            </p>
            {saved.bookmarks.length === 0 ? (
              <div className="empty-state">
                <Bookmark size={34} />
                <h3>Keep a little inspiration.</h3>
                <p>Tap the bookmark on any practice problem to save it here.</p>
                <button
                  className="primary-button"
                  onClick={() => navigate("learn")}
                >
                  Explore a problem
                  <ArrowRight size={16} />
                </button>
              </div>
            ) : (
              <div className="bookmark-list">
                {saved.bookmarks.map((id) => {
                  const match = /^(foundation|standard|advanced)-(\d+)$/.exec(
                    id,
                  );
                  if (!match) return null;
                  const item = makeProblem(match[1], Number(match[2]));
                  return (
                    <article key={id}>
                      <span className={`difficulty-chip ${item.level}`}>
                        {LEVELS.find((l) => l.id === item.level).name}
                      </span>
                      <h3>{item.title}</h3>
                      <p>{item.question}</p>
                      <div>
                        <button
                          className="text-button"
                          onClick={() =>
                            startPractice(item.level, item.variation)
                          }
                        >
                          Continue learning
                          <ArrowRight size={15} />
                        </button>
                        <button
                          className="icon-button is-bookmarked"
                          aria-label="Remove saved problem"
                          onClick={() =>
                            setSaved((current) => ({
                              ...current,
                              bookmarks: current.bookmarks.filter(
                                (itemId) => itemId !== id,
                              ),
                            }))
                          }
                        >
                          <Bookmark size={18} fill="currentColor" />
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        )}
      </main>

      <aside className="right-sidebar" aria-label="Learning resources">
        <div className="search-wrapper">
          <div className="search-field">
            <Search size={19} />
            <input
              aria-label="Search topics"
              placeholder="Search your learning space"
              value={query}
              onFocus={() => setSearchOpen(true)}
              onChange={(event) => {
                setQuery(event.target.value);
                setSearchOpen(true);
              }}
              onKeyDown={(event) => {
                if (event.key === "Escape") setSearchOpen(false);
                if (
                  event.key === "Enter" &&
                  (!query || /geometry|pythag|triangle|math/i.test(query))
                ) {
                  startPractice();
                  setQuery("");
                }
              }}
            />
            {query && (
              <button
                className="icon-button"
                aria-label="Clear search"
                onClick={() => setQuery("")}
              >
                <X size={14} />
              </button>
            )}
          </div>
          {searchOpen && (
            <div className="search-results">
              {!query || /geometry|pythag|triangle|math/i.test(query) ? (
                <button
                  onClick={() => {
                    startPractice();
                    setQuery("");
                  }}
                >
                  <Triangle size={18} />
                  <span>
                    <strong>The Pythagorean theorem</strong>
                    <small>Geometry · 3 learning levels</small>
                  </span>
                  <ArrowUpRight size={16} />
                </button>
              ) : (
                <p>No topics found. Try “geometry”.</p>
              )}
              <button
                className="close-search"
                onClick={() => setSearchOpen(false)}
              >
                Close search
              </button>
            </div>
          )}
        </div>
        <section className="journey-card">
          <div className="card-heading">
            <h2>Your learning journey</h2>
            <span className="mini-logo">
              <Triangle size={16} />
            </span>
          </div>
          <div className="topic-eyebrow">LET’S CONNECT THE DOTS</div>
          <h3>
            The Pythagorean
            <br />
            theorem
          </h3>
          <p>Great things start with a² + b².</p>
          <div className="journey-progress">
            <div className="progress-text">
              <strong>{mastered.length} of 3 levels completed</strong>
              <span>{Math.round((mastered.length / 3) * 100)}%</span>
            </div>
            <div className="progress-track">
              <span style={{ width: `${(mastered.length / 3) * 100}%` }} />
            </div>
          </div>
          <div className="journey-levels">
            {LEVELS.map((item, index) => (
              <button
                key={item.id}
                onClick={() => startPractice(item.id)}
                className={
                  level === item.id && view === "learn" ? "current" : ""
                }
              >
                <span
                  className={`journey-node ${item.id} ${saved.completed.includes(item.id) ? "complete" : ""}`}
                >
                  {saved.completed.includes(item.id) ? (
                    <Check size={11} />
                  ) : (
                    <span />
                  )}
                </span>
                <span>
                  <strong>{item.name}</strong>
                  <small>{item.eyebrow}</small>
                </span>
                {level === item.id && view === "learn" ? (
                  <span className="you-are-here">YOU’RE HERE</span>
                ) : (
                  <ChevronRight size={15} />
                )}
              </button>
            ))}
          </div>
          <button className="journey-link" onClick={() => navigate("progress")}>
            See your progress
            <ArrowUpRight size={15} />
          </button>
        </section>
        <section className="perspective-card">
          <div className="small-label">
            <span className="blue-dot" /> A FRESH PERSPECTIVE
          </div>
          <svg viewBox="0 0 240 100" aria-hidden="true">
            <path
              d="m60 77 53-56 54 56H60Z"
              fill="none"
              stroke="#536471"
              strokeWidth="1.2"
            />
            <path
              d="M113 21V77h54"
              fill="none"
              stroke="#1d9bf0"
              strokeWidth="1.5"
            />
            <path d="M113 67h10v10" fill="none" stroke="#1d9bf0" />
            <circle cx="113" cy="21" r="3" fill="#1d9bf0" />
            <path d="M48 86h145" stroke="#2f3336" strokeDasharray="2 4" />
          </svg>
          <h3>
            Same problem.
            <br />A different possibility.
          </h3>
          <p>
            The right level doesn’t limit you.
            <br />
            It gives you a place to begin.
          </p>
          <button className="text-button" onClick={() => setModal("about")}>
            Meet your learning space
            <ArrowUpRight size={14} />
          </button>
        </section>
        <section className="ai-mini">
          <span className="ai-mini-icon">
            <Sparkles size={18} />
          </span>
          <div>
            <strong>A little help, when you need it.</strong>
            <p>On-device AI. Made for your level.</p>
            <button onClick={() => setModal("ai")}>
              Meet your AI tutor
              <ArrowRight size={13} />
            </button>
          </div>
        </section>
        <footer className="right-footer">
          <div>
            <button onClick={() => setModal("about")}>About Axiom</button>
            <a href={`${BASE}report.pdf`} target="_blank" rel="noreferrer">
              Project report
              <ArrowUpRight size={10} />
            </a>
            <a
              href="https://github.com/johndoe018/nurasyl"
              target="_blank"
              rel="noreferrer"
            >
              Source code
              <ArrowUpRight size={10} />
            </a>
          </div>
          <p>Thoughtfully built by Nurasyl Nurbay.</p>
          <span>AI for Differentiated Learning · 2026</span>
        </footer>
      </aside>

      <nav className="mobile-nav" aria-label="Mobile navigation">
        {navigation.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={view === id ? "active" : ""}
            aria-label={label}
            onClick={() => (id === "about" ? setModal("about") : navigate(id))}
          >
            <Icon size={23} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
      {toast && (
        <div className="toast" role="status">
          <Check size={17} />
          {toast}
        </div>
      )}

      {modal === "about" && (
        <Modal
          title="A different way to get there."
          onClose={closeModal}
        >
          <p className="modal-lead">
            One theorem. Three starting points. A learning experience that grows
            with you.
          </p>
          <div className="about-steps">
            <div>
              <Sprout />
              <span>
                <strong>Start where you are.</strong>
                <p>
                  Foundation guides every step. Standard adds a real-world
                  setting. Advanced asks you to think in three dimensions.
                </p>
              </span>
            </div>
            <div>
              <Lightbulb />
              <span>
                <strong>Make room for the “aha”.</strong>
                <p>
                  Reveal a hint at a time, check your answer instantly, or
                  explore a fully worked solution. The mathematics is checked
                  independently of AI.
                </p>
              </span>
            </div>
            <div>
              <Sparkles />
              <span>
                <strong>Get a little help from AI.</strong>
                <p>
                  An open-source language model explains the current hint for
                  your level, right in your browser. Your answers never leave
                  your device.
                </p>
              </span>
            </div>
          </div>
          <div className="about-author">
            <Avatar person />
            <div>
              <strong>Nurasyl Nurbay</strong>
              <span>Individual project · AI for Differentiated Learning</span>
            </div>
          </div>
          <div className="modal-links">
            <a href={`${BASE}report.pdf`} target="_blank" rel="noreferrer">
              <ArrowDownToLine size={16} />
              Read the project report
            </a>
            <a
              href="https://github.com/johndoe018/nurasyl"
              target="_blank"
              rel="noreferrer"
            >
              <Code2 size={16} />
              View source
              <ExternalLink size={12} />
            </a>
          </div>
        </Modal>
      )}

      {modal === "ai" && (
        <Modal
          title="A little help. A new perspective."
          onClose={closeModal}
        >
          <p className="modal-lead">
            Your {levelInfo.name.toLowerCase()} tutor is here to help you
            understand the next step.
          </p>
          <div className="ai-context">
            <span className={`difficulty-chip ${level}`}>{levelInfo.name}</span>
            <strong>{problem.title}</strong>
            <p>{problem.question}</p>
          </div>
          {ai.status === "idle" && (
            <div className="ai-intro">
              <span className="ai-orb">
                <Sparkles size={28} />
              </span>
              <h3>Private by design. Curious by nature.</h3>
              <p>
                The first use downloads an open-source model (approximately
                100–200 MB). After that, the cached model runs on your device. A
                recent browser and a little patience help.
              </p>
              <button className="primary-button" onClick={runAI}>
                <Sparkles size={17} />
                Explain my next step
              </button>
              <span className="ai-model-note">
                SmolLM2 · no API key · no account
              </span>
            </div>
          )}
          {["loading", "generating"].includes(ai.status) && (
            <div className="ai-loading" role="status">
              <LoaderCircle className="spin" size={28} />
              <h3>
                {ai.status === "generating"
                  ? "Finding the right words…"
                  : "Making room for a little insight…"}
              </h3>
              <p>
                {ai.status === "generating"
                  ? "Your tutor is explaining the hint on your device."
                  : "Downloading and preparing the AI model. The first visit takes a little longer."}
              </p>
              {ai.status === "loading" && (
                <div className="progress-track">
                  <span style={{ width: `${Math.max(5, ai.progress)}%` }} />
                </div>
              )}
              <button
                className="text-button"
                onClick={() => {
                  worker.current?.terminate();
                  worker.current = null;
                  clearTimeout(requestTimer.current);
                  requestId.current += 1;
                  setAi({ status: "idle", text: "", error: "", progress: 0 });
                }}
              >
                Cancel
              </button>
            </div>
          )}
          {ai.status === "done" && (
            <div className="ai-response">
              <div>
                <Sparkles size={17} />
                <strong>Axiom AI tutor</strong>
                <span>ON YOUR DEVICE</span>
              </div>
              <p>{ai.text}</p>
              <small>
                AI explanations can make mistakes. Use the verified hint and
                worked solution to check the reasoning.
              </small>
              <button className="text-button" onClick={runAI}>
                <RefreshCw size={14} />
                Explain again
              </button>
            </div>
          )}
          {ai.status === "error" && (
            <div className="ai-error" role="alert">
              <CircleHelp size={22} />
              <h3>The model couldn’t connect.</h3>
              <p>{ai.error}</p>
              <button className="text-button" onClick={runAI}>
                Try again
                <RefreshCw size={14} />
              </button>
            </div>
          )}
          <div className="verified-hint">
            <span>
              <BadgeCheck size={16} />
              Your verified next step
            </span>
            <p>{problem.hints[Math.max(0, hints - 1)]}</p>
          </div>
          <p className="ai-privacy">
            <LockKeyhole size={12} />
            Model files download from Hugging Face. Your work stays here.
          </p>
        </Modal>
      )}
    </div>
  );
}

export default App;
