import React, { useState, useRef } from 'react';
import { Eye, EyeOff, Image, ShieldAlert, Check, Download } from 'lucide-react';

export default function Steganography() {
  const [activeTab, setActiveTab] = useState('encode'); // encode, decode
  const [secretText, setSecretText] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imageSrc, setImageSrc] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [decodedMessage, setDecodedMessage] = useState('');
  const [decodeError, setDecodeError] = useState('');

  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageSrc(event.target.result);
        setDecodedMessage('');
        setDecodeError('');
        setSuccessMsg('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEncode = async () => {
    if (!imageSrc || !secretText) return;
    setIsProcessing(true);
    setSuccessMsg('');

    const img = new window.Image();
    img.src = imageSrc;
    img.onload = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw image
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Convert message to bit array (including null terminator)
      const encoder = new TextEncoder();
      const msgBytes = encoder.encode(secretText);
      const bits = [];

      // Add character bytes to bits array
      for (let i = 0; i < msgBytes.length; i++) {
        const byte = msgBytes[i];
        for (let bit = 7; bit >= 0; bit--) {
          bits.push((byte >> bit) & 1);
        }
      }

      // Add 8 zero bits for NULL terminator
      for (let bit = 0; bit < 8; bit++) {
        bits.push(0);
      }

      // Check if image has enough capacity (ignoring alpha channel for simpler LSB)
      const maxBits = (data.length / 4) * 3; // R, G, B channels of each pixel
      if (bits.length > maxBits) {
        alert('Image too small to contain this secret message. Choose a larger image or write a shorter message.');
        setIsProcessing(false);
        return;
      }

      // Hide bits in red, green, blue channels (skip alpha channel every 4th byte)
      let bitIndex = 0;
      for (let i = 0; i < data.length && bitIndex < bits.length; i++) {
        if ((i + 1) % 4 === 0) continue; // Skip alpha channel to prevent transparency changes
        data[i] = (data[i] & 0xFE) | bits[bitIndex];
        bitIndex++;
      }

      // Put pixel data back
      ctx.putImageData(imageData, 0, 0);

      // Trigger download as PNG (MUST be PNG to prevent lossy compression corrupting the bits)
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `SECURE_${imageFile.name.split('.')[0]}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setIsProcessing(false);
      setSuccessMsg('Encoding complete! PNG image downloaded successfully. The secret data is now hidden in the pixels.');
    };
  };

  const handleDecode = () => {
    if (!imageSrc) return;
    setIsProcessing(true);
    setDecodeError('');
    setDecodedMessage('');

    const img = new window.Image();
    img.src = imageSrc;
    img.onload = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      const bits = [];
      for (let i = 0; i < data.length; i++) {
        if ((i + 1) % 4 === 0) continue; // Skip alpha
        bits.push(data[i] & 1);
      }

      // Assemble bits into bytes
      const bytes = [];
      for (let i = 0; i < bits.length; i += 8) {
        if (i + 8 > bits.length) break;
        let byteVal = 0;
        for (let bit = 0; bit < 8; bit++) {
          byteVal = (byteVal << 1) | bits[i + bit];
        }
        if (byteVal === 0) break; // Reached NULL terminator
        bytes.push(byteVal);
      }

      try {
        const decoder = new TextDecoder();
        const decoded = decoder.decode(new Uint8Array(bytes));
        if (decoded) {
          setDecodedMessage(decoded);
        } else {
          setDecodeError('No hidden message found, or the data is corrupted.');
        }
      } catch (err) {
        setDecodeError('Error decoding data. The file might not contain a hidden message.');
      } finally {
        setIsProcessing(false);
      }
    };
  };

  return (
    <div style={{ maxWidth: '800px', color: '#fff', fontFamily: "'JetBrains Mono', monospace" }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <Image size={24} style={{ color: '#10b981' }} />
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>Steganography Suite</h2>
      </div>

      <p style={{ fontSize: '13px', color: '#a3a3a3', lineHeight: '1.6', marginBottom: '24px' }}>
        Hide secret message payloads within the pixel color data of cover images using LSB (Least Significant Bit) encoding. All processing takes place strictly client-side. Output files must be saved as lossless PNG.
      </p>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px', marginBottom: '24px' }}>
        <button 
          onClick={() => { setActiveTab('encode'); setImageFile(null); setImageSrc(''); setSuccessMsg(''); }}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: activeTab === 'encode' ? 'rgba(16,185,129,0.1)' : 'transparent',
            color: activeTab === 'encode' ? '#10b981' : '#737373',
            border: activeTab === 'encode' ? '1px solid rgba(16,185,129,0.3)' : '1px solid transparent',
            padding: '8px 16px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', transition: 'all 0.2s'
          }}
        >
          <EyeOff size={14} />
          Hide Message (Encode)
        </button>
        <button 
          onClick={() => { setActiveTab('decode'); setImageFile(null); setImageSrc(''); setDecodedMessage(''); setDecodeError(''); }}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: activeTab === 'decode' ? 'rgba(16,185,129,0.1)' : 'transparent',
            color: activeTab === 'decode' ? '#10b981' : '#737373',
            border: activeTab === 'decode' ? '1px solid rgba(16,185,129,0.3)' : '1px solid transparent',
            padding: '8px 16px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', transition: 'all 0.2s'
          }}
        >
          <Eye size={14} />
          Extract Message (Decode)
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Left column: Drag and Drop & Preview */}
        <div style={{ background: 'linear-gradient(to bottom, #0a0a0a, #040404)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>Cover Image</h3>
          
          <div style={{
            border: '1px dashed rgba(255,255,255,0.1)',
            borderRadius: '6px',
            height: '200px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            background: '#030303',
            marginBottom: '16px',
            overflow: 'hidden',
            position: 'relative'
          }}>
            {!imageSrc ? (
              <>
                <Image size={32} style={{ color: '#737373', marginBottom: '12px' }} />
                <label style={{ fontSize: '12px', color: '#a3a3a3', cursor: 'pointer' }}>
                  <span style={{ color: '#10b981', textDecoration: 'underline' }}>Upload Cover Image</span>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                </label>
              </>
            ) : (
              <div style={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={imageSrc} alt="Preview" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                <button 
                  onClick={() => { setImageFile(null); setImageSrc(''); }} 
                  style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', color: '#ef4444', padding: '4px 8px', fontSize: '10px', cursor: 'pointer' }}
                >
                  Change
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right column: Action configurations */}
        <div style={{ background: 'linear-gradient(to bottom, #0a0a0a, #040404)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '12px', padding: '20px' }}>
          {activeTab === 'encode' ? (
            <>
              <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>Secret Message</h3>
              <textarea 
                value={secretText}
                onChange={(e) => setSecretText(e.target.value)}
                placeholder="Type the message to hide inside the image pixels..."
                disabled={isProcessing}
                style={{
                  background: '#030303',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#fff',
                  padding: '12px',
                  borderRadius: '6px',
                  width: '100%',
                  height: '110px',
                  fontSize: '12px',
                  fontFamily: 'inherit',
                  outline: 'none',
                  resize: 'none',
                  marginBottom: '16px'
                }}
              />
              <button 
                onClick={handleEncode}
                disabled={isProcessing || !imageSrc || !secretText}
                style={{ width: '100%', background: '#10b981', color: '#000', border: 'none', padding: '10px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <Download size={14} />
                Encode & Download PNG
              </button>
            </>
          ) : (
            <>
              <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>Hidden Message Extract</h3>
              <button 
                onClick={handleDecode}
                disabled={isProcessing || !imageSrc}
                style={{ width: '100%', background: '#10b981', color: '#000', border: 'none', padding: '10px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px', marginBottom: '16px' }}
              >
                {isProcessing ? 'Reading Pixels...' : 'Extract Secret Message'}
              </button>

              <textarea 
                value={decodedMessage}
                readOnly
                placeholder="Extracted message will appear here..."
                style={{
                  background: '#030303',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#10b981',
                  padding: '12px',
                  borderRadius: '6px',
                  width: '100%',
                  height: '110px',
                  fontSize: '12px',
                  fontFamily: 'inherit',
                  outline: 'none',
                  resize: 'none'
                }}
              />
            </>
          )}
        </div>
      </div>

      {successMsg && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', padding: '12px', borderRadius: '6px', marginTop: '24px', fontSize: '12px' }}>
          <Check size={16} style={{ color: '#10b981', flexShrink: 0 }} />
          <span>{successMsg}</span>
        </div>
      )}

      {decodeError && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', padding: '12px', borderRadius: '6px', marginTop: '24px', fontSize: '12px', color: '#ef4444' }}>
          <ShieldAlert size={16} style={{ flexShrink: 0 }} />
          <span>{decodeError}</span>
        </div>
      )}

      {/* Hidden processing canvas */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}
