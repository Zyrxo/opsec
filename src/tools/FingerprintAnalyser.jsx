import React, { useState, useEffect, useRef } from 'react';
import { AlertTriangle, Copy, ChevronDown, ChevronUp } from 'lucide-react';

const styles = {
  container: {
    background: '#030303',
    minHeight: '100%',
    padding: '24px',
    color: '#a3a3a3',
    fontFamily: 'Inter, sans-serif'
  },
  card: {
    background: 'linear-gradient(to bottom, #0a0a0a, #040404)',
    border: '1px solid rgba(255,255,255,0.04)',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '24px'
  },
  heading: {
    color: '#fff',
    marginTop: 0,
    marginBottom: '16px',
    fontSize: '20px',
    fontWeight: 600
  },
  subHeading: {
    color: '#fff',
    marginTop: '24px',
    marginBottom: '12px',
    fontSize: '16px',
    fontWeight: 500,
    borderBottom: '1px solid rgba(255,255,255,0.04)',
    paddingBottom: '8px'
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 0',
    borderBottom: '1px solid rgba(255,255,255,0.02)',
    alignItems: 'center'
  },
  label: {
    fontSize: '14px'
  },
  value: {
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: '13px',
    color: '#10b981',
    maxWidth: '50%',
    wordBreak: 'break-all',
    textAlign: 'right'
  },
  button: {
    background: '#10b981',
    color: '#000',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 600,
    fontFamily: 'inherit',
    fontSize: '14px',
    transition: 'opacity 0.2s'
  },
  progressBarContainer: {
    width: '100%',
    height: '8px',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '4px',
    overflow: 'hidden',
    marginTop: '20px'
  },
  progressBarFill: {
    height: '100%',
    background: '#10b981',
    transition: 'width 0.1s linear'
  },
  scoreCircle: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    border: '4px solid #10b981',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '32px',
    fontWeight: 700,
    color: '#fff',
    margin: '0 auto 24px'
  },
  dot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    display: 'inline-block',
    marginRight: '8px'
  }
};

const hashString = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
};

