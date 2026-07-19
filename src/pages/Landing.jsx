import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Show, SignInButton, SignUpButton, useAuth, useUser, SignOutButton } from '@clerk/react';
import { 
  Shield, 
  Lock, 
  EyeOff, 
  Search, 
  Fingerprint, 
  FileX2, 
  UserX, 
  FileText, 
  HardDrive, 
  Trash2, 
  ArrowRight, 
  CheckCircle2, 
  Menu, 
  X,
  Activity
} from 'lucide-react';

export default function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isLoaded } = useUser();
  const { userId } = useAuth();
  
  const isPremiumUnlocked = userId && isLoaded && (
    localStorage.getItem(`opsec_premium_unlocked_${userId}`) === 'true' ||
    user?.publicMetadata?.premium === true
  );
  
  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', fontFamily: "'JetBrains Mono', 'Roboto Mono', monospace", position: 'relative', overflow: 'hidden' }}>
      
      {/* Background Elements */}
      <div className="bg-grid"></div>
      <div className="bg-grid-lines"></div>
      <div className="bg-radial"></div>
      <div className="bg-fade"></div>

      {/* HEADER */}
      <header className="header">
        <div className="container header-inner">
          <Link to="/" className="header-logo" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="header-logo-icon" style={{ color: '#10b981' }}>
              <Shield size={28} />
            </div>
            <span className="header-logo-text" style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#fff' }}>OpsecPlatform</span>
          </Link>
          
          <nav className="header-nav" style={{ display: 'none' }}>
            <a href="#features" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}>Features</a>
            <a href="#how-it-works" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}>How It Works</a>
            <a href="#security" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}>Security</a>
            <a href="#pricing" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}>Pricing</a>
          </nav>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Show when="signed-in">
              <Link to="/dashboard" className="btn-ghost" style={{ padding: '0.5rem 1rem', borderRadius: '4px', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.9rem' }}>Dashboard</Link>
              
              {/* Custom User Profile Badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: '8px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '11px', fontWeight: '600', color: '#fff' }}>
                    {user?.username || user?.firstName || user?.primaryEmailAddress?.emailAddress?.split('@')[0] || 'User'}
                  </span>
                  <span style={{ 
                    fontSize: '9px', 
                    fontWeight: 'bold', 
                    color: isPremiumUnlocked ? '#10b981' : '#737373',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginTop: '1px'
                  }}>
                    {isPremiumUnlocked ? 'Premium' : 'Free'}
                  </span>
                </div>
              </div>

              <SignOutButton>
                <button style={{ 
                  background: 'transparent', 
                  border: '1px solid rgba(255,255,255,0.08)', 
                  color: '#a3a3a3', 
                  fontSize: '11px', 
                  padding: '8px 14px', 
                  borderRadius: '6px', 
                  cursor: 'pointer',
                  fontWeight: '500',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#a3a3a3'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}>
                  Logout
                </button>
              </SignOutButton>
            </Show>
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="btn-ghost" style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.9rem', cursor: 'pointer' }}>Sign In</button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="btn-primary" style={{ background: '#10b981', color: '#000', border: '1px solid #10b981', boxShadow: '0 0 15px rgba(16,185,129,0.2)', padding: '0.5rem 1rem', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.9rem', cursor: 'pointer' }}>Get Started</button>
              </SignUpButton>
            </Show>
            <button className="mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '0.5rem' }}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>
      
      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div style={{ position: 'fixed', top: '70px', left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(10px)', padding: '2rem', zIndex: 99, borderBottom: '1px solid rgba(16,185,129,0.2)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <a href="#features" onClick={() => setMobileMenuOpen(false)} style={{ color: '#fff', textDecoration: 'none', fontSize: '1.1rem' }}>Features</a>
            <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} style={{ color: '#fff', textDecoration: 'none', fontSize: '1.1rem' }}>How It Works</a>
            <a href="#security" onClick={() => setMobileMenuOpen(false)} style={{ color: '#fff', textDecoration: 'none', fontSize: '1.1rem' }}>Security</a>
            <a href="#pricing" onClick={() => setMobileMenuOpen(false)} style={{ color: '#fff', textDecoration: 'none', fontSize: '1.1rem' }}>Pricing</a>
            <Show when="signed-in">
              <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="btn-primary" style={{ background: '#10b981', color: '#000', border: '1px solid #10b981', boxShadow: '0 0 20px rgba(16,185,129,0.3)', padding: '0.75rem', textAlign: 'center', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold', marginTop: '1rem' }}>Go to Dashboard</Link>
            </Show>
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="btn-ghost" onClick={() => setMobileMenuOpen(false)} style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '1rem', cursor: 'pointer', width: '100%' }}>Sign In</button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="btn-primary" onClick={() => setMobileMenuOpen(false)} style={{ background: '#10b981', color: '#000', border: '1px solid #10b981', boxShadow: '0 0 20px rgba(16,185,129,0.3)', padding: '0.75rem', borderRadius: '4px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', width: '100%', marginTop: '0.5rem' }}>Get Started</button>
              </SignUpButton>
            </Show>
          </div>
        </div>
      )}

      {/* HERO */}
      <section className="hero" style={{ paddingTop: '150px', paddingBottom: '100px', position: 'relative', overflow: 'hidden' }}>
        <div className="hero-glow" style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(60px)', pointerEvents: 'none' }}></div>
        
        <div className="container hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          
          <div className="hero-content anim-slide-up">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', padding: '0.25rem 0.75rem', borderRadius: '999px', marginBottom: '1.5rem' }}>
              <div className="status-dot" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }}></div>
              <span style={{ color: '#10b981', fontSize: '0.75rem', fontWeight: 'bold', letterSpacing: '0.05em' }}>OPSEC PLATFORM</span>
            </div>
            
            <h1 style={{ fontSize: '3.5rem', lineHeight: '1.1', marginBottom: '1.5rem', fontWeight: '800' }}>
              Bulletproof your digital <span className="hero-underline" style={{ position: 'relative', whiteSpace: 'nowrap' }}>identity.
                <svg width="100%" height="12" viewBox="0 0 200 12" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', bottom: '-4px', left: 0, width: '100%' }}>
                  <path d="M2 10C50 4 150 2 198 8" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
            
            <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.6)', marginBottom: '2.5rem', lineHeight: '1.6', maxWidth: '500px' }}>
              An advanced suite of client-side privacy tools designed for complete operational security. Scrutinize, sanitize, and secure your data without it ever leaving your browser.
            </p>
            
            <div className="hero-buttons" style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
              <Link to="/dashboard" className="btn-primary" style={{ background: '#10b981', color: '#000', border: '1px solid #10b981', boxShadow: '0 0 20px rgba(16,185,129,0.3)', padding: '0.875rem 1.5rem', borderRadius: '4px', textDecoration: 'none', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s' }}>
                Get Premium <ArrowRight size={18} />
              </Link>
              <a href="#features" className="btn-ghost" style={{ padding: '0.875rem 1.5rem', borderRadius: '4px', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', fontWeight: '600', transition: 'all 0.2s' }}>
                Explore Tools
              </a>
            </div>
            
            <div style={{ display: 'flex', gap: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem' }}>
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#fff' }}>7+</div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>Premium Tools</div>
              </div>
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#fff' }}>100%</div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>Client-Side</div>
              </div>
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#fff' }}>24/7</div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>Protection</div>
              </div>
            </div>
          </div>
          
          <style>{`
            @keyframes rotate-clockwise {
              0% { transform: translate(-50%, -50%) rotate(0deg); }
              100% { transform: translate(-50%, -50%) rotate(360deg); }
            }
            @keyframes rotate-counter {
              0% { transform: translate(-50%, -50%) rotate(360deg); }
              100% { transform: translate(-50%, -50%) rotate(0deg); }
            }
            @keyframes pulse-glow {
              0% { box-shadow: 0 0 20px rgba(16,185,129,0.2); }
              50% { box-shadow: 0 0 40px rgba(16,185,129,0.5); }
              100% { box-shadow: 0 0 20px rgba(16,185,129,0.2); }
            }
          `}</style>
          
          <div className="hero-visual anim-float" style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ position: 'relative', width: '350px', height: '350px', margin: 'auto' }}>
              {/* Center Icon */}
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80px', height: '80px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10, animation: 'pulse-glow 3s infinite ease-in-out' }}>
                <Shield size={36} color="#10b981" />
              </div>
              
              {/* Inner Orbital Ring (dashed) */}
              <div style={{ position: 'absolute', top: '50%', left: '50%', width: '220px', height: '220px', border: '1px dashed rgba(16,185,129,0.2)', borderRadius: '50%', animation: 'rotate-counter 25s linear infinite' }}></div>
              
              {/* Outer Orbital Ring (solid) and Rotating Icons */}
              <div style={{ 
                position: 'absolute', 
                top: '50%', 
                left: '50%', 
                width: '320px', 
                height: '320px', 
                border: '1px solid rgba(255,255,255,0.05)', 
                borderRadius: '50%',
                animation: 'rotate-clockwise 35s linear infinite',
                transformOrigin: 'center'
              }}>
                <div style={{ position: 'absolute', top: '0', left: '50%', transform: 'translate(-50%, -50%)', width: '48px', height: '48px', background: '#09090b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Lock size={20} color="rgba(255,255,255,0.7)" /></div>
                <div style={{ position: 'absolute', top: '25%', left: '93.3%', transform: 'translate(-50%, -50%)', width: '48px', height: '48px', background: '#09090b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><EyeOff size={20} color="rgba(255,255,255,0.7)" /></div>
                <div style={{ position: 'absolute', top: '75%', left: '93.3%', transform: 'translate(-50%, -50%)', width: '48px', height: '48px', background: '#09090b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Search size={20} color="rgba(255,255,255,0.7)" /></div>
                <div style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translate(-50%, -50%)', width: '48px', height: '48px', background: '#09090b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Fingerprint size={20} color="rgba(255,255,255,0.7)" /></div>
                <div style={{ position: 'absolute', top: '75%', left: '6.7%', transform: 'translate(-50%, -50%)', width: '48px', height: '48px', background: '#09090b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><FileX2 size={20} color="rgba(255,255,255,0.7)" /></div>
                <div style={{ position: 'absolute', top: '25%', left: '6.7%', transform: 'translate(-50%, -50%)', width: '48px', height: '48px', background: '#09090b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><UserX size={20} color="rgba(255,255,255,0.7)" /></div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* TERMINAL CONSOLE */}
      <section className="section" style={{ padding: '4rem 0' }}>
        <div className="container container-md anim-slide-up anim-delay-1">
          <div className="terminal" style={{ background: '#0c0c0c', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
            <div className="terminal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', background: '#111', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="terminal-dots" style={{ display: 'flex', gap: '6px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }}></div>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#eab308' }}></div>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#22c55e' }}></div>
              </div>
              <div className="terminal-title" style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace' }}>opsec-system-status</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div className="status-online" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981', animation: 'pulse 2s infinite' }}></div>
                <span style={{ fontSize: '0.75rem', color: '#10b981', textTransform: 'uppercase', letterSpacing: '1px' }}>Secure</span>
              </div>
            </div>
            
            <div className="terminal-layout" style={{ display: 'flex', minHeight: '300px', flexWrap: 'wrap' }}>
              <div className="terminal-sidebar" style={{ width: '200px', borderRight: '1px solid rgba(255,255,255,0.05)', padding: '1.5rem', background: 'rgba(0,0,0,0.2)' }}>
                <div className="terminal-sidebar-title" style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>Active Modules</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <li style={{ fontSize: '0.85rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={14} /> DNS Engine</li>
                  <li style={{ fontSize: '0.85rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={14} /> EXIF Scrubber</li>
                  <li style={{ fontSize: '0.85rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={14} /> Data Shredder</li>
                  <li style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Activity size={14} /> Threat Intel</li>
                </ul>
              </div>
              
              <div className="terminal-main" style={{ flex: 1, padding: '1.5rem', fontFamily: 'monospace', fontSize: '0.9rem', lineHeight: '1.6' }}>
                <div className="terminal-output">
                  <div style={{ color: 'rgba(255,255,255,0.5)' }}>[00:00:01] Initializing OPSEC protocols...</div>
                  <div style={{ color: '#10b981' }}>[00:00:01] Local encryption keys generated.</div>
                  <div style={{ color: 'rgba(255,255,255,0.5)' }}>[00:00:02] Establishing secure DOM sandbox...</div>
                  <div style={{ color: '#10b981' }}>[00:00:02] Sandbox active. Telemetry blocked.</div>
                  <div style={{ color: '#eab308', marginTop: '1rem', marginBottom: '0.5rem' }}>&gt; SYSTEM READY. ZERO-KNOWLEDGE MODE ENGAGED.</div>
                  <div style={{ display: 'flex', marginTop: '1rem' }}>
                    <span style={{ color: '#10b981', marginRight: '0.5rem' }}>root@opsec:~$</span>
                    <span style={{ color: '#fff' }}>./scan_perimeter.sh</span>
                  </div>
                  <div style={{ display: 'flex', marginTop: '0.5rem' }}>
                    <span style={{ color: '#10b981', marginRight: '0.5rem' }}>root@opsec:~$</span>
                    <span className="terminal-cursor" style={{ display: 'inline-block', width: '8px', height: '15px', background: '#10b981', animation: 'blink 1s step-end infinite' }}></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="section" style={{ padding: '6rem 0', background: 'linear-gradient(to bottom, transparent, rgba(16,185,129,0.03))' }}>
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div className="section-label" style={{ color: '#10b981', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>Workflow</div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem' }}>Zero-Trust Execution</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem' }}>Our tools run entirely in your browser. No servers, no logs, no leaks.</p>
          </div>
          
          <div className="steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {[
              { num: '01', title: 'Local Processing', desc: 'All data is processed strictly client-side. We never see your files or queries.', icon: <HardDrive size={24} /> },
              { num: '02', title: 'Execution', desc: 'WebAssembly and JS engines sanitize, encrypt, or analyze your inputs instantly.', icon: <Activity size={24} /> },
              { num: '03', title: 'Secure Output', desc: 'Results are provided directly to your screen, leaving zero digital footprints.', icon: <Shield size={24} /> }
            ].map((step, i) => (
              <div key={i} className="step-card anim-slide-up" style={{ animationDelay: `${(i+1)*0.2}s`, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '2rem', position: 'relative', marginTop: '1rem' }}>
                <div className="step-badge" style={{ position: 'absolute', top: '-1rem', left: '2rem', background: '#09090b', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981', fontSize: '0.8rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderRadius: '999px' }}>STEP {step.num}</div>
                <div style={{ color: '#10b981', marginBottom: '1.5rem', marginTop: '1rem' }}>{step.icon}</div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', fontWeight: '600' }}>{step.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: '1.6', fontSize: '0.95rem' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="section" style={{ padding: '6rem 0' }}>
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div className="section-label" style={{ color: '#10b981', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>Toolset</div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem' }}>Comprehensive OPSEC Arsenal</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem' }}>Everything you need to maintain absolute operational security.</p>
          </div>
          
          <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {[
              { icon: <Search size={24} />, title: 'DNS Intel', desc: 'Deep DNS inspection and historic record lookup without triggering alerts.' },
              { icon: <EyeOff size={24} />, title: 'EXIF Scrubber', desc: 'Strip metadata from images instantly before uploading to hostile environments.' },
              { icon: <Trash2 size={24} />, title: 'Data Shredder', desc: 'Securely overwrite text and small files using military-grade algorithms.' },
              { icon: <FileText size={24} />, title: 'Log Sanitizer', desc: 'Automatically redact IPs, emails, and sensitive strings from text dumps.' },
              { icon: <Lock size={24} />, title: 'PGP Suite', desc: 'Generate keys, encrypt, and sign messages purely client-side.' },
              { icon: <Fingerprint size={24} />, title: 'Browser Fingerprint', desc: 'Analyze how you appear to trackers and adversaries.' },
              { icon: <UserX size={24} />, title: 'Identity Generator', desc: 'Create coherent, realistic false identities for compartmentalization.' },
              { icon: <FileX2 size={24} />, title: 'Steganography', desc: 'Hide encrypted messages within innocuous-looking images.' }
            ].map((feat, i) => (
              <div key={i} className="feature-card" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '1.5rem', transition: 'all 0.3s', cursor: 'pointer' }} onMouseOver={(e) => { e.currentTarget.style.borderColor = 'rgba(16,185,129,0.3)'; e.currentTarget.style.background = 'rgba(16,185,129,0.02)'; }} onMouseOut={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}>
                <div className="icon-box" style={{ width: '48px', height: '48px', borderRadius: '8px', background: 'rgba(16,185,129,0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                  {feat.icon}
                </div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', fontWeight: '600' }}>{feat.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', lineHeight: '1.5' }}>{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECURITY PERIMETER */}
      <section id="security" className="security-section" style={{ padding: '6rem 0', background: 'rgba(16,185,129,0.02)', borderTop: '1px solid rgba(16,185,129,0.1)', borderBottom: '1px solid rgba(16,185,129,0.1)' }}>
        <div className="container">
          <div className="security-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <Shield size={48} color="#10b981" style={{ marginBottom: '2rem' }} />
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1.5rem' }}>Absolute Perimeter Security</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: '700px', marginBottom: '3rem', fontSize: '1.1rem', lineHeight: '1.6' }}>
              We assume the network is compromised. That's why OpsecPlatform is built from the ground up to operate independently of trusted backends.
            </p>
            
            <div className="security-checks" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', width: '100%', maxWidth: '900px' }}>
              {[
                'No Analytics tracking',
                'No external CDNs',
                'No telemetry data',
                'Open-source components'
              ].map((text, i) => (
                <div key={i} className="security-check" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', background: 'rgba(0,0,0,0.5)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <CheckCircle2 size={20} style={{ color: '#10b981' }} />
                  <span style={{ fontSize: '0.95rem', fontWeight: '500' }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="section" style={{ padding: '6rem 0' }}>
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div className="section-label" style={{ color: '#10b981', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>Access</div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem' }}>Simple Pricing. No Subscriptions.</h2>
          </div>
          
          <div className="pricing-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '900px', margin: '0 auto' }}>
            
            {/* Free Tier */}
            <div className="pricing-card" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '2.5rem', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'rgba(255,255,255,0.8)' }}>Basic Opsec</h3>
              <div className="pricing-price" style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '0.5rem' }}>€0</div>
              <p className="pricing-desc" style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '2rem', fontSize: '0.9rem' }}>Essential tools for casual security.</p>
              
              <ul className="pricing-features" style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', flex: 1 }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', fontSize: '0.95rem' }}>
                  <CheckCircle2 size={18} style={{ color: '#10b981' }} /> <span>Basic DNS lookups</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', fontSize: '0.95rem' }}>
                  <CheckCircle2 size={18} style={{ color: '#10b981' }} /> <span>EXIF Scrubber (Max 5MB)</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', fontSize: '0.95rem' }}>
                  <CheckCircle2 size={18} style={{ color: '#10b981' }} /> <span>Log Sanitizer (Basic regex)</span>
                </li>
              </ul>
              
              <Link to="/dashboard" className="btn-ghost" style={{ display: 'block', width: '100%', textAlign: 'center', padding: '0.875rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', textDecoration: 'none', fontWeight: '600' }}>Access Free Tools</Link>
            </div>

            {/* Premium Tier */}
            <div className="pricing-card" style={{ background: 'linear-gradient(180deg, rgba(16,185,129,0.05) 0%, rgba(0,0,0,0) 100%)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '12px', padding: '2.5rem', display: 'flex', flexDirection: 'column', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translate(-50%, -50%)', background: '#10b981', color: '#000', padding: '0.25rem 1rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Recommended</div>
              
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#10b981' }}>Premium Operator</h3>
              <div className="pricing-price" style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '0.5rem' }}>€15<span style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.5)', fontWeight: 'normal' }}> /lifetime</span></div>
              <p className="pricing-desc" style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '2rem', fontSize: '0.9rem' }}>Full arsenal for dedicated security.</p>
              
              <ul className="pricing-features" style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', flex: 1 }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', fontSize: '0.95rem' }}>
                  <CheckCircle2 size={18} style={{ color: '#10b981' }} /> <span>Advanced DNS Intel + History</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', fontSize: '0.95rem' }}>
                  <CheckCircle2 size={18} style={{ color: '#10b981' }} /> <span>Unlimited file sizes</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', fontSize: '0.95rem' }}>
                  <CheckCircle2 size={18} style={{ color: '#10b981' }} /> <span>All 7+ Premium Tools</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', fontSize: '0.95rem' }}>
                  <CheckCircle2 size={18} style={{ color: '#10b981' }} /> <span>Priority Support</span>
                </li>
              </ul>
              
              <Link to="/dashboard" className="btn-primary" style={{ display: 'block', width: '100%', textAlign: 'center', padding: '0.875rem', borderRadius: '6px', background: '#10b981', color: '#000', border: '1px solid #10b981', boxShadow: '0 0 20px rgba(16,185,129,0.3)', textDecoration: 'none', fontWeight: '600' }}>Get Premium</Link>
            </div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section" style={{ padding: '6rem 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="cta-content" style={{ background: 'linear-gradient(45deg, rgba(16,185,129,0.1), rgba(0,0,0,0.5))', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '16px', padding: '4rem 2rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1.5rem' }}>Ready to secure your workflow?</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: '500px', margin: '0 auto 2.5rem auto', fontSize: '1.1rem' }}>Join operators worldwide who trust OpsecPlatform for their daily security needs.</p>
            <div className="cta-buttons" style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <Link to="/dashboard" className="btn-primary" style={{ background: '#10b981', color: '#000', border: '1px solid #10b981', boxShadow: '0 0 20px rgba(16,185,129,0.3)', padding: '1rem 2rem', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.1rem' }}>Launch Dashboard</Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '3rem 0', background: '#050505' }}>
        <div className="container">
          <div className="footer-inner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
            
            <div className="footer-brand" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Shield size={24} color="#10b981" />
              <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>OpsecPlatform</span>
              <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem', marginLeft: '1rem' }}>© 2026</span>
            </div>
            
            <div className="footer-links" style={{ display: 'flex', gap: '2rem' }}>
              <a href="#" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = '#10b981'} onMouseOut={(e) => e.target.style.color = 'rgba(255,255,255,0.5)'}>Terms</a>
              <a href="#" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = '#10b981'} onMouseOut={(e) => e.target.style.color = 'rgba(255,255,255,0.5)'}>Privacy</a>
              <a href="#" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = '#10b981'} onMouseOut={(e) => e.target.style.color = 'rgba(255,255,255,0.5)'}>Contact</a>
            </div>

          </div>
        </div>
      </footer>
      
    </div>
  );
}
