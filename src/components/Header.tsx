function Header() {
  return (
    <header className="header">
      <div className="brand">
        <span className="brand__mark" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 5h11M10 2l3 3-3 3M14 11H3M6 8l-3 3 3 3" />
          </svg>
        </span>
        Troca Criptos
      </div>
      <span className="header__tagline">Compare com BTC e ETH ao longo do tempo</span>
    </header>
  );
}

export default Header;
