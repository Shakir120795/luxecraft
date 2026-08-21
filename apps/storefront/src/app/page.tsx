export default function HomePage() {
  return (
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: '1rem',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      <h1 style={{ fontSize: '2.5rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
        LuxeCraft
      </h1>
      <p style={{ fontSize: '1.125rem', color: '#6b7280', maxWidth: '480px' }}>
        Worldwide Luxury Ecommerce Platform
      </p>
      <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
        Phase 1 — Foundation · Storefront coming soon
      </p>
      <a
        href="/api/v1/health"
        style={{
          marginTop: '1rem',
          padding: '0.5rem 1.25rem',
          background: '#1a1a1a',
          color: '#fff',
          borderRadius: '6px',
          textDecoration: 'none',
          fontSize: '0.875rem',
        }}
      >
        API Health Check →
      </a>
    </main>
  );
}
