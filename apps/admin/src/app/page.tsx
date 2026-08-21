export default function AdminHomePage() {
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
        background: '#f4f4f5',
      }}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '12px',
          padding: '2.5rem',
          maxWidth: '480px',
          width: '100%',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        }}
      >
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          LuxeCraft Admin
        </h1>
        <p style={{ color: '#71717a', marginBottom: '1.5rem', fontSize: '0.9375rem' }}>
          Super Admin Panel — Phase 1 Foundation
        </p>
        <p style={{ fontSize: '0.875rem', color: '#a1a1aa', marginBottom: '1.5rem' }}>
          Authentication and admin features are implemented in Phase 2.
        </p>
        <a
          href="/api/v1/health"
          style={{
            display: 'inline-block',
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
      </div>
    </main>
  );
}
