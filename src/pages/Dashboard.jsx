import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Show, RedirectToSignIn, UserButton, useAuth, useUser } from '@clerk/react';
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

  const handleRealPayment = async () => {
    setIsProcessingPayment(true);
    try {
      const response = await fetch('/api/create-cryptomus-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
      });
      const data = await response.json();
      if (data.url) {
        window.open(data.url, '_blank');
      } else {
        alert('Errore nella creazione del pagamento: ' + (data.error || 'Errore sconosciuto'));
      }
    } catch (err) {
      console.error(err);
      alert('Errore di rete durante la connessione a Cryptomus.');
    } finally {
      setIsProcessingPayment(false);
    }
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
    const isPremiumTool = currentToolKey !== 'overview' && currentToolKey !== 'dns-intel';
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
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#030303', color: '#fff', fontFamily: 'Inter, system-ui, sans-serif' }}>
          
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0 10px', marginBottom: '32px' }}>
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

            <div style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '10px',
              color: '#737373',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginTop: '12px',
              marginBottom: '12px',
              paddingLeft: '14px'
            }}>
              STANDARD SUITE (FREE)
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {TOOLS.filter(t => t.key === 'overview' || t.key === 'dns-intel').map((item) => {
                const isActive = currentToolKey === item.key;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.key}
                    to={item.key === 'overview' ? '/dashboard' : `/dashboard/${item.key}`}
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

            <div style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '10px',
              color: '#737373',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginTop: '24px',
              marginBottom: '12px',
              paddingLeft: '14px'
            }}>
              BULLETPROOF SUITE (PREMIUM)
            </div>

            <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px', overflowY: 'auto' }}>
              {TOOLS.filter(t => t.key !== 'overview' && t.key !== 'dns-intel').map((item) => {
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
            boxSizing: 'border-box'
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
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <UserButton afterSignOutUrl="/" />
              </div>
            </header>

            {renderToolComponent()}
          </main>

          {/* Paywall Modal */}
          {showPaywallModal && (
            <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ background: '#0a0a0a', border: '1px solid #10b981', borderRadius: '12px', padding: '30px', width: '90%', maxWidth: '400px', fontFamily: '"JetBrains Mono", monospace' }}>
                <h3 style={{ color: '#10b981', marginTop: 0 }}>&gt; ROOT_ACCESS_REQUIRED</h3>
                <p style={{ color: '#a3a3a3', fontSize: '14px' }}>Bulletproof Suite Lifetime License: 0.005 BTC / €15</p>
                <div style={{ margin: '20px 0', padding: '15px', background: '#000', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981', fontSize: '12px', minHeight: '80px' }}>
                  {isProcessingPayment ? (
                    <>
                      <div>&gt; Establishing secure channel...</div>
                      <div>&gt; Verifying transaction hash...</div>
                      <div>&gt; Decrypting license keys...</div>
                      <div style={{animation: 'blink 1s step-end infinite'}}>_</div>
                    </>
                  ) : (
                    <div>&gt; Awaiting payment confirmation...<br />Dopo aver completato il pagamento, ricarica la pagina per attivare le modifiche.</div>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button disabled={isProcessingPayment} onClick={handleRealPayment} style={{ background: '#10b981', color: '#000', border: 'none', padding: '10px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', opacity: isProcessingPayment ? 0.6 : 1 }}>
                    {isProcessingPayment ? 'Initializing checkout...' : 'Pay with Card / Crypto'}
                  </button>
                  <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                    <button disabled={isProcessingPayment} onClick={unlockPremium} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '8px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px' }}>
                      {isProcessingPayment ? 'Processing...' : 'Simulate Payment (Dev)'}
                    </button>
                    <button disabled={isProcessingPayment} onClick={() => setShowPaywallModal(false)} style={{ flex: 1, background: 'transparent', color: '#a3a3a3', border: '1px solid #737373', padding: '8px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px' }}>
                      Abort
                    </button>
                  </div>
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

function OverviewCards() {
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
          return (
            <Link key={tool.key} to={`/dashboard/${tool.key}`} style={{ textDecoration: 'none' }}>
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
                  flexDirection: 'column'
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
                <div style={{ color: '#10b981', marginBottom: '16px' }}>
                  <Icon size={28} />
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
