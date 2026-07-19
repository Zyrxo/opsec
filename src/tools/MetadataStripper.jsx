import React, { useState, useRef } from 'react';
import * as exifr from 'exifr';

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
  dropzone: {
    border: '2px dashed rgba(255,255,255,0.2)',
    borderRadius: '12px',
    padding: '48px 24px',
    textAlign: 'center',
    cursor: 'pointer',
    background: 'rgba(255,255,255,0.02)',
    transition: 'all 0.2s ease',
    marginBottom: '24px'
  },
  dropzoneActive: {
    borderColor: '#10b981',
    background: 'rgba(16, 185, 129, 0.05)'
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
    display: 'inline-block',
    marginTop: '16px'
  },
  buttonGhost: {
    background: 'transparent',
    color: '#fff',
    border: '1px solid rgba(255,255,255,0.2)',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 600,
    fontFamily: 'inherit',
    fontSize: '14px',
    marginLeft: '12px'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '16px'
  },
  th: {
    textAlign: 'left',
    padding: '12px',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    color: '#fff'
  },
  td: {
    padding: '12px',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: '13px'
  },
  imagePreview: {
    maxWidth: '100%',
    maxHeight: '300px',
    borderRadius: '8px',
    marginTop: '16px',
    border: '1px solid rgba(255,255,255,0.1)'
  },
  statsRow: {
    display: 'flex',
    gap: '24px',
    marginBottom: '24px',
    background: 'rgba(0,0,0,0.5)',
    padding: '16px',
    borderRadius: '8px'
  },
  statBox: {
    flex: 1
  },
  statValue: {
    color: '#fff',
    fontSize: '24px',
    fontWeight: 600,
    marginTop: '4px'
  }
};

const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export default function MetadataStripper() {
  const [state, setState] = useState('idle'); // idle, loaded, stripped
  const [isDragActive, setIsDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [previewSrc, setPreviewSrc] = useState(null);
  const [strippedBlob, setStrippedBlob] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = async (selectedFile) => {
    if (!selectedFile.type.startsWith('image/')) {
      alert('Please upload an image file.');
      return;
    }
    
    setFile(selectedFile);
    const src = URL.createObjectURL(selectedFile);
    setPreviewSrc(src);
    
    try {
      const parsedData = await exifr.parse(selectedFile, true);
      setMetadata(parsedData || {});
      setState('loaded');
    } catch (err) {
      console.error(err);
      setMetadata({});
      setState('loaded');
    }
  };

  const stripMetadata = () => {
    if (!file || !previewSrc) return;
    
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      
      canvas.toBlob((blob) => {
        setStrippedBlob(blob);
        setState('stripped');
      }, file.type, 1.0);
    };
    img.src = previewSrc;
  };

  const downloadCleanFile = () => {
    if (!strippedBlob) return;
    const url = URL.createObjectURL(strippedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clean_${file.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const reset = () => {
    setState('idle');
    setFile(null);
    setMetadata(null);
    setPreviewSrc(null);
    setStrippedBlob(null);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Image Metadata Stripper</h2>
        <p>Upload an image to view and remove hidden EXIF data (GPS, camera info, dates). All processing happens entirely in your browser.</p>

        {state === 'idle' && (
          <div 
            style={{...styles.dropzone, ...(isDragActive ? styles.dropzoneActive : {})}}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById('fileUpload').click()}
          >
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: '#10b981', marginBottom: '16px'}}>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            <h3 style={{color: '#fff', marginTop: 0}}>Drag & drop an image here</h3>
            <p>or click to select a file</p>
            <input 
              id="fileUpload" 
              type="file" 
              accept="image/*" 
              style={{display: 'none'}} 
              onChange={handleFileInput}
            />
          </div>
        )}

        {(state === 'loaded' || state === 'stripped') && (
          <div>
            <div style={styles.statsRow}>
              <div style={styles.statBox}>
                <div>Original Size</div>
                <div style={styles.statValue}>{formatBytes(file.size)}</div>
              </div>
              {state === 'stripped' && (
                <div style={styles.statBox}>
                  <div>Clean Size</div>
                  <div style={{...styles.statValue, color: '#10b981'}}>{formatBytes(strippedBlob.size)}</div>
                </div>
              )}
            </div>

            <div style={{display: 'flex', gap: '24px', flexWrap: 'wrap'}}>
              <div style={{flex: '1', minWidth: '300px'}}>
                <img src={previewSrc} alt="Preview" style={styles.imagePreview} />
                <div style={{marginTop: '24px'}}>
                  {state === 'loaded' ? (
                    <>
                      <button style={styles.button} onClick={stripMetadata}>Strip EXIF Data</button>
                      <button style={styles.buttonGhost} onClick={reset}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button style={styles.button} onClick={downloadCleanFile}>Download Clean Image</button>
                      <button style={styles.buttonGhost} onClick={reset}>Process Another</button>
                    </>
                  )}
                </div>
              </div>

              <div style={{flex: '2', minWidth: '300px'}}>
                <h3 style={{color: '#fff', marginTop: 0}}>Detected Metadata</h3>
                {state === 'stripped' ? (
                  <div style={{padding: '24px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px', color: '#10b981'}}>
                    All EXIF metadata has been successfully removed.
                  </div>
                ) : metadata && Object.keys(metadata).length > 0 ? (
                  <div style={{overflowX: 'auto'}}>
                    <table style={styles.table}>
                      <thead>
                        <tr>
                          <th style={styles.th}>Property</th>
                          <th style={styles.th}>Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(metadata).map(([key, value]) => {
                          if (typeof value === 'object' && value !== null) {
                            value = JSON.stringify(value);
                          }
                          return (
                            <tr key={key}>
                              <td style={styles.td}>{key}</td>
                              <td style={styles.td}>{String(value)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p>No EXIF metadata found in this image.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
