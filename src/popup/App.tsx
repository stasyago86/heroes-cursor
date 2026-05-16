import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { getCursorOptionGroups, type CursorOption } from "../cursorOptions";
import { CURSOR_STORAGE_KEY, type StoredCursor } from "../shared/storage";

export function App() {
  const optionGroups = useMemo(() => getCursorOptionGroups(), []);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    chrome.storage.local.get(CURSOR_STORAGE_KEY, (r) => {
      const v = r[CURSOR_STORAGE_KEY] as StoredCursor | undefined;
      setSelectedId(v?.id ?? null);
    });
  }, []);

  const onPick = useCallback((opt: CursorOption) => {
    setSaving(true);
    const payload: StoredCursor = {
      id: opt.id,
      css: opt.css,
      ...(opt.hoverCss ? { hoverCss: opt.hoverCss } : {}),
    };
    chrome.storage.local.set({ [CURSOR_STORAGE_KEY]: payload }, () => {
      setSelectedId(opt.id);
      setSaving(false);
    });
  }, []);

  const onReset = useCallback(() => {
    setSaving(true);
    chrome.storage.local.remove(CURSOR_STORAGE_KEY, () => {
      setSelectedId(null);
      setSaving(false);
    });
  }, []);

  return (
    <div className="popup">
      <header className="popup__header">
        <h1 className="popup__title">Cursor</h1>
        <p className="popup__subtitle">Your choice is saved and applied on supported web pages.</p>
      </header>
      <ul className="list" aria-label="Cursor styles">
        {optionGroups.map((group) => (
          <Fragment key={group.id}>
            {group.title ? (
              <li className="list__category" role="presentation">
                {group.title}
              </li>
            ) : null}
            {group.options.map((opt) => {
              const active = opt.id === selectedId;
              return (
                <li key={opt.id}>
                  <button
                    type="button"
                    className={`list__item${active ? " list__item--active" : ""}`}
                    onClick={() => onPick(opt)}
                    disabled={saving}
                    aria-pressed={active}
                  >
                    <span className="list__preview" aria-hidden>
                      {opt.preview}
                    </span>
                    <span className="list__label">{opt.label}</span>
                  </button>
                </li>
              );
            })}
          </Fragment>
        ))}
      </ul>
      <footer className="popup__footer">
        <button type="button" className="btn btn--ghost" onClick={onReset} disabled={saving || !selectedId}>
          Use site default
        </button>
      </footer>
    </div>
  );
}
