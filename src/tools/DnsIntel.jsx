import React, { useState } from 'react';

const isIP = (str) => {
  const ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return ipRegex.test(str);
};

export default function DnsIntel() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dnsData, setDnsData] = useState(null);
  const [ipData, setIpData] = useState(null);

  const analyze = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    setDnsData(null);
    setIpData(null);

    const input = query.trim();
    
    if (isIP(input)) {
      // Handle IP
      try {
        const response = await fetch(`http://ip-api.com/json/${input}?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,query`);
        if (!response.ok) throw new Error('Network error fetching IP data');
        const data = await response.json();
        
        if (data.status === 'fail') {
          setError(data.message || 'Invalid IP address');
        } else {
          setIpData(data);
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch IP intel (Note: ip-api requires HTTP)');
      }
    } else {
      // Handle Domain
      try {
        const types = [1, 28, 15, 2, 16]; // A, AAAA, MX, NS, TXT
        const typeNames = { 1: 'A', 28: 'AAAA', 15: 'MX', 2: 'NS', 16: 'TXT' };
        let results = {};

        for (let type of types) {
          const response = await fetch(`https://dns.google/resolve?name=${input}&type=${type}`);
          if (!response.ok) throw new Error('Network error fetching DNS data');
          const data = await response.json();
          results[typeNames[type]] = data.Answer || [];
        }
        
        const hasRecords = Object.values(results).some(arr => arr.length > 0);
        if (!hasRecords) {
          setError('No records found for this domain.');
        } else {
          setDnsData(results);
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch DNS intel');
      }
    }
    
    setLoading(false);
  };

  const renderTable = (title, records) => {
    if (!records || records.length === 0) return null;
    return (
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ color: '#fff', fontSize: '16px', marginBottom: '12px' }}>{title} Records</h3>
        <div style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '8px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#111', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <th style={{ padding: '10px 16px', color: '#fff', fontWeight: '500' }}>Name</th>
                <th style={{ padding: '10px 16px', color: '#fff', fontWeight: '500' }}>TTL</th>
                <th style={{ padding: '10px 16px', color: '#fff', fontWeight: '500' }}>Data</th>
              </tr>
            </thead>
            <tbody>
              {records.map((rec, idx) => (
                <tr key={idx} style={{ borderBottom: idx === records.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '10px 16px', color: '#a3a3a3', fontFamily: '"JetBrains Mono", monospace' }}>{rec.name}</td>
                  <td style={{ padding: '10px 16px', color: '#a3a3a3', fontFamily: '"JetBrains Mono", monospace' }}>{rec.TTL}</td>
                  <td style={{ padding: '10px 16px', color: '#10b981', fontFamily: '"JetBrains Mono", monospace', wordBreak: 'break-all' }}>{rec.data}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: '24px', fontFamily: '"Inter", sans-serif', color: '#a3a3a3', background: '#030303', minHeight: '100vh' }}>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      <h1 style={{ color: '#fff', fontSize: '24px', marginBottom: '8px' }}>DNS & IP Intelligence</h1>
      <p style={{ marginBottom: '24px' }}>Analyze domain name records and geolocate IP addresses.</p>

      <div style={{ background: 'linear-gradient(to bottom, #0a0a0a, #040404)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '12px', padding: '20px', marginBottom: '24px', display: 'flex', gap: '12px' }}>
        <input
          type="text"
          placeholder="Enter Domain (e.g. example.com) or IP (e.g. 8.8.8.8)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && analyze()}
          style={{ flex: 1, background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', padding: '12px 16px', borderRadius: '8px', fontSize: '14px', fontFamily: '"JetBrains Mono", monospace', outline: 'none' }}
        />
        <button 
          onClick={analyze}
          disabled={loading || !query.trim()}
          style={{ background: '#10b981', color: '#000', border: 'none', padding: '0 24px', borderRadius: '8px', cursor: loading || !query.trim() ? 'not-allowed' : 'pointer', fontWeight: '600', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', opacity: loading || !query.trim() ? 0.7 : 1 }}
        >
          {loading ? (
            <>
              <div style={{ width: '14px', height: '14px', border: '2px solid #000', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
              Analyzing...
            </>
          ) : 'Analyze'}
        </button>
      </div>

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
          {error}
        </div>
      )}

      {ipData && (
        <div style={{ background: 'linear-gradient(to bottom, #0a0a0a, #040404)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '12px', padding: '24px' }}>
          <h2 style={{ color: '#fff', fontSize: '18px', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' }}>Geolocation Data: {ipData.query}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <div>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>ISP / Organization</div>
              <div style={{ color: '#fff', fontSize: '15px' }}>{ipData.isp}</div>
              <div style={{ color: '#a3a3a3', fontSize: '13px' }}>{ipData.org}</div>
              <div style={{ color: '#a3a3a3', fontSize: '13px' }}>{ipData.as}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>Location</div>
              <div style={{ color: '#fff', fontSize: '15px' }}>{ipData.city}, {ipData.regionName}</div>
              <div style={{ color: '#a3a3a3', fontSize: '13px' }}>{ipData.country} ({ipData.countryCode})</div>
              <div style={{ color: '#a3a3a3', fontSize: '13px' }}>Zip: {ipData.zip}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>Coordinates & Time</div>
              <div style={{ color: '#fff', fontSize: '15px' }}>Lat: {ipData.lat}</div>
              <div style={{ color: '#fff', fontSize: '15px' }}>Lon: {ipData.lon}</div>
              <div style={{ color: '#a3a3a3', fontSize: '13px' }}>{ipData.timezone}</div>
            </div>
          </div>
        </div>
      )}

      {dnsData && (
        <div style={{ background: 'linear-gradient(to bottom, #0a0a0a, #040404)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '12px', padding: '24px' }}>
          <h2 style={{ color: '#fff', fontSize: '18px', marginBottom: '24px' }}>DNS Records: {query}</h2>
          {renderTable('A', dnsData['A'])}
          {renderTable('AAAA', dnsData['AAAA'])}
          {renderTable('MX', dnsData['MX'])}
          {renderTable('NS', dnsData['NS'])}
          {renderTable('TXT', dnsData['TXT'])}
        </div>
      )}
    </div>
  );
}
