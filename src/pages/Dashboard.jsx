import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Show, RedirectToSignIn, useAuth, useUser, SignOutButton } from '@clerk/react';
import { 
  LayoutDashboard, Fingerprint, FileX2, Shield, UserX, 
  FileText, HardDrive, Trash2, Search, Menu, X, ArrowLeft, Lock,
  Key, Image, ShieldAlert, Clock, Activity 
} from 'lucide-react';

import FingerprintAnalyser from '../tools/FingerprintAnalyser';
import MetadataStripper from '../tools/MetadataStripper';
import ThreatModeling from '../tools/ThreatModeling';
import BurnerIdentity from '../tools/BurnerIdentity';
import DataBrokerRemoval from '../tools/DataBrokerRemoval';
import HardeningGuide from '../tools/HardeningGuide';
import SocialSanitizer from '../tools/SocialSanitizer';
import DnsIntel from '../tools/DnsIntel';
import DataShredder from '../tools/DataShredder';
import LogSanitizer from '../tools/LogSanitizer';
import PgpSuite from '../tools/PgpSuite';
import Steganography from '../tools/Steganography';

const TOOLS = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'fingerprint', label: 'Fingerprint', icon: Fingerprint, desc: 'Analyze your browser fingerprint and tracking exposure' },
  { key: 'metadata', label: 'Metadata Strip', icon: FileX2, desc: 'Remove EXIF and GPS data from your photos' },
  { key: 'threat-model', label: 'Threat Model', icon: Shield, desc: 'Build a personalized threat model and OPSEC policy' },
  { key: 'burner', label: 'Burner Identity', icon: UserX, desc: 'Generate and manage disposable identities' },
  { key: 'data-broker', label: 'Data Removal', icon: FileText, desc: 'Generate GDPR removal requests for data brokers' },
  { key: 'hardening', label: 'Hardening', icon: HardDrive, desc: 'OS hardening checklists for Windows, Mac, Linux' },
  { key: 'social', label: 'Social Sanitizer', icon: Trash2, desc: 'Lock down your social media privacy settings' },
  { key: 'dns-intel', label: 'DNS & IP Intel', icon: Search, desc: 'DNS lookups and IP geolocation intelligence' },
  { key: 'shredder', label: 'Data Shredder', icon: Trash2, desc: 'Securely overwrite text and small files using military-grade algorithms' },
  { key: 'sanitizer', label: 'Log Sanitizer', icon: FileText, desc: 'Automatically redact IPs, emails, and sensitive strings from text dumps' },
  { key: 'pgp', label: 'PGP Suite', icon: Key, desc: 'Generate keys, encrypt, and sign messages purely client-side' },
  { key: 'stegano', label: 'Steganography', icon: Image, desc: 'Hide encrypted messages within innocuous-looking images' },
];

