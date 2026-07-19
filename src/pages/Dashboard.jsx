import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Show, RedirectToSignIn, useAuth, useUser, SignOutButton } from '@clerk/react';
import { 
  LayoutDashboard, Fingerprint, FileX2, Shield, UserX, 
  FileText, HardDrive, Trash2, Search, Menu, X, ArrowLeft, Lock 
} from 'lucide-react';

import FingerprintAnalyser from '../tools/FingerprintAnalyser';
import MetadataStripper from '../tools/MetadataStripper';
import ThreatModeling from '../tools/ThreatModeling';
import BurnerIdentity from '../tools/BurnerIdentity';
import DataBrokerRemoval from '../tools/DataBrokerRemoval';
import HardeningGuide from '../tools/HardeningGuide';
import SocialSanitizer from '../tools/SocialSanitizer';
import DnsIntel from '../tools/DnsIntel';

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
    const isPremiumTool = currentToolKey !== 'overview' && currentToolKey !== 'dns-intel' && currentToolKey !== 'social' && currentToolKey !== 'burner';
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
      default: return <OverviewCards />;
    }
  };

  return (
    <>
      <style>{`@keyframes blink { 0% { opacity: 1; } 50% { opacity: 0; } 100% { opacity: 1; } }`}</style>
      <Show when="signed-in">
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#030303', color: '#fff', fontFamily: 'Inter, system-ui, sans-serif', position: 'relative', overflow: 'hidden' }}>
          
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
              {TOOLS.filter(t => ['fingerprint', 'metadata', 'threat-model', 'data-broker', 'hardening'].includes(t.key)).map((item) => {
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
              {TOOLS.filter(t => ['burner', 'social', 'dns-intel'].includes(t.key)).map((item) => {
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

            {renderToolComponent()}
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
  const toolsList = TOOLS.filter(t => t.key !== 'overview');
  
  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '8px', marginTop: 0 }}>Welcome to your OPSEC Dashboard</h2>
        <p style={{ color: '#a3a3a3', fontSize: '14px', margin: 0 }}>Select a tool to get started</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '20px'
      }}>
        {toolsList.map(tool => {
          const Icon = tool.icon;
          const isPremiumTool = tool.key !== 'dns-intel' && tool.key !== 'social' && tool.key !== 'burner';
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
              style={{ textDecoration: 'none' }}
            >
              <div
                style={{
                  background: 'linear-gradient(to bottom, #0a0a0a, #040404)',
                  border: '1px solid rgba(255,255,255,0.04)',
                  borderRadius: '12px',
                  padding: '24px',
                  transition: 'all 0.3s ease',
                  height: '100%',
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(16,185,129,0.2)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.04)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ color: '#10b981' }}>
                    <Icon size={28} />
                  </div>
                  {isPremiumTool && !isPremiumUnlocked && (
                    <div style={{ color: '#737373', display: 'flex', alignItems: 'center' }}>
                      <Lock size={16} />
                    </div>
                  )}
                </div>
                <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#fff', margin: '0 0 8px 0' }}>
                  {tool.label}
                </h3>
                <p style={{ fontSize: '12px', color: '#a3a3a3', margin: 0, lineHeight: '1.5' }}>
                  {tool.desc}
                </p>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  );
}
