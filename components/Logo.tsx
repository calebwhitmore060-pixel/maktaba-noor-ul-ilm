export default function LogoMark({ size = 52 }: { size?: number }) {
  return (
    <svg className="logo-mark" width={size} height={size} viewBox="0 0 64 64" role="img" aria-label="Maktaba Noor-ul-Ilm logo">
      <rect x="2" y="2" width="60" height="60" rx="14" fill="#123D32" />
      <path d="M32 46V22C26 16 18 15 10 18v22c8-3 16-2 22 6zm0 0c6-8 14-9 22-6V18c-8-3-16-2-22 4" fill="#F7F3E9" />
      <path d="M32 22v24" stroke="#C5A15B" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M32 8v4M24 11l2 3M40 11l-2 3" stroke="#C5A15B" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="32" cy="13" r="2.6" fill="#C5A15B" />
    </svg>
  );
}
