import React, { useState } from 'react';

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
  progressBar: {
    display: 'flex',
    marginBottom: '32px',
    gap: '8px'
  },
  progressStep: (active, completed) => ({
    flex: 1,
    height: '4px',
    background: active ? '#10b981' : completed ? 'rgba(16, 185, 129, 0.4)' : 'rgba(255,255,255,0.1)',
    borderRadius: '2px',
    transition: 'all 0.3s'
  }),
  optionLabel: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '8px',
    marginBottom: '12px',
    cursor: 'pointer',
    background: 'rgba(0,0,0,0.2)',
    transition: 'all 0.2s',
    color: '#fff'
  },
  optionLabelSelected: {
    borderColor: '#10b981',
    background: 'rgba(16, 185, 129, 0.05)'
  },
  radioCheck: {
    marginRight: '12px',
    accentColor: '#10b981'
  },
  navRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '32px',
    paddingTop: '24px',
    borderTop: '1px solid rgba(255,255,255,0.04)'
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
    fontSize: '14px'
  },
  buttonGhost: {
    background: 'transparent',
    color: '#fff',
    border: '1px solid rgba(255,255,255,0.2)',
    padding: '10px 24px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 600,
    fontFamily: 'inherit',
    fontSize: '14px'
  },
  threatBadge: (level) => {
    let color = '#10b981';
    if (level === 'Medium') color = '#f59e0b';
    if (level === 'High') color = '#ef4444';
    if (level === 'Critical') color = '#991b1b';
    return {
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: '16px',
      background: `${color}20`,
      color: color,
      fontWeight: 600,
      fontSize: '14px',
      border: `1px solid ${color}40`
    };
  },
  recCategory: {
    color: '#fff',
    fontSize: '18px',
    marginTop: '24px',
    marginBottom: '12px',
    paddingBottom: '8px',
    borderBottom: '1px solid rgba(255,255,255,0.04)'
  },
  ul: {
    paddingLeft: '20px',
    margin: 0,
    color: '#a3a3a3'
  },
  li: {
    marginBottom: '8px',
    lineHeight: '1.5'
  }
};

