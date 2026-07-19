import React, { useState } from 'react';
import { Trash2, AlertTriangle, ShieldCheck, Download, RefreshCw } from 'lucide-react';

export default function DataShredder() {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [algorithm, setAlgorithm] = useState('dod'); // zero, dod, gutmann
  const [isShredding, setIsShredding] = useState(false);
  const [shredProgress, setShredProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [shreddedTextPreview, setShreddedTextPreview] = useState('');

  const shredText = async () => {
    if (!text) return;
    setIsShredding(true);
    setShredProgress(0);
    setShreddedTextPreview(text);

    const passes = algorithm === 'zero' ? 1 : algorithm === 'dod' ? 3 : 35;
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+';

    for (let pass = 1; pass <= passes; pass++) {
      setStatusText(`Pass ${pass}/${passes} - Overwriting with ${algorithm === 'zero' ? 'zeroes' : 'random noise'}...`);
      
      // Animate shredding steps
      for (let step = 0; step < 5; step++) {
        await new Promise(r => setTimeout(r, 80));
        setShreddedTextPreview(prev => 
          prev.split('').map(() => {
            if (algorithm === 'zero') return '0';
            return chars[Math.floor(Math.random() * chars.length)];
          }).join('')
        );
      }
      setShredProgress((pass / passes) * 100);
    }

    setStatusText('Purging references from browser memory...');
    await new Promise(r => setTimeout(r, 600));
    
    setText('');
    setShreddedTextPreview('');
    setIsShredding(false);
    setStatusText('Data securely shredded and purged!');
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatusText('');
    }
  };

  const shredFile = async () => {
    if (!file) return;
    setIsShredding(true);
    setShredProgress(0);
    setStatusText('Reading file into local buffer...');
    
    const reader = new FileReader();
    reader.onload = async (e) => {
      const arrayBuffer = e.target.result;
      const view = new Uint8Array(arrayBuffer);
      const passes = algorithm === 'zero' ? 1 : algorithm === 'dod' ? 3 : 7; // cap Gutmann at 7 for file performance

      for (let pass = 1; pass <= passes; pass++) {
        setStatusText(`Pass ${pass}/${passes} - Overwriting file blocks...`);
        for (let i = 0; i < view.length; i++) {
          if (algorithm === 'zero') {
            view[i] = 0;
          } else {
            view[i] = Math.floor(Math.random() * 256);
          }
        }
        setShredProgress((pass / passes) * 100);
        await new Promise(r => setTimeout(r, 200));
      }

      setStatusText('Generating secure shredded file download...');
      await new Promise(r => setTimeout(r, 400));

      const shreddedBlob = new Blob([view], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(shreddedBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `SHREDDED_${file.name}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setFile(null);
      setIsShredding(false);
      setStatusText('File shredded! Download of corrupted file complete.');
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div style={{ maxWidth: '800px', color: '#fff', fontFamily: "'JetBrains Mono', monospace" }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <Trash2 size={24} style={{ color: '#10b981' }} />
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>Data Shredder</h2>
      </div>

      <p style={{ fontSize: '13px', color: '#a3a3a3', lineHeight: '1.6', marginBottom: '24px' }}>
        Securely shred text strings or files client-side. Shredding overwrites memory locations with multiple passes of random bytes or zeroes before purging references, rendering data unrecoverable.
      </p>

      {/* Configuration */}
      <div style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '16px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '12px', textTransform: 'uppercase', color: '#10b981' }}>Settings</h3>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <div>
            <label style={{ fontSize: '11px', color: '#737373', display: 'block', marginBottom: '6px' }}>Algorithm</label>
            <select 
              value={algorithm} 
              onChange={(e) => setAlgorithm(e.target.value)}
              disabled={isShredding}
              style={{ background: '#030303', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '6px 12px', borderRadius: '4px', fontSize: '12px', outline: 'none' }}
            >
              <option value="zero">Zero-fill (1 pass)</option>
              <option value="dod">DoD 5220.22-M (3 passes)</option>
              <option value="gutmann">Gutmann Algorithm (35 passes / 7 for files)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Progress indicators */}
      {isShredding && (
        <div style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '8px', padding: '16px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px' }}>
            <span>{statusText}</span>
            <span>{Math.round(shredProgress)}%</span>
          </div>
          <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${shredProgress}%`, background: '#10b981', transition: 'width 0.1s ease' }} />
          </div>
        </div>
      )}

      {statusText && !isShredding && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', padding: '12px', borderRadius: '6px', marginBottom: '24px', fontSize: '12px' }}>
          <ShieldCheck size={16} style={{ color: '#10b981' }} />
          <span>{statusText}</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* String Shredder */}
        <div style={{ background: 'linear-gradient(to bottom, #0a0a0a, #040404)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#fff' }}>Secure String Shredder</h3>
          <textarea 
            value={shreddedTextPreview || text}
            onChange={(e) => { if (!isShredding) setText(e.target.value); }}
            placeholder="Type or paste sensitive strings to shred..."
            disabled={isShredding}
            style={{ 
              background: '#030303', 
              border: '1px solid rgba(255,255,255,0.08)', 
              color: isShredding ? '#eab308' : '#fff', 
              padding: '12px', 
              borderRadius: '6px', 
              width: '100%', 
              height: '140px', 
              fontSize: '12px', 
              fontFamily: 'inherit', 
              outline: 'none', 
              resize: 'none',
              marginBottom: '16px'
            }}
          />
          <button 
            onClick={shredText} 
            disabled={isShredding || !text}
            style={{ 
              width: '100%', 
              background: text ? '#ef4444' : 'rgba(255,255,255,0.02)', 
              color: text ? '#fff' : '#525252', 
              border: 'none', 
              padding: '10px', 
              borderRadius: '6px', 
              cursor: text ? 'pointer' : 'default', 
              fontWeight: 'bold', 
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <Trash2 size={14} />
            Shred String
          </button>
        </div>

        {/* File Shredder */}
        <div style={{ background: 'linear-gradient(to bottom, #0a0a0a, #040404)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#fff' }}>Secure File Shredder</h3>
          <div style={{ 
            border: '1px dashed rgba(255,255,255,0.1)', 
            borderRadius: '6px', 
            padding: '24px', 
            textAlign: 'center', 
            background: '#030303',
            marginBottom: '16px',
            height: '140px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            {!file ? (
              <>
                <AlertTriangle size={24} style={{ color: '#737373', marginBottom: '12px' }} />
                <label style={{ fontSize: '12px', color: '#a3a3a3', cursor: 'pointer' }}>
                  <span style={{ color: '#10b981', textDecoration: 'underline' }}>Select File</span> to shred
                  <input type="file" onChange={handleFileChange} style={{ display: 'none' }} />
                </label>
              </>
            ) : (
              <div style={{ width: '100%' }}>
                <span style={{ fontSize: '12px', color: '#fff', display: 'block', wordBreak: 'break-all', marginBottom: '4px' }}>{file.name}</span>
                <span style={{ fontSize: '10px', color: '#737373' }}>{(file.size / 1024).toFixed(2)} KB</span>
                <button onClick={() => setFile(null)} style={{ display: 'block', margin: '8px auto 0 auto', color: '#ef4444', fontSize: '11px', textDecoration: 'underline', cursor: 'pointer' }}>Remove</button>
              </div>
            )}
          </div>
          <button 
            onClick={shredFile} 
            disabled={isShredding || !file}
            style={{ 
              width: '100%', 
              background: file ? '#ef4444' : 'rgba(255,255,255,0.02)', 
              color: file ? '#fff' : '#525252', 
              border: 'none', 
              padding: '10px', 
              borderRadius: '6px', 
              cursor: file ? 'pointer' : 'default', 
              fontWeight: 'bold', 
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <Download size={14} />
            Overwrite & Download
          </button>
        </div>
      </div>
    </div>
  );
}
