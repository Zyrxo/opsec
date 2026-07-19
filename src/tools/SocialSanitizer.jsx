import React, { useState, useEffect } from 'react';

const PlatformIcon = ({ paths, isHovered, color }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill={isHovered ? color : '#a3a3a3'} style={{ transition: 'fill 0.2s ease', display: 'block' }}>
    {paths.map((p, i) => (
      <path key={i} d={p} />
    ))}
  </svg>
);

const platforms = [
  {
    name: 'Facebook',
    iconPaths: ['M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z'],
    color: '#1877F2',
    tasks: [
      { id: 'fb_1', label: 'Make profile private', desc: 'Restrict profile visibility to friends only.', url: 'https://www.facebook.com/settings?tab=privacy' },
      { id: 'fb_2', label: 'Remove phone number', desc: 'Prevent finding your account via phone number.', url: 'https://www.facebook.com/settings?tab=mobile' },
      { id: 'fb_3', label: 'Disable face recognition', desc: 'Stop Facebook from scanning photos for your face.', url: 'https://www.facebook.com/settings?tab=facerec' },
      { id: 'fb_4', label: 'Review tagged photos', desc: 'Remove tags from unwanted photos.', url: 'https://www.facebook.com/settings?tab=timeline' },
      { id: 'fb_5', label: 'Delete old posts', desc: 'Archive or delete old timeline posts.', url: 'https://www.facebook.com/settings?tab=privacy' },
      { id: 'fb_6', label: 'Disable location history', desc: 'Turn off location tracking.', url: 'https://www.facebook.com/settings?tab=location' },
      { id: 'fb_7', label: 'Review app permissions', desc: 'Remove third-party apps accessing your data.', url: 'https://www.facebook.com/settings?tab=applications' },
      { id: 'fb_8', label: 'Disable off-Facebook activity', desc: 'Stop tracking outside of Facebook.', url: 'https://www.facebook.com/off_facebook_activity/' }
    ]
  },
  {
    name: 'Instagram',
    iconPaths: ['M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z'],
    color: '#E4405F',
    tasks: [
      { id: 'ig_1', label: 'Switch to private account', desc: 'Only approved followers can see posts.', url: 'https://www.instagram.com/accounts/privacy_and_security/' },
      { id: 'ig_2', label: 'Disable activity status', desc: 'Hide when you are online.', url: 'https://www.instagram.com/accounts/privacy_and_security/' },
      { id: 'ig_3', label: 'Restrict story sharing', desc: 'Prevent others from sharing your stories.', url: 'https://www.instagram.com/accounts/privacy_and_security/' },
      { id: 'ig_4', label: 'Remove linked accounts', desc: 'Disconnect Facebook/Twitter.', url: 'https://www.instagram.com/accounts/edit/' },
      { id: 'ig_5', label: 'Review tagged posts', desc: 'Manually approve tags.', url: 'https://www.instagram.com/accounts/privacy_and_security/' },
      { id: 'ig_6', label: 'Disable data sharing', desc: 'Limit data sent to partners.', url: 'https://www.instagram.com/accounts/privacy_and_security/' }
    ]
  },
  {
    name: 'Twitter/X',
    iconPaths: ['M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z'],
    color: '#fff', // X is black/white
    tasks: [
      { id: 'tw_1', label: 'Protect tweets', desc: 'Make tweets private to followers only.', url: 'https://twitter.com/settings/audience_and_tagging' },
      { id: 'tw_2', label: 'Disable location tagging', desc: 'Remove location from tweets.', url: 'https://twitter.com/settings/location' },
      { id: 'tw_3', label: 'Review connected apps', desc: 'Revoke access to unused apps.', url: 'https://twitter.com/settings/connected_apps' },
      { id: 'tw_4', label: 'Enable 2FA', desc: 'Secure your account with two-factor auth.', url: 'https://twitter.com/settings/security' },
      { id: 'tw_5', label: 'Disable personalization', desc: 'Turn off personalized ads and data sharing.', url: 'https://twitter.com/settings/personalization' },
      { id: 'tw_6', label: 'Remove phone number', desc: 'Remove phone number for privacy.', url: 'https://twitter.com/settings/phone' }
    ]
  },
  {
    name: 'LinkedIn',
    iconPaths: ['M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z'],
    color: '#0A66C2',
    tasks: [
      { id: 'li_1', label: 'Restrict profile visibility', desc: 'Hide profile from search engines.', url: 'https://www.linkedin.com/psettings/profile-visibility' },
      { id: 'li_2', label: 'Disable activity broadcasts', desc: 'Don\'t notify network of profile changes.', url: 'https://www.linkedin.com/psettings/activity-broadcast' },
      { id: 'li_3', label: 'Review email preferences', desc: 'Limit emails received and visible.', url: 'https://www.linkedin.com/psettings/communications' },
      { id: 'li_4', label: 'Remove phone number', desc: 'Keep phone number private.', url: 'https://www.linkedin.com/psettings/phone' },
      { id: 'li_5', label: 'Restrict who can see connections', desc: 'Hide your connection list.', url: 'https://www.linkedin.com/psettings/connections-visibility' }
    ]
  },
  {
    name: 'TikTok',
    iconPaths: ['M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.12-3.44-3.17-3.64-5.41-.02-.2-.03-.41-.03-.61-.01-1.22.27-2.43.83-3.51 1.05-1.99 3.06-3.32 5.25-3.51 1.09-.1 2.19.06 3.19.46v4.06c-.46-.2-.96-.28-1.46-.24-.96.06-1.89.6-2.4 1.41-.33.51-.48 1.13-.42 1.74.06.63.35 1.22.81 1.66.72.7 1.77.96 2.75.7 1.04-.26 1.87-1.02 2.22-2.03.18-.53.25-1.1.22-1.66-.05-4.48-.02-8.96-.02-13.44 0-2.14 0-4.28 0-6.42z'],
    color: '#00f2fe', // using a bright cyan for dark mode
    tasks: [
      { id: 'tk_1', label: 'Set account to private', desc: 'Only approved users can follow you.', url: 'https://www.tiktok.com/setting' },
      { id: 'tk_2', label: 'Disable personalized ads', desc: 'Opt out of targeted advertising.', url: 'https://www.tiktok.com/setting' },
      { id: 'tk_3', label: 'Restrict who can duet', desc: 'Set duet permissions to "Only Me".', url: 'https://www.tiktok.com/setting' },
      { id: 'tk_4', label: 'Disable downloads', desc: 'Prevent users from downloading your videos.', url: 'https://www.tiktok.com/setting' },
      { id: 'tk_5', label: 'Review app permissions', desc: 'Check connected apps and services.', url: 'https://www.tiktok.com/setting' }
    ]
  },
  {
    name: 'Reddit',
    iconPaths: ['M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z'],
    color: '#FF4500',
    tasks: [
      { id: 'rd_1', label: 'Review post history', desc: 'Delete old or sensitive posts.', url: 'https://www.reddit.com/settings/data-request' },
      { id: 'rd_2', label: 'Disable tracking', desc: 'Opt out of ad personalization and outbound link tracking.', url: 'https://www.reddit.com/settings/privacy' },
      { id: 'rd_3', label: 'Use anonymous browsing', desc: 'Create throwaway accounts for sensitive topics.', url: 'https://www.reddit.com' },
      { id: 'rd_4', label: 'Review connected apps', desc: 'Revoke access for old apps.', url: 'https://www.reddit.com/prefs/apps/' }
    ]
  },
  {
    name: 'Discord',
    iconPaths: ['M19.271 5.334A20.485 20.485 0 0014.28 3.5a.084.084 0 00-.041.036c-.22.399-.467.925-.634 1.341-1.85-.276-3.69-.276-5.498 0-.17-.416-.425-.942-.648-1.341a.077.077 0 00-.041-.036 20.457 20.457 0 00-4.99 1.834.08.08 0 00-.036.029c-3.155 4.717-4.004 9.309-3.57 13.84a.09.09 0 00.034.066 20.593 20.593 0 006.182 3.123.082.082 0 00.088-.029c.475-.648.898-1.328 1.264-2.04a.084.084 0 00-.046-.118 13.303 13.303 0 01-1.91-.913.085.085 0 01-.008-.14c.128-.095.253-.194.373-.296a.083.083 0 01.086-.013c4.103 1.874 8.528 1.874 12.585 0a.083.083 0 01.086.012c.12.1.246.2.373.297a.085.085 0 01-.008.14 13.3 13.3 0 01-1.91.912.085.085 0 00-.046.119c.368.711.791 1.391 1.265 2.039a.081.081 0 00.088.029 20.575 20.575 0 006.18-3.123.086.086 0 00.034-.066c.49-5.111-.643-9.66-3.576-13.84a.083.083 0 00-.035-.029zM8.02 15.331c-1.182 0-2.148-1.084-2.148-2.418 0-1.333.95-2.417 2.148-2.417 1.21 0 2.164 1.096 2.148 2.417 0 1.334-.954 2.418-2.148 2.418zm7.96 0c-1.183 0-2.148-1.084-2.148-2.418 0-1.333.95-2.417 2.148-2.417 1.21 0 2.164 1.096 2.148 2.417 0 1.334-.938 2.418-2.148 2.418z'],
    color: '#5865F2',
    tasks: [
      { id: 'dc_1', label: 'Enable 2FA', desc: 'Use authenticator app.', url: 'https://discord.com/settings/security' },
      { id: 'dc_2', label: 'Review server permissions', desc: 'Check roles and what data you share in servers.', url: 'https://discord.com/settings/privacy' },
      { id: 'dc_3', label: 'Disable DMs from strangers', desc: 'Only allow friends to message you directly.', url: 'https://discord.com/settings/privacy' },
      { id: 'dc_4', label: 'Review connected accounts', desc: 'Unlink unnecessary accounts (Steam, Spotify, etc).', url: 'https://discord.com/settings/connections' }
    ]
  },
  {
    name: 'Google',
    iconPaths: ['M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z'],
    color: '#DB4437',
    tasks: [
      { id: 'gg_1', label: 'Review privacy checkup', desc: 'Run Google\'s privacy tool.', url: 'https://myaccount.google.com/privacycheckup' },
      { id: 'gg_2', label: 'Disable ad personalization', desc: 'Stop targeted Google ads.', url: 'https://myadcenter.google.com/' },
      { id: 'gg_3', label: 'Delete location history', desc: 'Clear Timeline data.', url: 'https://myactivity.google.com/activitycontrols' },
      { id: 'gg_4', label: 'Review app access', desc: 'Remove old apps from Google account.', url: 'https://myaccount.google.com/permissions' },
      { id: 'gg_5', label: 'Disable web & app activity', desc: 'Stop saving searches and browsing history.', url: 'https://myactivity.google.com/activitycontrols' }
    ]
  }
];