export default function FingerprintAnalyser() {
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState(null);
  const [recommendationsExpanded, setRecommendationsExpanded] = useState(false);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const runScan = async () => {
    setScanning(true);
    setProgress(0);
    setResults(null);
    
    // Simulate scan progress
    for (let i = 0; i <= 100; i += 5) {
      setProgress(i);
      await new Promise(r => setTimeout(r, 150));
    }

    const data = {};
    let exposedCount = 0;
    
    // 1. Canvas
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      ctx.textBaseline = 'top';
      ctx.font = '14px "Arial"';
      ctx.textBaseline = 'alphabetic';
      ctx.fillStyle = '#f60';
      ctx.fillRect(125, 1, 62, 20);
      ctx.fillStyle = '#069';
      ctx.fillText('Browser Fingerprint', 2, 15);
      ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
      ctx.fillText('Browser Fingerprint', 4, 17);
      const canvasData = canvas.toDataURL();
      data.canvasHash = hashString(canvasData);
      exposedCount++;
    } catch (e) {
      data.canvasHash = 'Blocked/Error';
    }

    // 2. WebGL
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      data.webglVendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
      data.webglRenderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
      exposedCount += 2;
    } catch (e) {
      data.webglVendor = 'Blocked/Error';
      data.webglRenderer = 'Blocked/Error';
    }

    // 3. AudioContext
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const actx = new AudioContext();
      data.audioSampleRate = actx.sampleRate;
      exposedCount++;
    } catch (e) {
      data.audioSampleRate = 'Blocked/Error';
    }

    // 4. Navigator
    data.userAgent = navigator.userAgent;
    data.platform = navigator.platform;
    data.language = navigator.language;
    data.languages = navigator.languages ? navigator.languages.join(', ') : 'N/A';
    data.hardwareConcurrency = navigator.hardwareConcurrency || 'Unknown';
    data.deviceMemory = navigator.deviceMemory || 'Unknown';
    data.cookieEnabled = navigator.cookieEnabled;
    data.doNotTrack = navigator.doNotTrack || 'Not set';
    exposedCount += 8;

    // 5. Screen
    data.screenWidth = window.screen.width;
    data.screenHeight = window.screen.height;
    data.colorDepth = window.screen.colorDepth;
    data.pixelRatio = window.devicePixelRatio;
    exposedCount += 4;

    // 6. Timezone
    try {
      data.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      data.tzOffset = new Date().getTimezoneOffset();
      exposedCount += 2;
    } catch (e) {
      data.timezone = 'Unknown';
      data.tzOffset = 'Unknown';
    }

    // 7. Storage
    try {
      localStorage.setItem('fs', '1');
      localStorage.removeItem('fs');
      data.localStorage = true;
    } catch (e) { data.localStorage = false; }
    
    try {
      sessionStorage.setItem('fs', '1');
      sessionStorage.removeItem('fs');
      data.sessionStorage = true;
    } catch (e) { data.sessionStorage = false; }
    
    data.indexedDB = !!window.indexedDB;
    exposedCount += 3;

    // 8. Plugins
    data.pluginsCount = navigator.plugins ? navigator.plugins.length : 0;
    exposedCount++;

    const maxScore = 22;
    const uniquenessScore = Math.max(0, Math.round(((maxScore - exposedCount) / maxScore) * 100));
    data.score = uniquenessScore;

    setResults(data);
    setScanning(false);
  };

  const getRecommendations = () => {
    if (!results) return [];
    const recs = [];
    if (results.canvasHash !== 'Blocked/Error') {
      recs.push("Canvas uniqueness detected. Recommend using Brave browser or installing 'Canvas Block' / 'Canvas Defender' extension.");
    }
    if (results.webglVendor !== 'Blocked/Error') {
      recs.push("WebGL vendor/renderer exposed. Recommend blocking WebGL or spoofing it.");
    }
    if (results.doNotTrack !== '1' && results.doNotTrack !== 'yes' && results.doNotTrack !== true) {
      recs.push("Do Not Track is disabled or not set. Turn on 'Do Not Track' / 'Global Privacy Control' in your browser settings.");
    }
    if (results.cookieEnabled || results.localStorage || results.sessionStorage) {
      recs.push("Storage/Cookies enabled. Advise using a cookie autodelete extension or blocking third-party tracking cookies.");
    }
    if (results.timezone !== 'Unknown') {
      recs.push("Timezone exposed. Advise using a VPN matching your timezone or setting your system clock to UTC.");
    }
    if (results.audioSampleRate !== 'Blocked/Error') {
      recs.push("AudioContext exposed. Suggest extensions to randomize audio API inputs.");
    }
    return recs;
  };

  const getRisk = (val) => {
    if (val === 'Blocked/Error' || val === 'Unknown' || val === 'Not set' || val === false) {
      return { level: 'Safe', color: '#10b981' };
    }
    return { level: 'Exposed', color: '#ef4444' };
  };

  const renderRow = (label, value) => {
    const risk = getRisk(value);
    return (
      <div style={styles.row}>
        <div style={styles.label}>
          <span style={{...styles.dot, background: risk.color}}></span>
          {label}
        </div>
        <div style={styles.value}>{String(value)}</div>
      </div>
    );
  };

  const recommendations = getRecommendations();

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Browser Fingerprint Analyser</h2>
        <p>Run a comprehensive scan of your browser's exposed attributes that can be used to track you across the web.</p>
        
        {!scanning && !results && (
          <button style={styles.button} onClick={runScan}>Run Full Scan</button>
        )}

        {scanning && (
          <div>
            <p style={{textAlign: 'center', marginTop: '20px'}}>Analyzing browser fingerprint...</p>
            <div style={styles.progressBarContainer}>
              <div style={{...styles.progressBarFill, width: `${progress}%`}}></div>
            </div>
          </div>
        )}
      </div>

      {results && (
        <div>
          <div style={styles.card}>
            <h2 style={{...styles.heading, textAlign: 'center'}}>Overall OPSEC Score</h2>
            <div style={styles.scoreCircle}>
              {results.score}
            </div>
            <p style={{textAlign: 'center', fontSize: '14px'}}>
              Score based on resilience against fingerprinting (0 = Highly Trackable, 100 = Anonymous)
            </p>
          </div>

          {recommendations.length > 0 && (
            <div style={{ ...styles.card, borderColor: '#ef4444' }}>
              <div 
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                onClick={() => setRecommendationsExpanded(!recommendationsExpanded)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ef4444' }}>
                  <AlertTriangle size={24} />
                  <h2 style={{ ...styles.heading, margin: 0 }}>OPSEC Hardening Recommendations ({recommendations.length})</h2>
                </div>
                <div style={{ color: '#ef4444' }}>
                  {recommendationsExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                </div>
              </div>
              
              {recommendationsExpanded && (
                <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {recommendations.map((rec, i) => (
                    <div key={i} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', padding: '16px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#fca5a5', fontSize: '14px', lineHeight: '1.5', flex: 1, paddingRight: '16px' }}>{rec}</span>
                      <button 
                        onClick={(e) => { e.stopPropagation(); copyToClipboard(rec); }}
                        style={{ background: 'transparent', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', borderRadius: '4px', padding: '6px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', transition: 'all 0.2s' }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.2)' }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                      >
                        <Copy size={14} /> Copy
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div style={styles.card}>
            <h3 style={styles.subHeading}>Hardware & Graphics</h3>
            {renderRow('Canvas Hash', results.canvasHash)}
            {renderRow('WebGL Vendor', results.webglVendor)}
            {renderRow('WebGL Renderer', results.webglRenderer)}
            {renderRow('Audio Context Sample Rate', results.audioSampleRate)}
            {renderRow('CPU Cores (Concurrency)', results.hardwareConcurrency)}
            {renderRow('Device Memory (GB)', results.deviceMemory)}

            <h3 style={styles.subHeading}>Browser & OS Environment</h3>
            {renderRow('User Agent', results.userAgent)}
            {renderRow('Platform', results.platform)}
            {renderRow('Primary Language', results.language)}
            {renderRow('All Languages', results.languages)}
            {renderRow('Installed Plugins Count', results.pluginsCount)}
            
            <h3 style={styles.subHeading}>Screen & Display</h3>
            {renderRow('Screen Width', results.screenWidth)}
            {renderRow('Screen Height', results.screenHeight)}
            {renderRow('Color Depth', results.colorDepth)}
            {renderRow('Pixel Ratio', results.pixelRatio)}

            <h3 style={styles.subHeading}>Location & Time</h3>
            {renderRow('Timezone', results.timezone)}
            {renderRow('Timezone Offset', results.tzOffset)}

            <h3 style={styles.subHeading}>Storage & Privacy Settings</h3>
            {renderRow('Cookies Enabled', results.cookieEnabled)}
            {renderRow('Do Not Track (DNT)', results.doNotTrack)}
            {renderRow('Local Storage Enabled', results.localStorage)}
            {renderRow('Session Storage Enabled', results.sessionStorage)}
            {renderRow('IndexedDB Enabled', results.indexedDB)}
          </div>
          
          <div style={{textAlign: 'center'}}>
            <button style={{...styles.button, background: 'rgba(255,255,255,0.1)', color: '#fff'}} onClick={runScan}>
              Scan Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