export default function ThreatModeling() {
  const [step, setStep] = useState(1);
  const totalSteps = 5;

  const [identity, setIdentity] = useState('');
  const [concerns, setConcerns] = useState([]);
  const [adversary, setAdversary] = useState('');
  const [devices, setDevices] = useState([]);

  const toggleArrayItem = (array, setArray, item) => {
    if (array.includes(item)) {
      setArray(array.filter(i => i !== item));
    } else {
      setArray([...array, item]);
    }
  };

  const canProceed = () => {
    if (step === 1) return identity !== '';
    if (step === 2) return concerns.length > 0;
    if (step === 3) return adversary !== '';
    if (step === 4) return devices.length > 0;
    return true;
  };

  const nextStep = () => {
    if (canProceed() && step < totalSteps) setStep(step + 1);
  };
  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const generateReport = () => {
    let threatLevel = 'Low';
    let score = 0;

    if (adversary === 'Script Kiddie') score += 1;
    if (adversary === 'Organized Crime' || adversary === 'Insider Threat') score += 3;
    if (adversary === 'Corporation') score += 2;
    if (adversary === 'Nation State') score += 5;

    if (identity === 'Journalist' || identity === 'Activist') score += 3;
    if (identity === 'Developer') score += 2;

    score += concerns.length * 0.5;

    if (score < 3) threatLevel = 'Low';
    else if (score < 6) threatLevel = 'Medium';
    else if (score < 9) threatLevel = 'High';
    else threatLevel = 'Critical';

    const recs = {
      Network: [],
      Browser: [],
      Communication: [],
      Storage: [],
      Physical: []
    };

    // Base rules
    recs.Network.push('Use a reputable no-logs VPN provider');
    recs.Browser.push('Use a privacy-respecting browser (Brave, Firefox with Arkenfox user.js)');
    recs.Storage.push('Enable Full Disk Encryption (FDE) on all devices (BitLocker, FileVault, LUKS)');
    recs.Communication.push('Use end-to-end encrypted messaging (Signal)');

    // Identity specific
    if (identity === 'Journalist' || identity === 'Activist') {
      recs.Network.push('Use Tor Browser for highly sensitive research');
      recs.Storage.push('Use Tails OS on a live USB for compartmentalization');
      recs.Communication.push('Implement PGP for email communications');
      recs.Physical.push('Use privacy screens and avoid working in public visible spaces');
    }
    
    if (identity === 'Developer') {
      recs.Network.push('Segment your development environments using VMs or separate containers');
      recs.Storage.push('Cryptographically sign all your git commits');
      recs.Storage.push('Use hardware security keys (YubiKey) for all repository access');
    }

    if (identity === 'Business Professional') {
      recs.Communication.push('Use corporate-managed encrypted email channels');
      recs.Physical.push('Use physical privacy screens on laptops while traveling');
    }

    // Adversary specific
    if (adversary === 'Nation State') {
      recs.Physical.push('Leave electronics behind when attending high-risk meetings');
      recs.Storage.push('Use deniable encryption solutions (VeraCrypt hidden volumes)');
      recs.Network.push('Assume compromise: cycle hardware frequently');
      recs.Communication.push('Use Qubes OS for maximum security by compartmentalization');
    }

    if (adversary === 'Insider Threat' || adversary === 'Corporation') {
      recs.Browser.push('Compartmentalize web activities using different browser profiles/containers');
      recs.Storage.push('Regularly audit system logs and file access permissions');
    }

    // Concerns specific
    if (concerns.includes('Doxxing') || concerns.includes('Stalking/Harassment')) {
      recs.Browser.push('Use data removal services (DeleteMe) to remove info from data brokers');
      recs.Communication.push('Use VoIP numbers (MySudo) instead of real phone numbers');
      recs.Storage.push('Scrub EXIF data from all photos before sharing online');
    }
    
    if (concerns.includes('Identity Theft')) {
      recs.Browser.push('Freeze your credit with all major bureaus');
      recs.Storage.push('Use a trusted offline password manager (KeePassXC)');
    }

    // Devices specific
    if (devices.includes('Android')) {
      recs.Physical.push('Consider flashing GrapheneOS on a Pixel device');
    }
    if (devices.includes('Windows')) {
      recs.Browser.push('Use O&O ShutUp10 to disable Windows telemetry');
    }

    return { threatLevel, recs };
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Threat Modeling Wizard</h2>
        <p>A systematic approach to identifying and evaluating potential threats to your digital identity.</p>

        <div style={styles.progressBar}>
          {[1,2,3,4,5].map(i => (
            <div key={i} style={styles.progressStep(step === i, step > i)}></div>
          ))}
        </div>

        {step === 1 && (
          <div>
            <h3 style={{color: '#fff', marginBottom: '24px'}}>Who are you? (Threat Profile)</h3>
            {['Journalist', 'Activist', 'Developer', 'Business Professional', 'Personal User'].map(opt => (
              <label 
                key={opt} 
                style={{...styles.optionLabel, ...(identity === opt ? styles.optionLabelSelected : {})}}
              >
                <input 
                  type="radio" 
                  name="identity" 
                  value={opt} 
                  checked={identity === opt}
                  onChange={() => setIdentity(opt)}
                  style={styles.radioCheck}
                />
                {opt}
              </label>
            ))}
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 style={{color: '#fff', marginBottom: '24px'}}>What are your primary concerns?</h3>
            {['Government Surveillance', 'Data Breaches', 'Doxxing', 'Corporate Espionage', 'Stalking/Harassment', 'Identity Theft'].map(opt => (
              <label 
                key={opt} 
                style={{...styles.optionLabel, ...(concerns.includes(opt) ? styles.optionLabelSelected : {})}}
              >
                <input 
                  type="checkbox" 
                  checked={concerns.includes(opt)}
                  onChange={() => toggleArrayItem(concerns, setConcerns, opt)}
                  style={styles.radioCheck}
                />
                {opt}
              </label>
            ))}
          </div>
        )}

        {step === 3 && (
          <div>
            <h3 style={{color: '#fff', marginBottom: '24px'}}>Who is your primary adversary?</h3>
            {['Script Kiddie', 'Organized Crime', 'Corporation', 'Nation State', 'Insider Threat'].map(opt => (
              <label 
                key={opt} 
                style={{...styles.optionLabel, ...(adversary === opt ? styles.optionLabelSelected : {})}}
              >
                <input 
                  type="radio" 
                  name="adversary" 
                  value={opt} 
                  checked={adversary === opt}
                  onChange={() => setAdversary(opt)}
                  style={styles.radioCheck}
                />
                {opt}
              </label>
            ))}
          </div>
        )}

        {step === 4 && (
          <div>
            <h3 style={{color: '#fff', marginBottom: '24px'}}>What operating systems do you use?</h3>
            {['Windows', 'macOS', 'Linux', 'iOS', 'Android'].map(opt => (
              <label 
                key={opt} 
                style={{...styles.optionLabel, ...(devices.includes(opt) ? styles.optionLabelSelected : {})}}
              >
                <input 
                  type="checkbox" 
                  checked={devices.includes(opt)}
                  onChange={() => toggleArrayItem(devices, setDevices, opt)}
                  style={styles.radioCheck}
                />
                {opt}
              </label>
            ))}
          </div>
        )}

        {step === 5 && (
          <div>
            <h3 style={{color: '#fff', marginBottom: '16px'}}>Threat Model Report</h3>
            
            {(() => {
              const { threatLevel, recs } = generateReport();
              return (
                <div>
                  <div style={{background: 'rgba(0,0,0,0.3)', padding: '24px', borderRadius: '8px', marginBottom: '24px', border: '1px solid rgba(255,255,255,0.05)'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <span style={{color: '#fff', fontSize: '18px', fontWeight: 600}}>Assessed Threat Level:</span>
                      <span style={styles.threatBadge(threatLevel)}>{threatLevel}</span>
                    </div>
                  </div>

                  {Object.entries(recs).map(([category, items]) => {
                    if (items.length === 0) return null;
                    return (
                      <div key={category}>
                        <div style={styles.recCategory}>{category}</div>
                        <ul style={styles.ul}>
                          {items.map((item, idx) => (
                            <li key={idx} style={styles.li}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        )}

        <div style={styles.navRow}>
          {step > 1 ? (
            <button style={styles.buttonGhost} onClick={prevStep}>Back</button>
          ) : <div></div>}
          
          {step < 5 ? (
            <button 
              style={{...styles.button, opacity: canProceed() ? 1 : 0.5, cursor: canProceed() ? 'pointer' : 'not-allowed'}} 
              onClick={nextStep}
              disabled={!canProceed()}
            >
              Continue
            </button>
          ) : (
            <button style={styles.buttonGhost} onClick={() => {
              setStep(1);
              setIdentity('');
              setConcerns([]);
              setAdversary('');
              setDevices([]);
            }}>Start Over</button>
          )}
        </div>
      </div>
    </div>
  );
}
