import React, { useState, useEffect } from 'react';

const brokers = [
  { name: 'Spokeo', url: 'https://www.spokeo.com', region: 'United States' },
  { name: 'BeenVerified', url: 'https://www.beenverified.com', region: 'United States' },
  { name: 'Whitepages', url: 'https://www.whitepages.com', region: 'United States' },
  { name: 'Intelius', url: 'https://www.intelius.com', region: 'United States' },
  { name: 'PeopleFinder', url: 'https://www.peoplefinder.com', region: 'United States' },
  { name: 'TruePeopleSearch', url: 'https://www.truepeoplesearch.com', region: 'United States' },
  { name: 'FastPeopleSearch', url: 'https://www.fastpeoplesearch.com', region: 'United States' },
  { name: 'USSearch', url: 'https://www.ussearch.com', region: 'United States' },
  { name: 'Radaris', url: 'https://radaris.com', region: 'Global' },
  { name: 'ZabaSearch', url: 'https://www.zabasearch.com', region: 'United States' },
  { name: 'Pipl', url: 'https://pipl.com', region: 'Global' },
  { name: 'AnyWho', url: 'https://www.anywho.com', region: 'United States' },
  { name: 'ThatsThem', url: 'https://thatsthem.com', region: 'United States' },
  { name: 'Addresses.com', url: 'https://www.addresses.com', region: 'United States' },
  { name: 'Nuwber', url: 'https://nuwber.com', region: 'United States' },
  { name: 'Instant Checkmate', url: 'https://www.instantcheckmate.com', region: 'United States' },
  { name: 'PublicRecordsNow', url: 'https://www.publicrecordsnow.com', region: 'United States' },
  { name: 'SearchPeopleFree', url: 'https://www.searchpeoplefree.com', region: 'United States' },
  { name: 'FamilyTreeNow', url: 'https://www.familytreenow.com', region: 'United States' },
  { name: 'MyLife', url: 'https://www.mylife.com', region: 'United States' },
  { name: 'Acxiom', url: 'https://www.acxiom.com', region: 'Global' },
  { name: 'LexisNexis', url: 'https://www.lexisnexis.com', region: 'Global' },
  { name: 'Experian', url: 'https://www.experian.com', region: 'Global' },
  { name: 'Equifax', url: 'https://www.equifax.com', region: 'Global' },
  { name: 'TransUnion', url: 'https://www.transunion.com', region: 'Global' },
  { name: 'ZoomInfo', url: 'https://www.zoominfo.com', region: 'Global' },
  { name: 'Apollo.io', url: 'https://www.apollo.io', region: 'Global' },
  { name: 'Lusha', url: 'https://www.lusha.com', region: 'Global' },
  { name: 'Criteo', url: 'https://www.criteo.com', region: 'Europe' },
  { name: 'Pagine Bianche', url: 'https://www.paginebianche.it', region: 'Europe' },
  { name: 'Registro delle Opposizioni', url: 'https://registrodelleopposizioni.it', region: 'Europe' },
  { name: 'Experian Italia', url: 'https://www.experian.it', region: 'Europe' },
  { name: 'CRIF', url: 'https://www.crif.it', region: 'Europe' },
  { name: 'Schufa', url: 'https://www.schufa.de', region: 'Europe' },
  { name: '192.com', url: 'https://www.192.com', region: 'Europe' },
  { name: 'Infobel', url: 'https://www.infobel.com', region: 'Europe' },
  { name: 'Yelp', url: 'https://www.yelp.com', region: 'Global' },
  { name: 'Thomson Reuters', url: 'https://www.thomsonreuters.com', region: 'Global' },
  { name: 'DataLogix', url: 'https://www.datalogix.com', region: 'United States' },
  { name: 'CoreLogic', url: 'https://www.corelogic.com', region: 'Global' },
  { name: 'Epsilon', url: 'https://www.epsilon.com', region: 'Global' },
  { name: 'Oracle Data Cloud', url: 'https://www.oracle.com', region: 'Global' },
  { name: 'Nielsen', url: 'https://www.nielsen.com', region: 'Global' },
  { name: 'LiveRamp', url: 'https://liveramp.com', region: 'Global' },
  { name: 'Clearbit', url: 'https://clearbit.com', region: 'Global' },
  { name: 'Hunter.io', url: 'https://hunter.io', region: 'Global' },
  { name: 'RocketReach', url: 'https://rocketreach.co', region: 'Global' },
  { name: 'Seamless.AI', url: 'https://seamless.ai', region: 'Global' },
  { name: 'Cognism', url: 'https://www.cognism.com', region: 'Europe' },
  { name: 'LeadIQ', url: 'https://leadiq.com', region: 'Global' },
  { name: 'ContactOut', url: 'https://contactout.com', region: 'Global' },
  { name: 'SignalHire', url: 'https://www.signalhire.com', region: 'Global' },
];

