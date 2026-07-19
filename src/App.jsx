import { useMemo, useState } from "react";

const themes = [
  {
    id: "prism",
    label: "Prism",
    accent: "#7ef0ff",
    glow: "rgba(126, 240, 255, 0.32)",
    frame: "rgba(226, 237, 255, 0.12)",
    panel: "rgba(15, 21, 30, 0.84)",
    panelSoft: "rgba(20, 27, 37, 0.74)",
  },
  {
    id: "nocturne",
    label: "Nocturne",
    accent: "#a57bff",
    glow: "rgba(165, 123, 255, 0.3)",
    frame: "rgba(165, 123, 255, 0.16)",
    panel: "rgba(11, 16, 23, 0.92)",
    panelSoft: "rgba(17, 23, 31, 0.82)",
  },
  {
    id: "paper",
    label: "Paper",
    accent: "#f08a3c",
    glow: "rgba(240, 138, 60, 0.2)",
    frame: "rgba(240, 138, 60, 0.14)",
    panel: "rgba(245, 238, 230, 0.88)",
    panelSoft: "rgba(255, 250, 244, 0.8)",
  },
];

const sampleName = {
  first: "Your",
  middle: "Name",
  last: "Here",
};

const easterEggNames = [
  { first: "John", middle: "Wilkes", last: "Booth" },
  { first: "Barbara", middle: "Millicent", last: "Roberts" },
  { first: "Keanu", middle: "Charles", last: "Reeves" },
  { first: "Robert", middle: "Downey", last: "Jr." },
  { first: "Leia", middle: "Amidala", last: "Organa" },
  { first: "Peter", middle: "Benjamin", last: "Parker" },
  { first: "Wolfgang", middle: "Amadeus", last: "Mozart" },
  { first: "Bart", middle: "J.", last: "Simpson" },
  { first: "Andrew", middle: "Lloyd", last: "Webber" },
  { first: "Tony", middle: "Edward", last: "Stark" },
  { first: "Donald", middle: "Fauntleroy", last: "Duck" },
  { first: "Daffy", middle: "Howard", last: "Duck" },
];

const recentNameKeys = {
  first: "name2rgb-recent-first-names",
  middle: "name2rgb-recent-middle-names",
  last: "name2rgb-recent-last-names",
};

const themeStorageKey = "name2rgb-selected-theme";
const modeStorageKey = "name2rgb-selected-mode";
const currentNameKeys = {
  first: "name2rgb-current-first-name",
  middle: "name2rgb-current-middle-name",
  last: "name2rgb-current-last-name",
};

const footerProfile = {
  authorName: "Torin Teale",
  projectRepoUrl: "https://github.com/SolarianVulpine/Name2RGB_WebLaunch.git",
  originalCRepoUrl: "https://github.com/SolarianVulpine/nameToRGB",
  linkedinUrl: "https://www.linkedin.com/in/torin-teale",
};

function readRecentNames(key) {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(key);

    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);

    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch {
    return [];
  }
}

function writeRecentNames(key, names) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(names));
}

function readSavedName(key, fallbackValue) {
  if (typeof window === "undefined") {
    return fallbackValue;
  }

  try {
    const stored = window.localStorage.getItem(key);

    return stored ?? fallbackValue;
  } catch {
    return fallbackValue;
  }
}

function writeSavedName(key, value) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, value);
}

function readSavedThemeId() {
  if (typeof window === "undefined") {
    return "prism";
  }

  try {
    const stored = window.localStorage.getItem(themeStorageKey);
    const validTheme = themes.find((entry) => entry.id === stored);

    return validTheme ? validTheme.id : "prism";
  } catch {
    return "prism";
  }
}

function writeSavedThemeId(themeId) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(themeStorageKey, themeId);
}

function readSavedMode() {
  if (typeof window === "undefined") {
    return "dark";
  }

  try {
    const stored = window.localStorage.getItem(modeStorageKey);

    return stored === "light" || stored === "dark" ? stored : "dark";
  } catch {
    return "dark";
  }
}

function writeSavedMode(mode) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(modeStorageKey, mode);
}

function calculateChannel(value) {
  const letters = value.trim().toUpperCase();
  let total = 0;

  for (const char of letters) {
    if (char >= "A" && char <= "Z") {
      total += char.charCodeAt(0) - 64;
    }
  }

  total *= 4;

  while (total > 255) {
    total -= 256;
  }

  return total;
}

