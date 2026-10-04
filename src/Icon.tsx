type IconName =
  | "arrow"
  | "back"
  | "down"
  | "download"
  | "plus"
  | "close"
  | "menu"
  | "check"
  | "pause"
  | "play"
  | "layers";

const paths: Record<IconName, string> = {
  arrow: "M5 19 19 5M5 5h14v14",
  back: "M19 12H5m7-7-7 7 7 7",
  down: "M12 4v16m-7-7 7 7 7-7",
  download: "M12 3v12m-5-5 5 5 5-5M5 17v4h14v-4",
  plus: "M12 5v14M5 12h14",
  close: "m6 6 12 12M18 6 6 18",
  menu: "M4 8h16M4 16h16",
  check: "m5 12 4 4L19 6",
  pause: "M8 5v14M16 5v14",
  play: "m8 5 11 7-11 7Z",
  layers: "m3 8 9-5 9 5-9 5ZM3 12l9 5 9-5M3 16l9 5 9-5",
};

export function Icon({ name, className = "" }: { name: IconName; className?: string }) {
  return (
    <svg
      className={`icon icon-${name} ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={paths[name]} />
    </svg>
  );
}
