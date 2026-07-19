import React, { useState } from 'react';
import { FileText, Copy, Check, EyeOff } from 'lucide-react';

export default function LogSanitizer() {
  const [inputLog, setInputLog] = useState('');
  const [outputLog, setOutputLog] = useState('');
  const [customWord, setCustomWord] = useState('');
  const [customWordsList, setCustomWordsList] = useState([]);
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState({ ips: 0, emails: 0, domains: 0, cards: 0, custom: 0 });

  const [options, setOptions] = useState({
    ips: true,
    emails: true,
    domains: false,
    cards: true,
  });

  const handleToggleOption = (key) => {
    setOptions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const addCustomWord = () => {
    if (customWord.trim() && !customWordsList.includes(customWord.trim())) {
      setCustomWordsList([...customWordsList, customWord.trim()]);
      setCustomWord('');
    }
  };

  const removeCustomWord = (word) => {
    setCustomWordsList(customWordsList.filter(w => w !== word));
  };

  const sanitizeLog = () => {
    let cleanText = inputLog;
    let detectedStats = { ips: 0, emails: 0, domains: 0, cards: 0, custom: 0 };

    // IP address regex (IPv4)
    if (options.ips) {
      const ipRegex = /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/g;
      const foundIps = cleanText.match(ipRegex) || [];
      detectedStats.ips = foundIps.length;
      cleanText = cleanText.replace(ipRegex, '[REDACTED_IP]');
    }

    // Email regex
    if (options.emails) {
      const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
      const foundEmails = cleanText.match(emailRegex) || [];
      detectedStats.emails = foundEmails.length;
      cleanText = cleanText.replace(emailRegex, '[REDACTED_EMAIL]');
    }

    // Domain regex (simple)
    if (options.domains) {
      const domainRegex = /\b(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,30}[a-z0-9]\b/gi;
      const foundDomains = cleanText.match(domainRegex) || [];
      detectedStats.domains = foundDomains.length;
      cleanText = cleanText.replace(domainRegex, '[REDACTED_DOMAIN]');
    }

    // Credit Card regex (13 to 19 digits)
    if (options.cards) {
      const ccRegex = /\b(?:\d{4}[ -]?){3}\d{4}|\b\d{13,16}\b/g;
      const foundCards = cleanText.match(ccRegex) || [];
      detectedStats.cards = foundCards.length;
      cleanText = cleanText.replace(ccRegex, '[REDACTED_CARD]');
    }

    // Custom words
    if (customWordsList.length > 0) {
      customWordsList.forEach(word => {
        // Escape special chars
        const escaped = word.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const regex = new RegExp(`\\b${escaped}\\b`, 'gi');
        const found = cleanText.match(regex) || [];
        detectedStats.custom += found.length;
        cleanText = cleanText.replace(regex, '[REDACTED_SENSITIVE]');
      });
    }

    setOutputLog(cleanText);
    setStats(detectedStats);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputLog);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ maxWidth: '800px', color: '#fff', fontFamily: "'JetBrains Mono', monospace" }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <EyeOff size={24} style={{ color: '#10b981' }} />
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>Log Sanitizer</h2>
      </div>

      <p style={{ fontSize: '13px', color: '#a3a3a3', lineHeight: '1.6', marginBottom: '24px' }}>
        Remove sensitive identifiers like IP addresses, emails, credit cards, and custom keys from logs, tracebacks, or text files before sharing. Sanitization is done completely in-browser.
      </p>

      {/* Rules Config */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        <div style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px' }}>
          <h3 style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '12px', color: '#10b981' }}>Sanitizer Rules</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', cursor: 'pointer' }}>
              <input type="checkbox" checked={options.ips} onChange={() => handleToggleOption('ips')} style={{ accentColor: '#10b981' }} />
              Redact IPv4 Addresses
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', cursor: 'pointer' }}>
              <input type="checkbox" checked={options.emails} onChange={() => handleToggleOption('emails')} style={{ accentColor: '#10b981' }} />
              Redact Email Addresses
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', cursor: 'pointer' }}>
              <input type="checkbox" checked={options.domains} onChange={() => handleToggleOption('domains')} style={{ accentColor: '#10b981' }} />
              Redact Domain Names (URLs)
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', cursor: 'pointer' }}>
              <input type="checkbox" checked={options.cards} onChange={() => handleToggleOption('cards')} style={{ accentColor: '#10b981' }} />
              Redact Credit Card Numbers
            </label>
          </div>
        </div>

        <div style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px' }}>
          <h3 style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '12px', color: '#10b981' }}>Custom Keywords</h3>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <input 
              type="text" 
              value={customWord} 
              onChange={(e) => setCustomWord(e.target.value)} 
              placeholder="e.g. secretKey, username"
              style={{ background: '#030303', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', flex: 1, outline: 'none' }}
              onKeyDown={(e) => e.key === 'Enter' && addCustomWord()}
            />
            <button onClick={addCustomWord} style={{ background: '#10b981', color: '#000', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }}>Add</button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', maxHeight: '70px', overflowY: 'auto' }}>
            {customWordsList.map((word, i) => (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', padding: '2px 8px', borderRadius: '4px', fontSize: '11px' }}>
                {word}
                <button onClick={() => removeCustomWord(word)} style={{ color: '#ef4444', border: 'none', cursor: 'pointer', background: 'none' }}>×</button>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main Panels */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        <div>
          <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Input Log</h3>
          <textarea 
            value={inputLog}
            onChange={(e) => setInputLog(e.target.value)}
            placeholder="Paste your raw logs here..."
            style={{ 
              background: '#0a0a0a', 
              border: '1px solid rgba(255,255,255,0.05)', 
              color: '#fff', 
              padding: '12px', 
              borderRadius: '8px', 
              width: '100%', 
              height: '240px', 
              fontSize: '11px', 
              fontFamily: 'inherit', 
              outline: 'none', 
              resize: 'none',
              marginBottom: '12px'
            }}
          />
          <button 
            onClick={sanitizeLog}
            style={{ width: '100%', background: '#10b981', color: '#000', border: 'none', padding: '10px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}
          >
            Sanitize Log Dump
          </button>
        </div>

        <div>
          <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Sanitized Output</h3>
          <textarea 
            value={outputLog}
            readOnly
            placeholder="Cleaned logs will appear here..."
            style={{ 
              background: '#0a0a0a', 
              border: '1px solid rgba(255,255,255,0.05)', 
              color: '#a3a3a3', 
              padding: '12px', 
              borderRadius: '8px', 
              width: '100%', 
              height: '240px', 
              fontSize: '11px', 
              fontFamily: 'inherit', 
              outline: 'none', 
              resize: 'none',
              marginBottom: '12px'
            }}
          />
          <button 
            onClick={copyToClipboard}
            disabled={!outputLog}
            style={{ 
              width: '100%', 
              background: outputLog ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.01)', 
              color: outputLog ? '#fff' : '#525252', 
              border: '1px solid rgba(255,255,255,0.08)', 
              padding: '10px', 
              borderRadius: '6px', 
              cursor: outputLog ? 'pointer' : 'default', 
              fontWeight: 'bold', 
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {copied ? <Check size={14} style={{ color: '#10b981' }} /> : <Copy size={14} />}
            {copied ? 'Copied!' : 'Copy Clean Log'}
          </button>
        </div>
      </div>

      {/* Stats */}
      {outputLog && (
        <div style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px' }}>
          <h3 style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '12px', color: '#10b981' }}>Sanitization Statistics</h3>
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            <div>
              <span style={{ color: '#737373', fontSize: '11px' }}>IPs Blocked:</span>
              <span style={{ color: '#fff', fontSize: '13px', fontWeight: 'bold', marginLeft: '6px' }}>{stats.ips}</span>
            </div>
            <div>
              <span style={{ color: '#737373', fontSize: '11px' }}>Emails Blocked:</span>
              <span style={{ color: '#fff', fontSize: '13px', fontWeight: 'bold', marginLeft: '6px' }}>{stats.emails}</span>
            </div>
            <div>
              <span style={{ color: '#737373', fontSize: '11px' }}>Domains Blocked:</span>
              <span style={{ color: '#fff', fontSize: '13px', fontWeight: 'bold', marginLeft: '6px' }}>{stats.domains}</span>
            </div>
            <div>
              <span style={{ color: '#737373', fontSize: '11px' }}>Cards Blocked:</span>
              <span style={{ color: '#fff', fontSize: '13px', fontWeight: 'bold', marginLeft: '6px' }}>{stats.cards}</span>
            </div>
            <div>
              <span style={{ color: '#737373', fontSize: '11px' }}>Keywords Blocked:</span>
              <span style={{ color: '#fff', fontSize: '13px', fontWeight: 'bold', marginLeft: '6px' }}>{stats.custom}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
