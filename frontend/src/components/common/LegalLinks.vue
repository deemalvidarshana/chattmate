<template>
  <nav class="legal-links" aria-label="Legal information">
    <a href="/privacy.html">Privacy Policy</a>
    <span aria-hidden="true">·</span>
    <a href="/terms.html">Terms of Service</a>
  </nav>
</template>

<style scoped>
.legal-links {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin: 22px 0 0;
  font-size: 12px;
  line-height: 1.6;
  color: var(--muted2);
}
.legal-links a { color: inherit; text-underline-offset: 3px; }
.legal-links a:hover { color: var(--accent-ink); }
.legal-links a:focus-visible { outline: 2px solid var(--accent-ink); outline-offset: 4px; }
</style>
