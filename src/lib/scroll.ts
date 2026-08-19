/** CSS `scroll-behavior: smooth` 를 잠시 끄고 즉시 상단으로 점프 */
export function jumpToTopInstant() {
  const html = document.documentElement;
  const prev = html.style.scrollBehavior;
  html.style.scrollBehavior = "auto";
  window.scrollTo(0, 0);
  html.scrollTop = 0;
  document.body.scrollTop = 0;
  requestAnimationFrame(() => {
    html.style.scrollBehavior = prev;
  });
}
