import React, { useState } from 'react';
import { Lock, Key, Unlock, ShieldAlert, Check, Copy } from 'lucide-react';

export default function PgpSuite() {
  const [activeTab, setActiveTab] = useState('generate'); // generate, encrypt, decrypt
  const [publicKeyText, setPublicKeyText] = useState('');
  const [privateKeyText, setPrivateKeyText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedKey, setCopiedKey] = useState(''); // public, private

  // Encryption inputs
  const [encPubKey, setEncPubKey] = useState('');
  const [encMessage, setEncMessage] = useState('');
  const [encResult, setEncResult] = useState('');
  const [copiedEnc, setCopiedEnc] = useState(false);

  // Decryption inputs
  const [decPrivKey, setDecPrivKey] = useState('');
  const [decCiphertext, setDecCiphertext] = useState('');
  const [decResult, setDecResult] = useState('');
  const [decError, setDecError] = useState('');

  const generateKeyPair = async () => {
    setIsGenerating(true);
    try {
      const keyPair = await window.crypto.subtle.generateKey(
        {
          name: "RSA-OAEP",
          modulusLength: 2048,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: "SHA-256"
        },
        true,
        ["encrypt", "decrypt"]
      );

      // Export keys as JWK
      const pubJwk = await window.crypto.subtle.exportKey("jwk", keyPair.publicKey);
      const privJwk = await window.crypto.subtle.exportKey("jwk", keyPair.privateKey);

      // Convert JWKs to base64 strings
      const pubB64 = btoa(JSON.stringify(pubJwk));
      const privB64 = btoa(JSON.stringify(privJwk));

      setPublicKeyText(`-----BEGIN OPSEC PUBLIC KEY-----\n${pubB64}\n-----END OPSEC PUBLIC KEY-----`);
      setPrivateKeyText(`-----BEGIN OPSEC PRIVATE KEY-----\n${privB64}\n-----END OPSEC PRIVATE KEY-----`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(type);
    setTimeout(() => setCopiedKey(''), 2000);
  };

  const handleEncrypt = async () => {
    try {
      // Extract b64 content between headers
      const b64 = encPubKey
        .replace('-----BEGIN OPSEC PUBLIC KEY-----', '')
        .replace('-----END OPSEC PUBLIC KEY-----', '')
        .replace(/\s/g, '');

      const jwk = JSON.parse(atob(b64));
      
      const pubKey = await window.crypto.subtle.importKey(
        "jwk",
        jwk,
        {
          name: "RSA-OAEP",
          hash: "SHA-256"
        },
        true,
        ["encrypt"]
      );

      const enc = new TextEncoder();
      const encodedMsg = enc.encode(encMessage);

      const encryptedBuffer = await window.crypto.subtle.encrypt(
        {
          name: "RSA-OAEP"
        },
        pubKey,
        encodedMsg
      );

      // Convert encrypted buffer to base64
      const encryptedBytes = new Uint8Array(encryptedBuffer);
      let binaryString = '';
      for (let i = 0; i < encryptedBytes.byteLength; i++) {
        binaryString += String.fromCharCode(encryptedBytes[i]);
      }
      const base64Cipher = btoa(binaryString);

      setEncResult(`-----BEGIN OPSEC ENCRYPTED MESSAGE-----\n${base64Cipher}\n-----END OPSEC ENCRYPTED MESSAGE-----`);
    } catch (err) {
      setEncResult('Encryption failed. Invalid Public Key format.');
      console.error(err);
    }
  };

  const handleDecrypt = async () => {
    setDecError('');
    setDecResult('');
    try {
      // Extract private key b64
      const privB64 = decPrivKey
        .replace('-----BEGIN OPSEC PRIVATE KEY-----', '')
        .replace('-----END OPSEC PRIVATE KEY-----', '')
        .replace(/\s/g, '');

      const jwk = JSON.parse(atob(privB64));

      const privKey = await window.crypto.subtle.importKey(
        "jwk",
        jwk,
        {
          name: "RSA-OAEP",
          hash: "SHA-256"
        },
        true,
        ["decrypt"]
      );

      // Extract ciphertext b64
      const cipherB64 = decCiphertext
        .replace('-----BEGIN OPSEC ENCRYPTED MESSAGE-----', '')
        .replace('-----END OPSEC ENCRYPTED MESSAGE-----', '')
        .replace(/\s/g, '');

      const binaryString = atob(cipherB64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const decryptedBuffer = await window.crypto.subtle.decrypt(
        {
          name: "RSA-OAEP"
        },
        privKey,
        bytes.buffer
      );

      const dec = new TextDecoder();
      const decodedMsg = dec.decode(decryptedBuffer);

      setDecResult(decodedMsg);
    } catch (err) {
      setDecError('Decryption failed. Ensure the Private Key is correct and the message was encrypted using the corresponding Public Key.');
      console.error(err);
    }
  };

  return (
    <div style={{ maxWidth: '800px', color: '#fff', fontFamily: "'JetBrains Mono', monospace" }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <Key size={24} style={{ color: '#10b981' }} />
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>PGP & Keys Suite</h2>
      </div>

      <p style={{ fontSize: '13px', color: '#a3a3a3', lineHeight: '1.6', marginBottom: '24px' }}>
        Client-side asymmetric keypair generator and cryptographic suite. Generate 2048-bit RSA-OAEP keys, encrypt messages locally using public keys, or decrypt them securely with private keys.
      </p>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px', marginBottom: '24px' }}>
        {[
          { key: 'generate', label: 'Keypair Generator', icon: <Key size={14} /> },
          { key: 'encrypt', label: 'Encrypt Message', icon: <Lock size={14} /> },
          { key: 'decrypt', label: 'Decrypt Message', icon: <Unlock size={14} /> },
        ].map(tab => {
          const isActive = activeTab === tab.key;
          return (
            <button 
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                background: isActive ? 'rgba(16,185,129,0.1)' : 'transparent',
                color: isActive ? '#10b981' : '#737373',
                border: isActive ? '1px solid rgba(16,185,129,0.3)' : '1px solid transparent',
                padding: '8px 16px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', transition: 'all 0.2s'
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: Keypair Gen */}
      {activeTab === 'generate' && (
        <div style={{ background: 'linear-gradient(to bottom, #0a0a0a, #040404)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '12px', padding: '24px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#fff' }}>Generate Asymmetric RSA Keypair</h3>
          
          {!publicKeyText ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <button 
                onClick={generateKeyPair} 
                disabled={isGenerating}
                style={{ background: '#10b981', color: '#000', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
              >
                {isGenerating ? 'Computing Prime Coordinates...' : 'Generate New 2048-bit Keypair'}
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 'bold' }}>PUBLIC KEY (Share this)</span>
                  <button 
                    onClick={() => handleCopy(publicKeyText, 'public')}
                    style={{ background: 'transparent', border: 'none', color: '#a3a3a3', cursor: 'pointer', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    {copiedKey === 'public' ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                    {copiedKey === 'public' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <textarea 
                  value={publicKeyText}
                  readOnly
                  style={{ width: '100%', height: '220px', background: '#030303', border: '1px solid rgba(255,255,255,0.08)', color: '#a3a3a3', padding: '8px', borderRadius: '6px', fontSize: '9px', fontFamily: 'inherit', outline: 'none', resize: 'none' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', color: '#ef4444', fontWeight: 'bold' }}>PRIVATE KEY (Keep secret!)</span>
                  <button 
                    onClick={() => handleCopy(privateKeyText, 'private')}
                    style={{ background: 'transparent', border: 'none', color: '#a3a3a3', cursor: 'pointer', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    {copiedKey === 'private' ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                    {copiedKey === 'private' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <textarea 
                  value={privateKeyText}
                  readOnly
                  style={{ width: '100%', height: '220px', background: '#030303', border: '1px solid rgba(255,255,255,0.08)', color: '#a3a3a3', padding: '8px', borderRadius: '6px', fontSize: '9px', fontFamily: 'inherit', outline: 'none', resize: 'none' }}
                />
              </div>

              <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'center', marginTop: '12px' }}>
                <button 
                  onClick={() => { setPublicKeyText(''); setPrivateKeyText(''); }}
                  style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', color: '#737373', padding: '8px 16px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}
                >
                  Generate New Pair
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Encrypt */}
      {activeTab === 'encrypt' && (
        <div style={{ background: 'linear-gradient(to bottom, #0a0a0a, #040404)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '12px', padding: '24px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px', color: '#fff' }}>Encrypt Message with Recipient's Public Key</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ fontSize: '11px', color: '#737373', display: 'block', marginBottom: '6px' }}>Public Key</label>
              <textarea 
                value={encPubKey}
                onChange={(e) => setEncPubKey(e.target.value)}
                placeholder="Paste the recipient's public key here..."
                style={{ width: '100%', height: '120px', background: '#030303', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', padding: '8px', borderRadius: '6px', fontSize: '10px', fontFamily: 'inherit', outline: 'none', resize: 'none', marginBottom: '12px' }}
              />

              <label style={{ fontSize: '11px', color: '#737373', display: 'block', marginBottom: '6px' }}>Message to Encrypt</label>
              <textarea 
                value={encMessage}
                onChange={(e) => setEncMessage(e.target.value)}
                placeholder="Type the secret message..."
                style={{ width: '100%', height: '80px', background: '#030303', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', padding: '8px', borderRadius: '6px', fontSize: '12px', fontFamily: 'inherit', outline: 'none', resize: 'none', marginBottom: '16px' }}
              />

              <button 
                onClick={handleEncrypt}
                disabled={!encPubKey || !encMessage}
                style={{ width: '100%', background: '#10b981', color: '#000', border: 'none', padding: '10px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}
              >
                Encrypt Message
              </button>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 'bold' }}>ENCRYPTED CIPHERTEXT</span>
                {encResult && !encResult.includes('failed') && (
                  <button 
                    onClick={() => { navigator.clipboard.writeText(encResult); setCopiedEnc(true); setTimeout(() => setCopiedEnc(false), 2000); }}
                    style={{ background: 'transparent', border: 'none', color: '#a3a3a3', cursor: 'pointer', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    {copiedEnc ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                    {copiedEnc ? 'Copied!' : 'Copy'}
                  </button>
                )}
              </div>
              <textarea 
                value={encResult}
                readOnly
                placeholder="Encrypted ciphertext will appear here..."
                style={{ width: '100%', height: '256px', background: '#030303', border: '1px solid rgba(255,255,255,0.08)', color: encResult.includes('failed') ? '#ef4444' : '#a3a3a3', padding: '8px', borderRadius: '6px', fontSize: '10px', fontFamily: 'inherit', outline: 'none', resize: 'none' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Decrypt */}
      {activeTab === 'decrypt' && (
        <div style={{ background: 'linear-gradient(to bottom, #0a0a0a, #040404)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '12px', padding: '24px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px', color: '#fff' }}>Decrypt Message with Private Key</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ fontSize: '11px', color: '#737373', display: 'block', marginBottom: '6px' }}>Your Private Key</label>
              <textarea 
                value={decPrivKey}
                onChange={(e) => setDecPrivKey(e.target.value)}
                placeholder="Paste your private key here..."
                style={{ width: '100%', height: '100px', background: '#030303', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', padding: '8px', borderRadius: '6px', fontSize: '10px', fontFamily: 'inherit', outline: 'none', resize: 'none', marginBottom: '12px' }}
              />

              <label style={{ fontSize: '11px', color: '#737373', display: 'block', marginBottom: '6px' }}>Encrypted Message</label>
              <textarea 
                value={decCiphertext}
                onChange={(e) => setDecCiphertext(e.target.value)}
                placeholder="Paste the ciphertext message here..."
                style={{ width: '100%', height: '100px', background: '#030303', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', padding: '8px', borderRadius: '6px', fontSize: '10px', fontFamily: 'inherit', outline: 'none', resize: 'none', marginBottom: '16px' }}
              />

              <button 
                onClick={handleDecrypt}
                disabled={!decPrivKey || !decCiphertext}
                style={{ width: '100%', background: '#10b981', color: '#000', border: 'none', padding: '10px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}
              >
                Decrypt Ciphertext
              </button>
            </div>

            <div>
              <h4 style={{ fontSize: '12px', color: '#10b981', fontWeight: 'bold', margin: '0 0 8px 0' }}>DECRYPTED CLEARTEXT</h4>
              
              {decError && (
                <div style={{ display: 'flex', gap: '8px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', padding: '12px', borderRadius: '6px', marginBottom: '12px', fontSize: '11px', color: '#ef4444' }}>
                  <ShieldAlert size={16} style={{ flexShrink: 0 }} />
                  <span>{decError}</span>
                </div>
              )}

              <textarea 
                value={decResult}
                readOnly
                placeholder="Decrypted cleartext will appear here..."
                style={{ width: '100%', height: '220px', background: '#030303', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', padding: '8px', borderRadius: '6px', fontSize: '12px', fontFamily: 'inherit', outline: 'none', resize: 'none' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