export default function SocialSanitizer() {
  const [completed, setCompleted] = useState({});
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [hoveredPlatform, setHoveredPlatform] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('opsec_social_sanitizer');
    if (saved) {
      setCompleted(JSON.parse(saved));
    }
  }, []);

  const toggleTask = (id) => {
    const newCompleted = { ...completed, [id]: !completed[id] };
    setCompleted(newCompleted);
    localStorage.setItem('opsec_social_sanitizer', JSON.stringify(newCompleted));
  };

  const getPlatformProgress = (platform) => {
    const total = platform.tasks.length;
    const done = platform.tasks.filter(t => completed[t.id]).length;
    return total === 0 ? 0 : Math.round((done / total) * 100);
  };

  const getOverallProgress = () => {
    let total = 0;
    let done = 0;
    platforms.forEach(p => {
      total += p.tasks.length;
      done += p.tasks.filter(t => completed[t.id]).length;
    });
    return total === 0 ? 0 : Math.round((done / total) * 100);
  };

  const overallProgress = getOverallProgress();

  return (
    <div style={{ padding: '24px', fontFamily: '"Inter", sans-serif', color: '#a3a3a3', background: '#030303', minHeight: '100vh' }}>
      <h1 style={{ color: '#fff', fontSize: '24px', marginBottom: '8px' }}>Social Media Sanitizer</h1>
      <p style={{ marginBottom: '24px' }}>Lock down your privacy settings across major platforms.</p>

      <div style={{ background: 'linear-gradient(to bottom, #0a0a0a, #040404)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '12px', padding: '20px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h2 style={{ color: '#fff', fontSize: '16px', margin: 0 }}>Overall Sanitization Score</h2>
          <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '18px' }}>{overallProgress}%</span>
        </div>
        <div style={{ height: '8px', background: '#222', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ height: '100%', background: '#10b981', width: `${overallProgress}%`, transition: 'width 0.3s ease' }}></div>
        </div>
      </div>

      {!selectedPlatform ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
          {platforms.map(platform => {
            const progress = getPlatformProgress(platform);
            const isHovered = hoveredPlatform === platform.name;
            
            return (
              <div 
                key={platform.name} 
                onMouseEnter={() => setHoveredPlatform(platform.name)}
                onMouseLeave={() => setHoveredPlatform(null)}
                style={{ background: 'linear-gradient(to bottom, #0a0a0a, #040404)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', transition: 'all 0.2s ease', transform: isHovered ? 'translateY(-2px)' : 'translateY(0)' }}
              >
                <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)' }}>
                  <PlatformIcon paths={platform.iconPaths} isHovered={isHovered} color={platform.color} />
                </div>
                <h3 style={{ color: isHovered ? platform.color : '#fff', fontSize: '18px', margin: '0 0 16px 0', transition: 'color 0.2s ease' }}>{platform.name}</h3>
                
                <div style={{ width: '100%', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px' }}>
                    <span>Progress</span>
                    <span style={{ color: progress === 100 ? '#10b981' : '#fff' }}>{progress}%</span>
                  </div>
                  <div style={{ height: '6px', background: '#222', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: '#10b981', width: `${progress}%`, transition: 'width 0.3s ease' }}></div>
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedPlatform(platform)}
                  style={{ background: isHovered ? 'rgba(16, 185, 129, 0.1)' : 'transparent', color: '#10b981', border: '1px solid #10b981', padding: '8px 24px', borderRadius: '20px', cursor: 'pointer', fontWeight: '500', width: '100%', transition: 'all 0.2s ease' }}
                >
                  Open Guide
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div>
          <button 
            onClick={() => setSelectedPlatform(null)}
            style={{ background: 'transparent', color: '#a3a3a3', border: 'none', padding: '0 0 20px 0', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            ← Back to Platforms
          </button>
          
          <div style={{ background: 'linear-gradient(to bottom, #0a0a0a, #040404)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '12px', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)' }}>
                <PlatformIcon paths={selectedPlatform.iconPaths} isHovered={true} color={selectedPlatform.color} />
              </div>
              <h2 style={{ color: '#fff', fontSize: '24px', margin: 0 }}>{selectedPlatform.name} Privacy Checklist</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {selectedPlatform.tasks.map(task => (
                <div key={task.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '16px', borderRadius: '8px', background: completed[task.id] ? 'rgba(16, 185, 129, 0.05)' : 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <input
                    type="checkbox"
                    checked={completed[task.id] || false}
                    onChange={() => toggleTask(task.id)}
                    style={{ width: '20px', height: '20px', accentColor: '#10b981', marginTop: '2px', cursor: 'pointer' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ color: completed[task.id] ? '#10b981' : '#fff', fontWeight: '500', fontSize: '16px', marginBottom: '4px', textDecoration: completed[task.id] ? 'line-through' : 'none' }}>
                      {task.label}
                    </div>
                    <div style={{ fontSize: '13px', color: '#a3a3a3', marginBottom: '12px' }}>
                      {task.desc}
                    </div>
                    <a href={task.url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', background: '#222', color: '#fff', textDecoration: 'none', padding: '6px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: '500', transition: 'background 0.2s' }} onMouseEnter={(e) => e.target.style.background = '#333'} onMouseLeave={(e) => e.target.style.background = '#222'}>
                      Open Settings
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
