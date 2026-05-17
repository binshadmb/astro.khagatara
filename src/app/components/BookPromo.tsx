import { BOOK_PROMO_CONFIG } from '../book-config'

interface BookPromoProps {
  lang: string
}

export default function BookPromo({ lang }: BookPromoProps) {
  if (!BOOK_PROMO_CONFIG.active) return null

  // Resolve translation with fallback to English
  const t = BOOK_PROMO_CONFIG.translations[lang as keyof typeof BOOK_PROMO_CONFIG.translations] 
    || BOOK_PROMO_CONFIG.translations['en']

  return (
    <div 
      className="card book-promo-card" 
      style={{
        background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.95), rgba(15, 15, 25, 0.98))',
        border: '1px solid rgba(245, 200, 66, 0.25)',
        boxShadow: '0 8px 32px 0 rgba(245, 200, 66, 0.05), inset 0 0 20px rgba(245, 200, 66, 0.02)',
        borderRadius: '16px',
        padding: '28px',
        marginTop: '32px',
        maxWidth: '760px',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Decorative subtle background gold glow */}
      <div 
        style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '150px',
          height: '150px',
          background: 'rgba(245, 200, 66, 0.08)',
          filter: 'blur(40px)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Title */}
        <h3 
          style={{ 
            color: '#f5c842', 
            fontSize: '1.4rem', 
            margin: '0 0 8px 0',
            fontWeight: '700',
            lineHeight: '1.4',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          {t.title}
        </h3>

        {/* 5 Bullet Points */}
        <ul 
          style={{ 
            listStyle: 'none', 
            padding: '0', 
            margin: '0', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '12px' 
          }}
        >
          {t.bullets.map((bullet, idx) => (
            <li 
              key={idx} 
              style={{ 
                display: 'flex', 
                alignItems: 'flex-start', 
                gap: '10px',
                color: '#ddd',
                fontSize: '0.92rem',
                lineHeight: '1.5'
              }}
            >
              <span 
                style={{ 
                  color: '#f5c842', 
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  lineHeight: '1.2'
                }}
              >
                ✦
              </span>
              <span>{bullet}</span>
            </li>
          ))}
        </ul>

        <hr style={{ border: 'none', borderTop: '1px solid rgba(255, 255, 255, 0.08)', margin: '8px 0' }} />

        {/* Action Button & Payment Note */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center', marginTop: '4px' }}>
          <a
            href={BOOK_PROMO_CONFIG.checkoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{
              display: 'inline-block',
              textAlign: 'center',
              width: '100%',
              textDecoration: 'none',
              padding: '14px 28px',
              fontWeight: '700',
              letterSpacing: '0.5px',
              fontSize: '1.05rem',
              boxShadow: '0 4px 15px rgba(245, 200, 66, 0.15)'
            }}
          >
            {t.btnText}
          </a>
          <span style={{ color: '#666', fontSize: '0.78rem', letterSpacing: '0.3px' }}>
            {t.paymentNote}
          </span>
        </div>

      </div>
    </div>
  )
}
