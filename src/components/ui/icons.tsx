/**
 * Brand icons — lucide-react v1 removed brand glyphs, so the GitHub mark
 * and Google "G" live here as small inline SVGs styled to match lucide
 * (24×24 viewBox, currentColor, sized via className).
 */

export function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.72-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.67.41.35.77 1.05.77 2.12 0 1.53-.01 2.76-.01 3.14 0 .3.2.66.8.55A11.52 11.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  )
}

export function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M21.64 12.2c0-.64-.06-1.25-.16-1.84H12v3.48h5.4a4.62 4.62 0 0 1-2 3.04v2.52h3.24c1.9-1.75 3-4.32 3-7.2Z" />
      <path d="M12 22c2.7 0 4.96-.9 6.64-2.44l-3.24-2.52c-.9.6-2.05.96-3.4.96-2.62 0-4.83-1.76-5.62-4.14H3.05v2.6A10 10 0 0 0 12 22Z" opacity=".8" />
      <path d="M6.38 13.86a6 6 0 0 1 0-3.83V7.43H3.05a10 10 0 0 0 0 9.03l3.33-2.6Z" opacity=".6" />
      <path d="M12 5.9c1.47 0 2.79.5 3.83 1.5l2.87-2.87C16.95 2.99 14.7 2 12 2A10 10 0 0 0 3.05 7.43l3.33 2.6C7.17 7.66 9.38 5.9 12 5.9Z" opacity=".9" />
    </svg>
  )
}
