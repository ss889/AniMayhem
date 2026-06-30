import { useEffect, useState } from 'react';

const STORAGE_KEY = 'animayhem-consent';

export function ConsentBanner() {
  const [choice, setChoice] = useState(null);
  const [isManaging, setIsManaging] = useState(false);

  useEffect(() => {
    setChoice(window.localStorage.getItem(STORAGE_KEY));
  }, []);

  function saveConsent(value) {
    window.localStorage.setItem(STORAGE_KEY, value);
    setChoice(value);
    setIsManaging(false);
  }

  if (choice) {
    return null;
  }

  return (
    <aside className="consent-banner" aria-label="Site preferences">
      <div>
        <p>
          We use local storage to remember site preferences. Analytics are off unless
          you choose to allow them later.
        </p>
        {isManaging ? (
          <div className="consent-details">
            <span>Required preferences stay on.</span>
            <span>Anonymous analytics are currently disabled.</span>
          </div>
        ) : null}
      </div>
      <div className="consent-actions">
        <button className="outline-button" onClick={() => setIsManaging((value) => !value)} type="button">
          Manage
        </button>
        <button className="outline-button" onClick={() => saveConsent('declined')} type="button">
          Decline all
        </button>
        <button className="primary-button" onClick={() => saveConsent('accepted')} type="button">
          Accept all
        </button>
      </div>
    </aside>
  );
}
