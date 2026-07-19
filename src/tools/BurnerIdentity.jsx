import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/react';

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
  identityCard: {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '16px',
    position: 'relative'
  },
  heading: {
    color: '#fff',
    marginTop: 0,
    marginBottom: '16px',
    fontSize: '20px',
    fontWeight: 600
  },
  inputConfig: {
    background: '#0a0a0a',
    border: '1px solid rgba(255,255,255,0.08)',
    color: '#fff',
    padding: '10px 14px',
    borderRadius: '8px',
    width: '100%',
    fontSize: '13px',
    fontFamily: 'inherit',
    outline: 'none',
    boxSizing: 'border-box'
  },
  button: {
    background: '#10b981',
    color: '#000',
    border: 'none',
    padding: '10px 24px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 600,
    fontFamily: 'inherit',
    fontSize: '14px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px'
  },
  buttonGhost: {
    background: 'transparent',
    color: '#fff',
    border: '1px solid rgba(255,255,255,0.2)',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 500,
    fontFamily: 'inherit',
    fontSize: '13px'
  },
  deleteBtn: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    background: 'transparent',
    border: 'none',
    color: '#ef4444',
    cursor: 'pointer',
    padding: '4px'
  },
  row: {
    display: 'flex',
    gap: '16px',
    marginBottom: '16px',
    alignItems: 'center'
  },
  fieldRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: '1px solid rgba(255,255,255,0.04)'
  },
  label: {
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: '#737373',
    width: '100px'
  },
  value: {
    color: '#fff',
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: '14px',
    flex: 1
  },
  copyBtn: {
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#10b981',
    borderRadius: '4px',
    padding: '4px 8px',
    cursor: 'pointer',
    fontSize: '12px',
    marginLeft: '12px'
  }
};

const FIRST_NAMES = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Jamie', 'Charlie', 'Drew', 'Avery', 'Parker', 'Skyler', 'Peyton', 'Quinn', 'Blake', 'Dakota', 'Reese', 'Rowan', 'Hayden', 'Emerson', 'Phoenix', 'Kendall', 'Logan', 'River', 'Sawyer', 'Sage', 'Hunter', 'Spencer', 'Elliott', 'Dylan', 'Ellis', 'Rory', 'Finley', 'Arden', 'Lennon', 'Micah', 'Jesse', 'Evan', 'Ashton', 'Cameron', 'Corey', 'Dallas', 'Devin', 'Harper', 'Justice', 'Milan', 'Monroe', 'Oakley', 'Reagan', 'Sutton'];
const LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts'];
const DOMAINS = ['proton.me', 'tutanota.com', 'guerrillamail.com', 'tempmail.com'];

const generatePassword = (length) => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=';
  const array = new Uint32Array(length);
  window.crypto.getRandomValues(array);
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars[array[i] % chars.length];
  }
  return password;
};

export default function BurnerIdentity() {
  const { userId } = useAuth();
  const [identities, setIdentities] = useState([]);
  const [pwLength, setPwLength] = useState(16);
  const storageKey = `opsec_burner_ids_${userId || 'fallback'}`;

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try { setIdentities(JSON.parse(saved)); } catch (e) {}
    } else {
      setIdentities([]);
    }
  }, [storageKey]);

  const saveToStorage = (data) => {
    setIdentities(data);
    localStorage.setItem(storageKey, JSON.stringify(data));
  };

  const generateIdentity = () => {
    const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
    const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
    const username = `${firstName.toLowerCase()}${lastName.toLowerCase()}${Math.floor(Math.random() * 9999)}`;
    const domain = DOMAINS[Math.floor(Math.random() * DOMAINS.length)];
    
    const newId = {
      id: Date.now().toString(),
      firstName,
      lastName,
      username,
      email: `${username}@${domain}`,
      password: generatePassword(pwLength),
      created: new Date().toISOString()
    };

    saveToStorage([newId, ...identities]);
  };

  const deleteIdentity = (id) => {
    saveToStorage(identities.filter(item => item.id !== id));
  };

  const clearAll = () => {
    if (window.confirm('Are you sure you want to delete all saved identities?')) {
      saveToStorage([]);
    }
  };

  const exportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(identities, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute('href', dataStr);
    dlAnchorElem.setAttribute('download', 'burner_identities.json');
    dlAnchorElem.click();
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
          <div>
            <h2 style={styles.heading}>Burner Identity Generator</h2>
            <p style={{margin: 0}}>Create temporary, unlinked identities for anonymous online activities.</p>
          </div>
          <div style={{display: 'flex', gap: '12px'}}>
            {identities.length > 0 && (
              <>
                <button style={styles.buttonGhost} onClick={exportJSON}>Export JSON</button>
                <button style={{...styles.buttonGhost, color: '#ef4444', borderColor: '#ef444440'}} onClick={clearAll}>Clear All</button>
              </>
            )}
          </div>
        </div>

        <div style={{display: 'flex', gap: '16px', alignItems: 'flex-end', background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '32px'}}>
          <div style={{flex: 1}}>
            <label style={{display: 'block', fontSize: '12px', marginBottom: '8px'}}>PASSWORD LENGTH ({pwLength})</label>
            <input 
              type="range" 
              min="12" 
              max="32" 
              value={pwLength} 
              onChange={(e) => setPwLength(parseInt(e.target.value))}
              style={{width: '100%', accentColor: '#10b981'}}
            />
          </div>
          <button style={styles.button} onClick={generateIdentity}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
            Generate Identity
          </button>
        </div>

        <div>
          {identities.length === 0 ? (
            <div style={{textAlign: 'center', padding: '48px', color: '#737373'}}>
              No burner identities generated yet.
            </div>
          ) : (
            identities.map((id) => (
              <div key={id.id} style={styles.identityCard}>
                <button style={styles.deleteBtn} onClick={() => deleteIdentity(id.id)} title="Delete">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18"></path>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
                
                <h3 style={{margin: '0 0 16px 0', color: '#10b981', fontSize: '18px'}}>{id.firstName} {id.lastName}</h3>
                
                <div style={styles.fieldRow}>
                  <div style={styles.label}>Username</div>
                  <div style={styles.value}>{id.username}</div>
                  <button style={styles.copyBtn} onClick={() => copyToClipboard(id.username)}>Copy</button>
                </div>
                
                <div style={styles.fieldRow}>
                  <div style={styles.label}>Email</div>
                  <div style={styles.value}>{id.email}</div>
                  <button style={styles.copyBtn} onClick={() => copyToClipboard(id.email)}>Copy</button>
                </div>
                
                <div style={styles.fieldRow}>
                  <div style={styles.label}>Password</div>
                  <div style={styles.value}>{id.password}</div>
                  <button style={styles.copyBtn} onClick={() => copyToClipboard(id.password)}>Copy</button>
                </div>

                <div style={{fontSize: '11px', color: '#737373', marginTop: '12px', textAlign: 'right'}}>
                  Created: {new Date(id.created).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