export default function DataBrokerRemoval() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selected, setSelected] = useState([]);
  const [sent, setSent] = useState([]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [regionFilter, setRegionFilter] = useState('All');

  useEffect(() => {
    const savedSent = localStorage.getItem('opsec_brokers_sent');
    if (savedSent) {
      setSent(JSON.parse(savedSent));
    }
  }, []);

  const toggleSelect = (brokerName) => {
    if (selected.includes(brokerName)) {
      setSelected(selected.filter(n => n !== brokerName));
    } else {
      setSelected([...selected, brokerName]);
    }
  };

  const filteredBrokers = brokers.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = regionFilter === 'All' || b.region === regionFilter;
    return matchesSearch && matchesRegion;
  });

  const selectAll = () => {
    const newSelected = new Set([...selected, ...filteredBrokers.map(b => b.name)]);
    setSelected(Array.from(newSelected));
  };

  const deselectAll = () => {
    const filteredNames = filteredBrokers.map(b => b.name);
    setSelected(selected.filter(n => !filteredNames.includes(n)));
  };

  const markSent = (brokerName) => {
    let newSent;
    if (sent.includes(brokerName)) {
      newSent = sent.filter(n => n !== brokerName);
    } else {
      newSent = [...sent, brokerName];
    }
    setSent(newSent);
    localStorage.setItem('opsec_brokers_sent', JSON.stringify(newSent));
  };

  const generateTemplate = (brokerName) => {
    return `Subject: Data Deletion Request - ${brokerName} - GDPR Article 17 / CCPA

To the Privacy Officer of ${brokerName},

My name is ${name || '[Your Name]'} and my email is ${email || '[Your Email]'}.

Under the provisions of GDPR Article 17 (Right to Erasure) and/or the California Consumer Privacy Act (CCPA), I am requesting the immediate deletion of all my personal data held by your organization.

Please confirm within 30 days that my data has been completely removed from your databases and any associated third-party sharing mechanisms.

Thank you,
${name || '[Your Name]'}`;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const progress = Math.round((sent.length / brokers.length) * 100);

  return (
    <div style={{ padding: '24px', fontFamily: '"Inter", sans-serif', color: '#a3a3a3', background: '#030303', minHeight: '100vh' }}>
      <h1 style={{ color: '#fff', fontSize: '24px', marginBottom: '8px' }}>Data Broker Removal</h1>
      <p style={{ marginBottom: '24px' }}>Automate GDPR/CCPA data deletion requests.</p>

      <div style={{ background: 'linear-gradient(to bottom, #0a0a0a, #040404)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
        <h2 style={{ color: '#fff', fontSize: '16px', marginBottom: '16px' }}>Your Information</h2>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', padding: '10px 14px', borderRadius: '8px', width: '100%', fontSize: '13px', fontFamily: 'inherit', outline: 'none' }}
          />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', padding: '10px 14px', borderRadius: '8px', width: '100%', fontSize: '13px', fontFamily: 'inherit', outline: 'none' }}
          />
        </div>
      </div>

      <div style={{ background: 'linear-gradient(to bottom, #0a0a0a, #040404)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
        <h2 style={{ color: '#fff', fontSize: '16px', marginBottom: '16px' }}>Filter Brokers</h2>
        <div style={{ display: 'flex', gap: '16px' }}>
          <input
            type="text"
            placeholder="Search brokers by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flex: 1, background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', fontFamily: 'inherit', outline: 'none' }}
          />
          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', fontFamily: 'inherit', outline: 'none', minWidth: '150px' }}
          >
            <option value="All">All Regions</option>
            <option value="United States">United States</option>
            <option value="Europe">Europe</option>
            <option value="Global">Global</option>
          </select>
        </div>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ color: '#fff', fontSize: '16px', margin: 0 }}>Progress: {sent.length} of {brokers.length} contacted</h2>
          <span style={{ color: '#10b981', fontWeight: 'bold' }}>{progress}%</span>
        </div>
        <div style={{ height: '8px', background: '#222', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ height: '100%', background: '#10b981', width: `${progress}%`, transition: 'width 0.3s ease' }}></div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
        <button onClick={selectAll} style={{ background: '#10b981', color: '#000', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', fontSize: '13px' }}>Select Filtered</button>
        <button onClick={deselectAll} style={{ background: 'transparent', color: '#a3a3a3', border: '1px solid rgba(255,255,255,0.2)', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', fontSize: '13px' }}>Deselect Filtered</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
        {filteredBrokers.map(broker => (
          <div key={broker.name} style={{ background: 'linear-gradient(to bottom, #0a0a0a, #040404)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '12px', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <input
                type="checkbox"
                checked={selected.includes(broker.name)}
                onChange={() => toggleSelect(broker.name)}
                style={{ width: '16px', height: '16px', accentColor: '#10b981' }}
              />
              <div>
                <div style={{ color: '#fff', fontWeight: '500', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {broker.name}
                  <span style={{ fontSize: '10px', padding: '2px 6px', background: '#222', borderRadius: '4px', color: '#888' }}>{broker.region}</span>
                </div>
                <a href={broker.url} target="_blank" rel="noopener noreferrer" style={{ color: '#10b981', fontSize: '12px', textDecoration: 'none' }}>{broker.url}</a>
              </div>
            </div>

            {selected.includes(broker.name) && (
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '16px', marginTop: '16px' }}>
                <div style={{ background: '#000', padding: '12px', borderRadius: '6px', fontFamily: '"JetBrains Mono", monospace', fontSize: '11px', color: '#a3a3a3', whiteSpace: 'pre-wrap', marginBottom: '12px' }}>
                  {generateTemplate(broker.name)}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button onClick={() => copyToClipboard(generateTemplate(broker.name))} style={{ background: 'transparent', color: '#10b981', border: '1px solid #10b981', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Copy Template</button>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: sent.includes(broker.name) ? '#10b981' : '#a3a3a3', cursor: 'pointer' }}>
                    <input type="checkbox" checked={sent.includes(broker.name)} onChange={() => markSent(broker.name)} style={{ accentColor: '#10b981' }} />
                    Mark as Sent
                  </label>
                </div>
              </div>
            )}
          </div>
        ))}
        {filteredBrokers.length === 0 && (
          <div style={{ color: '#888', gridColumn: '1 / -1', padding: '24px 0' }}>No data brokers match your filters.</div>
        )}
      </div>
    </div>
  );
}