function formatHex(red, green, blue) {
  return [red, green, blue]
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
}

function breakdownLabel(name) {
  const letters = name
    .trim()
    .toUpperCase()
    .replace(/[^A-Z]/g, "");

  if (!letters) {
    return "No alphabetic characters";
  }

  const total = [...letters].reduce(
    (sum, char) => sum + (char.charCodeAt(0) - 64),
    0,
  );
  return `${letters} → ${total} points × 4`;
}

function App() {
  const [themeId, setThemeId] = useState(() => readSavedThemeId());
  const [mode, setMode] = useState(() => readSavedMode());
  const [firstName, setFirstName] = useState(() =>
    readSavedName(currentNameKeys.first, sampleName.first),
  );
  const [middleName, setMiddleName] = useState(() =>
    readSavedName(currentNameKeys.middle, sampleName.middle),
  );
  const [lastName, setLastName] = useState(() =>
    readSavedName(currentNameKeys.last, sampleName.last),
  );
  const [copiedLabel, setCopiedLabel] = useState("");
  const [recentFirstNames, setRecentFirstNames] = useState(() =>
    readRecentNames(recentNameKeys.first),
  );
  const [recentMiddleNames, setRecentMiddleNames] = useState(() =>
    readRecentNames(recentNameKeys.middle),
  );
  const [recentLastNames, setRecentLastNames] = useState(() =>
    readRecentNames(recentNameKeys.last),
  );

  const theme = themes.find((entry) => entry.id === themeId) ?? themes[0];

  function handleThemeChange(nextThemeId) {
    setThemeId(nextThemeId);
    writeSavedThemeId(nextThemeId);
  }

  function handleModeChange(nextMode) {
    setMode(nextMode);
    writeSavedMode(nextMode);
  }

  function updateName(field, value) {
    if (field === "first") {
      setFirstName(value);
      writeSavedName(currentNameKeys.first, value);
    }

    if (field === "middle") {
      setMiddleName(value);
      writeSavedName(currentNameKeys.middle, value);
    }

    if (field === "last") {
      setLastName(value);
      writeSavedName(currentNameKeys.last, value);
    }
  }

  function clearName(field) {
    updateName(field, "");
  }

  const colorState = useMemo(() => {
    const red = calculateChannel(firstName);
    const green = calculateChannel(middleName);
    const blue = calculateChannel(lastName);

    return {
      red,
      green,
      blue,
      hex: formatHex(red, green, blue),
      rgb: `rgb(${red}, ${green}, ${blue})`,
    };
  }, [firstName, middleName, lastName]);

  const paletteStyle = {
    "--accent": theme.accent,
    "--glow": theme.glow,
    "--frame": theme.frame,
    "--theme-panel-accent":
      theme.id === "paper"
        ? "rgba(240, 138, 60, 0.14)"
        : "rgba(126, 240, 255, 0.12)",
    "--theme-panel-accent-soft":
      theme.id === "paper"
        ? "rgba(240, 138, 60, 0.08)"
        : "rgba(126, 240, 255, 0.06)",
    "--hero-line": `linear-gradient(90deg, transparent, ${theme.accent}, transparent)`,
    "--theme-name": theme.label,
    "--page-bg": mode === "light" ? "#f3efe8" : "#0b1016",
    "--page-bg-2": mode === "light" ? "#fffaf4" : "#0f1721",
    "--surface":
      mode === "light" ? "rgba(255, 255, 255, 0.88)" : "rgba(16, 21, 29, 0.86)",
    "--surface-2":
      mode === "light" ? "rgba(255, 255, 255, 0.76)" : "rgba(19, 25, 33, 0.7)",
    "--surface-3":
      mode === "light" ? "rgba(255, 252, 248, 0.92)" : "rgba(9, 14, 19, 0.92)",
    "--text": mode === "light" ? "#1b2430" : "#d4dde6",
    "--text-dim": mode === "light" ? "#4f5a68" : "#8b98a8",
    "--text-faint": mode === "light" ? "#728090" : "#637081",
    "--border":
      mode === "light" ? "rgba(19, 29, 44, 0.12)" : "rgba(217, 232, 246, 0.12)",
    "--card-shadow":
      mode === "light"
        ? "0 18px 36px rgba(25, 35, 47, 0.1)"
        : "0 28px 60px rgba(0, 0, 0, 0.44)",
    "--grid-line":
      mode === "light" ? "rgba(31, 41, 55, 0.05)" : "rgba(255, 255, 255, 0.03)",
    "--shell-tint":
      mode === "light" ? "rgba(255, 255, 255, 0.72)" : "rgba(0, 0, 0, 0.24)",
  };

  async function handleCopy(value, label) {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedLabel(label);
      window.setTimeout(() => setCopiedLabel(""), 1400);
    } catch {
      setCopiedLabel("");
    }
  }

  async function handleCopyAll() {
    const value = `Hex: #${colorState.hex}\nRGB: ${colorState.rgb}`;

    try {
      await navigator.clipboard.writeText(value);
      setCopiedLabel("All copied");
      window.setTimeout(() => setCopiedLabel(""), 1400);
    } catch {
      setCopiedLabel("");
    }
  }

  function applySampleNames() {
    updateName("first", sampleName.first);
    updateName("middle", sampleName.middle);
    updateName("last", sampleName.last);
  }

  function chooseEasterEggNames() {
    const currentSignature = [firstName, middleName, lastName].join("|");
    const availableChoices = easterEggNames.filter(
      (entry) =>
        [entry.first, entry.middle, entry.last].join("|") !== currentSignature,
    );
    const pool =
      availableChoices.length > 0 ? availableChoices : easterEggNames;
    const choice = pool[Math.floor(Math.random() * pool.length)];

    updateName("first", choice.first);
    updateName("middle", choice.middle);
    updateName("last", choice.last);

    rememberName("first", choice.first);
    rememberName("middle", choice.middle);
    rememberName("last", choice.last);
  }

  function handleReset() {
    applySampleNames();
    setThemeId("prism");
    writeSavedThemeId("prism");
    setMode("dark");
    writeSavedMode("dark");
  }

  function rememberName(field, value) {
    const nextValue = value.trim();

    if (!nextValue) {
      return;
    }

    const updateRecentNames = (key, setter, existingNames) => {
      const nextNames = [
        nextValue,
        ...existingNames.filter((entry) => entry !== nextValue),
      ].slice(0, 6);

      setter(nextNames);
      writeRecentNames(key, nextNames);
    };

    if (field === "first") {
      updateRecentNames(
        recentNameKeys.first,
        setRecentFirstNames,
        recentFirstNames,
      );
    }

    if (field === "middle") {
      updateRecentNames(
        recentNameKeys.middle,
        setRecentMiddleNames,
        recentMiddleNames,
      );
    }

    if (field === "last") {
      updateRecentNames(
        recentNameKeys.last,
        setRecentLastNames,
        recentLastNames,
      );
    }
  }

  const signalWords = `${firstName} ${middleName} ${lastName}`.trim();

  return (
    <main
      className="shell"
      data-mode={mode}
      data-theme={theme.id}
      style={paletteStyle}
    >
      <div className="background-grid" aria-hidden="true" />
      <div className="background-orb background-orb-left" aria-hidden="true" />
      <div className="background-orb background-orb-right" aria-hidden="true" />

      <section className="hero-panel">
        <div className="hero-copy hero-copy-centered">
          <p className="eyebrow">Name2RGB // Browser experiences</p>
          <h1>Name2RGB</h1>
          <h2># Turn a full name into a precise color signal.</h2>
          <p>
            Enter a first, middle, and last name to generate an equivalent RGB
            color value (and matching hex code.)
          </p>
        </div>

        <div className="theme-strip" aria-label="Theme selector">
          <div className="theme-strip-header">
            <span className="theme-strip-label">Theme</span>
            <div
              className="mode-toggle mode-toggle-inline"
              aria-label="Page mode"
            >
              <button
                type="button"
                className={mode === "light" ? "mode-chip active" : "mode-chip"}
                onClick={() => handleModeChange("light")}
              >
                Light
              </button>
              <button
                type="button"
                className={mode === "dark" ? "mode-chip active" : "mode-chip"}
                onClick={() => handleModeChange("dark")}
              >
                Dark
              </button>
            </div>
          </div>
          <div className="theme-strip-buttons">
            {themes.map((entry) => (
              <button
                key={entry.id}
                type="button"
                className={
                  entry.id === themeId
                    ? "theme-strip-button active"
                    : "theme-strip-button"
                }
                onClick={() => handleThemeChange(entry.id)}
                aria-pressed={entry.id === themeId}
              >
                {entry.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="control-panel">
        <div className="panel-header">
          <div>
            <p className="section-label">Input Panel</p>
            <h2>Enter a name to generate its RGB color</h2>
          </div>
          <div className="status-pill">
            {theme.label} · {mode === "light" ? "Light" : "Dark"}
          </div>
        </div>

        <div className="input-grid">
          <label>
            <span>First name</span>
            <div className="input-row">
              <input
                type="text"
                list="first-name-history"
                value={firstName}
                onChange={(event) => updateName("first", event.target.value)}
                onBlur={(event) => rememberName("first", event.target.value)}
                placeholder="Enter first name"
              />
              {firstName ? (
                <button
                  type="button"
                  className="field-clear"
                  onClick={() => clearName("first")}
                  aria-label="Clear first name"
                >
                  Clear
                </button>
              ) : null}
            </div>
            <em>{breakdownLabel(firstName)}</em>
          </label>

          <label>
            <span>Middle name</span>
            <div className="input-row">
              <input
                type="text"
                list="middle-name-history"
                value={middleName}
                onChange={(event) => updateName("middle", event.target.value)}
                onBlur={(event) => rememberName("middle", event.target.value)}
                placeholder="Enter middle name"
              />
              {middleName ? (
                <button
                  type="button"
                  className="field-clear"
                  onClick={() => clearName("middle")}
                  aria-label="Clear middle name"
                >
                  Clear
                </button>
              ) : null}
            </div>
            <em>{breakdownLabel(middleName)}</em>
          </label>

          <label>
            <span>Last name</span>
            <div className="input-row">
              <input
                type="text"
                list="last-name-history"
                value={lastName}
                onChange={(event) => updateName("last", event.target.value)}
                onBlur={(event) => rememberName("last", event.target.value)}
                placeholder="Enter last name"
              />
              {lastName ? (
                <button
                  type="button"
                  className="field-clear"
                  onClick={() => clearName("last")}
                  aria-label="Clear last name"
                >
                  Clear
                </button>
              ) : null}
            </div>
            <em>{breakdownLabel(lastName)}</em>
          </label>
        </div>

        <datalist id="first-name-history">
          {recentFirstNames.map((name) => (
            <option key={name} value={name} />
          ))}
        </datalist>

        <datalist id="middle-name-history">
          {recentMiddleNames.map((name) => (
            <option key={name} value={name} />
          ))}
        </datalist>

        <datalist id="last-name-history">
          {recentLastNames.map((name) => (
            <option key={name} value={name} />
          ))}
        </datalist>

        <details className="panel-note panel-note-collapsible">
          <summary>How to use this panel</summary>
          <p>
            Enter the three name fields, then copy the hex, the RGB, or both
            results from the output panel below.
          </p>
        </details>

        <div className="button-row">
          <button
            type="button"
            className="secondary-button"
            onClick={chooseEasterEggNames}
          >
            Surprise me
          </button>
          <button
            type="button"
            className="secondary-button"
            onClick={handleReset}
          >
            Reset station
          </button>
        </div>
      </section>

      <section className="preview-grid">
        <article className="preview-card">
          <div className="panel-header compact">
            <div>
              <p className="section-label">Output Screen</p>
              <h2>Live palette preview</h2>
            </div>
            <div className="status-pill">
              {signalWords || "Waiting for signal"}
            </div>
          </div>

          <div className="swatch-wrap">
            <div className="swatch-stage">
              <div
                className="swatch-corner swatch-corner-top"
                aria-hidden="true"
              />
              <div
                className="swatch-corner swatch-corner-bottom"
                aria-hidden="true"
              />
              <div
                className="color-swatch"
                style={{ backgroundColor: `#${colorState.hex}` }}
                aria-label={`Color swatch for #${colorState.hex}`}
              />
            </div>
            <div className="swatch-text">
              <button
                type="button"
                className="copy-value copy-value-hex"
                onClick={() => handleCopy(`#${colorState.hex}`, "Hex copied")}
                aria-label={`Copy hex ${colorState.hex}`}
                title="Copy hex"
              >
                <span className="copy-value-text">#{colorState.hex}</span>
                <span className="copy-value-prompt">
                  {copiedLabel === "Hex copied" ? "copied" : "copy"}
                </span>
              </button>
              <button
                type="button"
                className="copy-value copy-value-rgb"
                onClick={() => handleCopy(colorState.rgb, "RGB copied")}
                aria-label={`Copy RGB ${colorState.rgb}`}
                title="Copy RGB"
              >
                <span className="copy-value-text">{colorState.rgb}</span>
                <span className="copy-value-prompt">
                  {copiedLabel === "RGB copied" ? "copied" : "copy"}
                </span>
              </button>
              <p>
                Computed as {colorState.red} red, {colorState.green} green,{" "}
                {colorState.blue} blue.
              </p>
              <button
                type="button"
                className="primary-button swatch-copy-all-button"
                onClick={handleCopyAll}
              >
                {copiedLabel === "All copied"
                  ? "Both copied"
                  : "Copy both results"}
              </button>
            </div>
          </div>
        </article>

        <article className="preview-card trace-card">
          <div className="panel-header compact">
            <div>
              <p className="section-label">Browser Trace</p>
              <h2>Conversion path</h2>
            </div>
          </div>

          <ul className="trace-list trace-grid-list">
            <li className="trace-cell trace-name-cell">
              <span>First name</span>
              <strong>{firstName || "—"}</strong>
            </li>
            <li className="trace-cell trace-metric-cell">
              <span>R</span>
              <strong>{colorState.red}</strong>
            </li>
            <li className="trace-cell trace-name-cell">
              <span>Middle name</span>
              <strong>{middleName || "—"}</strong>
            </li>
            <li className="trace-cell trace-metric-cell">
              <span>G</span>
              <strong>{colorState.green}</strong>
            </li>
            <li className="trace-cell trace-name-cell">
              <span>Last name</span>
              <strong>{lastName || "—"}</strong>
            </li>
            <li className="trace-cell trace-metric-cell">
              <span>B</span>
              <strong>{colorState.blue}</strong>
            </li>
            <li className="trace-cell trace-formula-cell">
              <span>Formula</span>
              <strong>Sum letters, multiply by 4, wrap to 0–255</strong>
            </li>
          </ul>

          <details className="footer-note footer-note-collapsible">
            <summary>How it works</summary>
            <p>
              Your name is reduced to letters only, each letter is scored by its
              place in the alphabet with A = 1, B = 2, ..., Z = 26. The total is
              multiplied by 4, and the result wraps into the 0–255 range for
              each RGB channel. The original process was inspired by
              @jared__cross via a video posted to Instagram.
            </p>
          </details>
        </article>
      </section>

      <footer className="site-footer" aria-label="Project credits and links">
        <div className="site-footer-grid">
          <div className="site-footer-column">
            <p className="section-label">Footer</p>
            <h2 className="site-footer-title">Credits and links</h2>
            <p className="site-footer-copy">
              Built by {footerProfile.authorName}. Inspired by{" "}
              <a
                href="https://www.instagram.com/reel/C--dKqZuYMS/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=="
                target="_blank"
                rel="noreferrer"
              >
                @jared__cross on Instagram
              </a>
              .
            </p>
          </div>

          <div className="site-footer-column">
            <h3>Repositories</h3>
            <ul className="site-footer-links">
              <li>
                {footerProfile.projectRepoUrl ? (
                  <a
                    href={footerProfile.projectRepoUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    This project on GitHub
                  </a>
                ) : (
                  <span className="footer-link-placeholder">
                    Add your project GitHub URL
                  </span>
                )}
              </li>
              <li>
                {footerProfile.originalCRepoUrl ? (
                  <a
                    href={footerProfile.originalCRepoUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Original C implementation
                  </a>
                ) : (
                  <span className="footer-link-placeholder">
                    Add original C repo URL
                  </span>
                )}
              </li>
            </ul>
          </div>

          <div className="site-footer-column">
            <h3>Connect</h3>
            <ul className="site-footer-links">
              <li>
                {footerProfile.linkedinUrl ? (
                  <a
                    href={footerProfile.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    LinkedIn profile
                  </a>
                ) : (
                  <span className="footer-link-placeholder">
                    Add your LinkedIn URL
                  </span>
                )}
              </li>
            </ul>
            <p className="site-footer-credit">
              Name2RGB interface adaptation by {footerProfile.authorName}.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}

export default App;
