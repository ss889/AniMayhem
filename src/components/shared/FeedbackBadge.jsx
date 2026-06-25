export function FeedbackBadge({ state, children }) {
  if (!state) {
    return null;
  }

  return (
    <div className={`feedback-badge feedback-badge--${state}`} role="status">
      {children}
    </div>
  );
}