export default function Dashboard() {
  const { tool } = useParams();
  const { userId } = useAuth();
  const { user, isLoaded } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isPremiumUnlocked, setIsPremiumUnlocked] = useState(false);
  const [showPaywallModal, setShowPaywallModal] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    if (userId && isLoaded) {
      const hasLocalOverride = localStorage.getItem(`opsec_premium_unlocked_${userId}`) === 'true';
      const hasClerkPremium = user?.publicMetadata?.premium === true;
      setIsPremiumUnlocked(hasLocalOverride || hasClerkPremium);
    }
  }, [userId, user, isLoaded]);

  const unlockPremium = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      localStorage.setItem(`opsec_premium_unlocked_${userId}`, 'true');
      setIsPremiumUnlocked(true);
      setIsProcessingPayment(false);
      setShowPaywallModal(false);
    }, 2500);
  };



  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const currentToolKey = tool || 'overview';
  const currentTool = TOOLS.find(t => t.key === currentToolKey) || TOOLS[0];

  const renderToolComponent = () => {
    const isPremiumTool = currentToolKey !== 'overview' && currentToolKey !== 'dns-intel' && currentToolKey !== 'social' && currentToolKey !== 'burner' && currentToolKey !== 'shredder' && currentToolKey !== 'sanitizer';
    if (isPremiumTool && !isPremiumUnlocked) {
      return (
        <div style={{
          background: '#0a0a0a', border: '1px solid #10b981', borderRadius: '12px', padding: '40px', textAlign: 'center', color: '#10b981', fontFamily: '"JetBrains Mono", monospace', marginTop: '20px'
        }}>
          <Lock size={48} style={{ marginBottom: '20px' }} />
          <h2 style={{ color: '#fff' }}>Access Denied: Premium Tool</h2>
          <p style={{ color: '#a3a3a3', marginBottom: '30px' }}>Upgrade to the Bulletproof Suite to access this module.</p>
          <button onClick={() => setShowPaywallModal(true)} style={{ background: '#10b981', color: '#000', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            Initialize Upgrade Sequence
          </button>
        </div>
      );
    }

    switch (currentToolKey) {
      case 'fingerprint': return <FingerprintAnalyser />;
      case 'metadata': return <MetadataStripper />;
      case 'threat-model': return <ThreatModeling />;
      case 'burner': return <BurnerIdentity />;
      case 'data-broker': return <DataBrokerRemoval />;
      case 'hardening': return <HardeningGuide />;
      case 'social': return <SocialSanitizer />;
      case 'dns-intel': return <DnsIntel />;
      case 'shredder': return <DataShredder />;
      case 'sanitizer': return <LogSanitizer />;
      case 'pgp': return <PgpSuite />;
      case 'stegano': return <Steganography />;
      default: return <OverviewCards isPremiumUnlocked={isPremiumUnlocked} setShowPaywallModal={setShowPaywallModal} />;
    }
  };

  return (
    <>
      <style>{`@keyframes blink { 0% { opacity: 1; } 50% { opacity: 0; } 100% { opacity: 1; } }`}</style>
      <Show when="signed-in">
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#030303', color: '#fff', fontFamily: "'JetBrains Mono', 'Roboto Mono', monospace", position: 'relative', overflow: 'hidden' }}>
          
          {/* Background Elements */}
          <div className="bg-grid"></div>
          <div className="bg-grid-lines"></div>
          <div className="bg-radial"></div>
          <div className="bg-fade"></div>

          {/* Mobile Overlay */}
          {isMobileMenuOpen && (
            <div 
              style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 40 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}

          {/* Sidebar */}
          <div style={{
            position: 'fixed',
            top: 0, left: 0, bottom: 0,
            width: '240px',
            backgroundColor: '#0a0a0a',
            borderRight: '1px solid rgba(255,255,255,0.04)',
            padding: '20px 12px',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 50,
            transform: isMobile ? (isMobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)') : 'none',
            transition: 'transform 0.3s ease-in-out'
          }}>
            
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0 10px', marginBottom: '24px' }}>
              <div style={{
                width: '32px', height: '32px', 
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                borderRadius: '8px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontWeight: 'bold', fontSize: '14px', letterSpacing: '1px'
              }}>OP</div>
              <span style={{ fontSize: '16px', fontWeight: '600', color: '#fff', letterSpacing: '-0.5px' }}>OpsecPlatform</span>
              {isMobile && (
                <button onClick={() => setIsMobileMenuOpen(false)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#a3a3a3', cursor: 'pointer' }}>
                  <X size={20} />
                </button>
              )}
            </div>

            {/* Overview standalone link at top */}
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: '16px' }}>
              {(() => {
                const item = TOOLS.find(t => t.key === 'overview');
                const isActive = currentToolKey === 'overview';
                const Icon = item.icon;
                return (
                  <Link
                    key={item.key}
                    to="/dashboard"
                    onClick={() => isMobile && setIsMobileMenuOpen(false)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', color: isActive ? '#10b981' : '#a3a3a3', textDecoration: 'none', backgroundColor: isActive ? 'rgba(16,185,129,0.1)' : 'transparent', transition: 'all 0.2s', marginBottom: '2px',
                    }}
                    onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = '#fff'; } }}
                    onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#a3a3a3'; } }}
                  >
                    <Icon size={16} />
                    {item.label}
                  </Link>
                );
              })()}
            </nav>

            <div style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '10px',
              color: '#737373',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginTop: '8px',
              marginBottom: '12px',
              paddingLeft: '14px'
            }}>
              BULLETPROOF SUITE (PREMIUM)
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: '16px' }}>
              {TOOLS.filter(t => ['fingerprint', 'metadata', 'threat-model', 'data-broker', 'hardening', 'pgp', 'stegano'].includes(t.key)).map((item) => {
                const isActive = currentToolKey === item.key;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.key}
                    to={`/dashboard/${item.key}`}
                    onClick={(e) => {
                      if (!isPremiumUnlocked) {
                        e.preventDefault();
                        setShowPaywallModal(true);
                      }
                      isMobile && setIsMobileMenuOpen(false);
                    }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', color: isActive ? '#10b981' : '#a3a3a3', textDecoration: 'none', backgroundColor: isActive ? 'rgba(16,185,129,0.1)' : 'transparent', transition: 'all 0.2s', marginBottom: '2px',
                    }}
                    onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = '#fff'; } }}
                    onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#a3a3a3'; } }}
                  >
                    <Icon size={16} />
                    <span style={{ flex: 1 }}>{item.label}</span>
                    {!isPremiumUnlocked && <Lock size={12} />}
                  </Link>
                )
              })}
            </nav>

            <div style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '10px',
              color: '#737373',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginTop: '8px',
              marginBottom: '12px',
              paddingLeft: '14px'
            }}>
              STANDARD SUITE (FREE)
            </div>

            <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px', overflowY: 'auto' }}>
              {TOOLS.filter(t => ['burner', 'social', 'dns-intel', 'shredder', 'sanitizer'].includes(t.key)).map((item) => {
                const isActive = currentToolKey === item.key;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.key}
                    to={`/dashboard/${item.key}`}
                    onClick={() => isMobile && setIsMobileMenuOpen(false)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', color: isActive ? '#10b981' : '#a3a3a3', textDecoration: 'none', backgroundColor: isActive ? 'rgba(16,185,129,0.1)' : 'transparent', transition: 'all 0.2s', marginBottom: '2px',
                    }}
                    onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = '#fff'; } }}
                    onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#a3a3a3'; } }}
                  >
                    <Icon size={16} />
                    {item.label}
                  </Link>
                )
              })}
            </nav>

            {!isPremiumUnlocked && (
              <div style={{ padding: '14px 0', marginTop: '10px' }}>
                <button onClick={() => setShowPaywallModal(true)} style={{ width: '100%', background: '#10b981', color: '#000', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>
                  Upgrade to Premium
                </button>
              </div>
            )}

            <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
              <Link to="/" style={{
                display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', 
                borderRadius: '8px', fontSize: '13px', color: '#737373', textDecoration: 'none', transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#fff' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#737373' }}>
                <ArrowLeft size={16} />
                Back to Home
              </Link>
            </div>
          </div>

          {/* Main Content */}
          <main style={{
            flex: 1,
            marginLeft: isMobile ? '0' : '240px',
            padding: '24px 32px',
            minHeight: '100vh',
            boxSizing: 'border-box',
            position: 'relative',
            zIndex: 10
          }}>
            
            {/* Top bar */}
            <header style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              borderBottom: '1px solid rgba(255,255,255,0.04)',
              paddingBottom: '16px',
              marginBottom: '24px',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {isMobile && (
                  <button 
                    onClick={() => setIsMobileMenuOpen(true)}
                    style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 0, display: 'flex' }}
                  >
                    <Menu size={24} />
                  </button>
                )}
                <h1 style={{ fontSize: '20px', fontWeight: '600', margin: 0 }}>{currentTool.label}</h1>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
              </div>
            </header>

            <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
              {renderToolComponent()}
            </div>
          </main>

          {/* Paywall Modal */}
          {showPaywallModal && (
            <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ background: '#0a0a0a', border: '1px solid #10b981', borderRadius: '12px', padding: '24px', width: '95%', maxWidth: '440px', fontFamily: '"JetBrains Mono", monospace', maxHeight: '90vh', overflowY: 'auto' }}>
                <h3 style={{ color: '#10b981', marginTop: 0, fontSize: '16px' }}>&gt; MANUAL_PAYMENT_REQUIRED</h3>
                <p style={{ color: '#a3a3a3', fontSize: '12px', lineHeight: '1.5', marginBottom: '16px' }}>
                  Per sbloccare permanentemente la suite Bulletproof, invia <strong>€15 / 15 USDT</strong> ad uno dei seguenti indirizzi:
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                  {/* USDT */}
                  <div style={{ background: '#000', border: '1px solid rgba(16,185,129,0.15)', padding: '10px', borderRadius: '6px' }}>
                    <div style={{ fontSize: '10px', color: '#10b981', fontWeight: 'bold' }}>USDT (TRC-20)</div>
                    <div style={{ fontSize: '11px', color: '#fff', fontFamily: 'monospace', wordBreak: 'break-all', marginTop: '4px' }}>
                      {import.meta.env.VITE_WALLET_USDT || "INSERISCI_IL_TUO_INDIRIZZO_USDT_TRC20"}
                    </div>
                  </div>
                  
                  {/* BTC */}
                  <div style={{ background: '#000', border: '1px solid rgba(16,185,129,0.15)', padding: '10px', borderRadius: '6px' }}>
                    <div style={{ fontSize: '10px', color: '#f7931a', fontWeight: 'bold' }}>Bitcoin (BTC)</div>
                    <div style={{ fontSize: '11px', color: '#fff', fontFamily: 'monospace', wordBreak: 'break-all', marginTop: '4px' }}>
                      {import.meta.env.VITE_WALLET_BTC || "INSERISCI_IL_TUO_INDIRIZZO_BTC"}
                    </div>
                  </div>

                  {/* LTC */}
                  <div style={{ background: '#000', border: '1px solid rgba(16,185,129,0.15)', padding: '10px', borderRadius: '6px' }}>
                    <div style={{ fontSize: '10px', color: '#345d9d', fontWeight: 'bold' }}>Litecoin (LTC)</div>
                    <div style={{ fontSize: '11px', color: '#fff', fontFamily: 'monospace', wordBreak: 'break-all', marginTop: '4px' }}>
                      {import.meta.env.VITE_WALLET_LTC || "INSERISCI_IL_TUO_INDIRIZZO_LTC"}
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: '11px', color: '#a3a3a3', lineHeight: '1.4', background: 'rgba(16,185,129,0.05)', padding: '10px', borderLeft: '3px solid #10b981', marginBottom: '16px', borderRadius: '0 4px 4px 0' }}>
                  Una volta fatto, invia l'ID transazione (o uno screen) e il tuo <strong>User ID</strong> all'amministratore (es. via Telegram o Email) per l'abilitazione.
                </div>

                {/* Clerk User ID display */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#000', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '20px' }}>
                  <div style={{ flex: 1, fontSize: '10px', color: '#a3a3a3', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    USER ID: {userId}
                  </div>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(userId);
                      alert('ID copiato!');
                    }} 
                    style={{ background: '#10b981', color: '#000', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '10px', fontWeight: 'bold' }}
                  >
                    Copy
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={unlockPremium} style={{ flex: 1, background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)', padding: '10px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>
                    {isProcessingPayment ? 'Processing...' : 'Simulate Payment (Dev)'}
                  </button>
                  <button onClick={() => setShowPaywallModal(false)} style={{ flex: 1, background: 'transparent', color: '#737373', border: '1px solid #404040', padding: '10px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Show>
      <Show when="signed-out">
        <RedirectToSignIn />
      </Show>
    </>
  );
}

function OverviewCards({ isPremiumUnlocked, setShowPaywallModal }) {
  const { user } = useUser();
  const toolsList = TOOLS.filter(t => t.key !== 'overview');
  
  return (
    <div style={{ fontFamily: "'JetBrains Mono', monospace", color: '#fff' }}>
      {/* Promotion/Upgrade Banner */}
      {!isPremiumUnlocked && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(16, 185, 129, 0.05)',
          border: '1px solid rgba(16, 185, 129, 0.15)',
          padding: '12px 20px',
          borderRadius: '8px',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ShieldAlert size={20} style={{ color: '#10b981' }} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#fff' }}>Secure Your Digital Workspace</span>
              <span style={{ fontSize: '10px', color: '#737373', marginTop: '2px' }}>Upgrade to the Bulletproof Suite to permanently unlock all 11+ security modules.</span>
            </div>
          </div>
          <button 
            onClick={() => setShowPaywallModal(true)}
            style={{
              background: '#10b981',
              color: '#000',
              border: 'none',
              padding: '6px 14px',
              borderRadius: '4px',
              fontSize: '10px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Upgrade now
          </button>
        </div>
      )}

      {/* Welcome Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* Pixel Cloud Art */}
          <div style={{ fontSize: '28px', color: '#a3a3a3', userSelect: 'none', display: 'flex', alignItems: 'center' }}>
            ☁️
          </div>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 4px 0', color: '#fff' }}>
              Welcome back, <span style={{ color: '#10b981' }}>{user?.firstName || user?.username || 'Operator'}</span>
            </h2>
            <p style={{ fontSize: '11px', color: '#737373', margin: 0 }}>All data leaves a trace - find it.</p>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: isPremiumUnlocked ? '#10b981' : '#737373' }}>
            {isPremiumUnlocked ? 'Premium Operator' : 'Free Operator'}
          </div>
          <div style={{ fontSize: '9px', color: '#737373', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '2px' }}>License Status</div>
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {/* Card 1: Account Status */}
        <div style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '16px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#737373', fontSize: '10px', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <UserX size={12} />
            <span>Account Status</span>
          </div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#fff', marginBottom: '4px' }}>
            {isPremiumUnlocked ? 'Operator' : 'Guest'}
          </div>
          <div style={{ fontSize: '10px', color: '#737373', marginBottom: '16px' }}>
            {isPremiumUnlocked ? 'Full Suite Active' : 'Basic Suite Active'}
          </div>
          {!isPremiumUnlocked ? (
            <button onClick={() => setShowPaywallModal(true)} style={{ background: 'none', border: 'none', color: '#10b981', fontSize: '11px', cursor: 'pointer', padding: 0, textDecoration: 'underline', textAlign: 'left', width: 'fit-content' }}>
              Upgrade Suite →
            </button>
          ) : (
            <span style={{ color: '#10b981', fontSize: '11px' }}>Active Lifetime</span>
          )}
        </div>

        {/* Card 2: Environment Integrity */}
        <div style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '16px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#737373', fontSize: '10px', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <Activity size={12} />
            <span>Local Integrity</span>
          </div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#10b981', marginBottom: '4px' }}>Secure</div>
          <div style={{ fontSize: '10px', color: '#737373', marginBottom: '16px' }}>Zero-knowledge execution</div>
          <span style={{ color: '#737373', fontSize: '11px', cursor: 'default' }}>100% Client-Side</span>
        </div>

        {/* Card 3: System Health */}
        <div style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '16px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#737373', fontSize: '10px', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <Shield size={12} />
            <span>System Health</span>
          </div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#fff', marginBottom: '4px' }}>Online</div>
          <div style={{ fontSize: '10px', color: '#10b981', marginBottom: '16px' }}>All systems operational!</div>
          <span style={{ color: '#10b981', fontSize: '11px', cursor: 'default' }}>CloudSINT Status →</span>
        </div>
      </div>

      {/* Main Panels Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '20px', marginBottom: '32px' }}>
        {/* Left Panel: Recent Activity */}
        <div style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px', marginBottom: '24px' }}>
            <Clock size={14} style={{ color: '#737373' }} />
            <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#fff' }}>Recent Activity</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '140px', color: '#737373' }}>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '50%', marginBottom: '12px' }}>
              <LayoutDashboard size={24} style={{ color: '#737373' }} />
            </div>
            <span style={{ fontSize: '12px', color: '#fff', marginBottom: '4px' }}>No recent activity found.</span>
            <span style={{ fontSize: '10px', color: '#525252' }}>Start using the system to see your activity here.</span>
          </div>
        </div>

        {/* Right Panel: Account Summary */}
        <div style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px', marginBottom: '16px' }}>
            <UserX size={14} style={{ color: '#737373' }} />
            <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#fff' }}>Account Summary</span>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
            <tbody>
              {[
                { label: 'Username', val: user?.username || user?.firstName || 'Operator' },
                { label: 'Email', val: user?.primaryEmailAddress?.emailAddress || 'N/A' },
                { label: 'Client-Side', val: '100% Secure' },
                { label: 'Cryptography', val: 'WebCrypto API' },
                { label: 'Status', val: isPremiumUnlocked ? '• Operator' : '• Guest', isStatus: true }
              ].map((row, idx) => (
                <tr key={idx} style={{ borderBottom: idx === 4 ? 'none' : '1px solid rgba(255,255,255,0.03)' }}>
                  <td style={{ padding: '8px 0', color: '#737373' }}>{row.label}</td>
                  <td style={{ padding: '8px 0', textAlign: 'right', color: row.isStatus ? (isPremiumUnlocked ? '#10b981' : '#737373') : '#fff', fontWeight: row.isStatus ? 'bold' : 'normal' }}>
                    {row.val}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Access Tools Grid */}
      <div style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '20px' }}>
        <h3 style={{ fontSize: '12px', fontWeight: 'bold', color: '#fff', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          &gt; QUICK_ACCESS_TOOLSET
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
          {toolsList.map(tool => {
            const Icon = tool.icon;
            const isPremiumTool = tool.key !== 'dns-intel' && tool.key !== 'social' && tool.key !== 'burner' && tool.key !== 'shredder' && tool.key !== 'sanitizer';
            return (
              <Link 
                key={tool.key} 
                to={`/dashboard/${tool.key}`} 
                onClick={(e) => {
                  if (isPremiumTool && !isPremiumUnlocked) {
                    e.preventDefault();
                    setShowPaywallModal(true);
                  }
                }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px',
                  borderRadius: '6px', border: '1px solid rgba(255,255,255,0.03)', background: 'rgba(255,255,255,0.01)',
                  color: '#fff', textDecoration: 'none', transition: 'all 0.2s', fontSize: '11px'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(16,185,129,0.2)'; e.currentTarget.style.background = 'rgba(16,185,129,0.02)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.03)'; e.currentTarget.style.background = 'rgba(255,255,255,0.01)'; }}
              >
                <Icon size={12} style={{ color: '#10b981' }} />
                <span>{tool.label}</span>
                {isPremiumTool && !isPremiumUnlocked && <Lock size={10} style={{ marginLeft: 'auto', color: '#737373' }} />}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
