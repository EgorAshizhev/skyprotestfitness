// Небольшие SVG-иконки из макета. Цвет берётся из currentColor.

export const LogoIcon = () => (
  <svg width="30" height="26" viewBox="0 0 30 26" fill="none" aria-hidden="true">
    <path d="M0 2.2C0 .5 1.9-.5 3.3.4l12.4 8.3c1.2.8 1.2 2.6 0 3.4L3.3 20.4C1.9 21.3 0 20.3 0 18.6V2.2Z" fill="#00C1FF" />
    <path d="M12 2.2c0-1.7 1.9-2.7 3.3-1.8l12.4 8.3c1.2.8 1.2 2.6 0 3.4l-12.4 8.3c-1.4.9-3.3-.1-3.3-1.8V2.2Z" fill="#BCEC30" />
  </svg>
);

export const CalendarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M4.5 0a.75.75 0 0 1 .75.75V2h5.5V.75a.75.75 0 0 1 1.5 0V2h.5A2.25 2.25 0 0 1 15 4.25v9.5A2.25 2.25 0 0 1 12.75 16h-9.5A2.25 2.25 0 0 1 1 13.75v-9.5A2.25 2.25 0 0 1 3.25 2h.5V.75A.75.75 0 0 1 4.5 0ZM2.5 6.5v7.25c0 .41.34.75.75.75h9.5c.41 0 .75-.34.75-.75V6.5h-11Z" />
  </svg>
);

export const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0Zm.75 4v3.69l2.28 2.28a.75.75 0 1 1-1.06 1.06L7.47 8.53A.75.75 0 0 1 7.25 8V4a.75.75 0 0 1 1.5 0Z" />
  </svg>
);

export const LevelIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="#00C1FF" aria-hidden="true">
    <rect x="1" y="10" width="3.5" height="5" rx="1" />
    <rect x="6.25" y="6" width="3.5" height="9" rx="1" opacity=".45" />
    <rect x="11.5" y="1" width="3.5" height="14" rx="1" opacity=".45" />
  </svg>
);
