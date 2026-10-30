/**
 * Arrow-key navigation for role="tablist" (WAI-ARIA tabs pattern, automatic activation):
 * Left/Up and Right/Down move between tabs, Home/End jump to the ends; the newly focused tab is clicked.
 */
export function onTabKeys(e: React.KeyboardEvent<HTMLElement>) {
  const keys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"];
  if (!keys.includes(e.key)) return;
  const tabs = Array.from(e.currentTarget.querySelectorAll<HTMLElement>('[role="tab"]'));
  const i = tabs.indexOf(document.activeElement as HTMLElement);
  if (i < 0) return;
  e.preventDefault();
  const next =
    e.key === "Home" ? 0 : e.key === "End" ? tabs.length - 1 : (i + (e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 1) + tabs.length) % tabs.length;
  tabs[next].focus();
  tabs[next].click();
}
