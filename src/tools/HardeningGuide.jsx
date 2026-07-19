import React, { useState, useEffect } from 'react';

const checklists = {
  Windows: {
    'Disk Encryption': [
      { 
        id: 'win_disk_1', 
        label: 'Enable BitLocker',
        verifyCmd: 'Get-BitLockerVolume',
        instructions: '1. Open the Start menu and type "Manage BitLocker".\n2. Select your main drive and click "Turn on BitLocker".\n3. Follow the wizard and securely back up your recovery key.'
      },
      { 
        id: 'win_disk_2', 
        label: 'Encrypt USB drives',
        verifyCmd: 'Get-BitLockerVolume -MountPoint "E:" (replace E with your drive letter)',
        instructions: '1. Insert the USB drive.\n2. Open "This PC", right-click the USB drive, and select "Turn on BitLocker".\n3. Set a strong password.'
      }
    ],
    'Firewall': [
      { 
        id: 'win_firewall_1', 
        label: 'Enable Windows Firewall',
        verifyCmd: 'Get-NetFirewallProfile | Format-Table Name, Enabled',
        instructions: '1. Press Win + R, type "control firewall.cpl", and hit Enter.\n2. Click "Turn Windows Defender Firewall on or off" on the left.\n3. Ensure it is turned on for both Private and Public networks.'
      },
      { 
        id: 'win_firewall_2', 
        label: 'Block inbound by default',
        verifyCmd: 'Get-NetFirewallProfile | Select-Object Name, DefaultInboundAction',
        instructions: '1. Open "Windows Defender Firewall with Advanced Security".\n2. Click "Windows Defender Firewall Properties".\n3. Set "Inbound connections" to "Block" for Domain, Private, and Public profiles.'
      },
      { 
        id: 'win_firewall_3', 
        label: 'Disable Remote Desktop',
        verifyCmd: 'Get-ItemProperty "HKLM:\\System\\CurrentControlSet\\Control\\Terminal Server" -Name "fDenyTSConnections"',
        instructions: '1. Press Win + I to open Settings.\n2. Navigate to System > Remote Desktop.\n3. Toggle "Enable Remote Desktop" to Off.'
      }
    ],
    'Updates': [
      { 
        id: 'win_updates_1', 
        label: 'Enable automatic updates',
        verifyCmd: 'Get-Service wuauserv | Select-Object Status, StartType',
        instructions: '1. Open Settings > Windows Update.\n2. Click "Advanced options".\n3. Ensure "Receive updates for other Microsoft products" and automatic downloads are enabled.'
      },
      { 
        id: 'win_updates_2', 
        label: 'Update drivers',
        verifyCmd: 'driverquery',
        instructions: '1. Open Device Manager (Win + X > Device Manager).\n2. Right-click hardware components and select "Update driver".\n3. Choose "Search automatically for drivers".'
      }
    ],
    'Privacy': [
      { 
        id: 'win_priv_1', 
        label: 'Disable telemetry',
        verifyCmd: 'Get-ItemProperty "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection" -Name "AllowTelemetry" -ErrorAction SilentlyContinue',
        instructions: '1. Open Settings > Privacy & security > Diagnostics & feedback.\n2. Turn off "Send optional diagnostic data".'
      },
      { 
        id: 'win_priv_2', 
        label: 'Disable Cortana',
        verifyCmd: 'Get-AppxPackage -allusers Microsoft.549981C3F5F10 | Remove-AppxPackage',
        instructions: '1. Open Settings > Apps > Installed apps.\n2. Find Cortana, click the three dots, and select "Uninstall" (if available) or disable it in Task Manager Startup.'
      },
      { 
        id: 'win_priv_3', 
        label: 'Disable advertising ID',
        verifyCmd: 'Get-ItemProperty "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\AdvertisingInfo" -Name "Enabled" -ErrorAction SilentlyContinue',
        instructions: '1. Open Settings > Privacy & security > General.\n2. Toggle off "Let apps show me personalized ads by using my advertising ID".'
      },
      { 
        id: 'win_priv_4', 
        label: 'Review app permissions',
        verifyCmd: 'Get-AppxPackage | Select-Object Name',
        instructions: '1. Open Settings > Privacy & security.\n2. Scroll down to App permissions.\n3. Review Location, Camera, Microphone, etc., and turn off unnecessary access.'
      }
    ],
    'Browser': [
      { 
        id: 'win_browser_1', 
        label: 'Use Firefox/Brave',
        verifyCmd: 'Get-ItemProperty "HKCU:\\Software\\Microsoft\\Windows\\Shell\\Associations\\UrlAssociations\\http\\UserChoice" | Select-Object ProgId',
        instructions: '1. Download and install Firefox or Brave.\n2. Go to Settings > Apps > Default apps.\n3. Set your new browser as the default.'
      },
      { 
        id: 'win_browser_2', 
        label: 'Enable HTTPS-Only',
        verifyCmd: 'echo "Check browser settings manually"',
        instructions: '1. Open your browser settings.\n2. Search for "HTTPS".\n3. Enable "HTTPS-Only Mode" or "Always use secure connections".'
      },
      { 
        id: 'win_browser_3', 
        label: 'Install uBlock Origin',
        verifyCmd: 'echo "Check browser extensions"',
        instructions: '1. Go to your browser\'s extension store.\n2. Search for "uBlock Origin".\n3. Click "Add to browser".'
      },
      { 
        id: 'win_browser_4', 
        label: 'Disable WebRTC',
        verifyCmd: 'echo "Check browser settings/flags"',
        instructions: '1. In Brave: Settings > Shields > WebRTC IP Handling > Disable non-proxied UDP.\n2. In Firefox: about:config > media.peerconnection.enabled > set to false.'
      }
    ],
    'Network': [
      { 
        id: 'win_net_1', 
        label: 'Use DNS over HTTPS (1.1.1.1 or 9.9.9.9)',
        verifyCmd: 'Get-DnsClientServerAddress',
        instructions: '1. Open Settings > Network & internet.\n2. Click Wi-Fi or Ethernet > your connection properties.\n3. Edit DNS server assignment, set to Manual, enable IPv4, and enter 1.1.1.1.'
      },
      { 
        id: 'win_net_2', 
        label: 'Disable Wi-Fi auto-connect',
        verifyCmd: 'netsh wlan show profiles',
        instructions: '1. Open Settings > Network & internet > Wi-Fi > Manage known networks.\n2. Click your network.\n3. Uncheck "Connect automatically when in range".'
      },
      { 
        id: 'win_net_3', 
        label: 'Use VPN',
        verifyCmd: 'Get-NetAdapter | Where-Object {$_.InterfaceDescription -match "TAP|VPN|WireGuard"}',
        instructions: '1. Choose a reputable VPN provider (e.g., Mullvad, ProtonVPN).\n2. Download and install their client.\n3. Connect and ensure the kill switch is enabled.'
      }
    ]
  },
  macOS: {
    'Disk': [
      { 
        id: 'mac_disk_1', 
        label: 'Enable FileVault',
        verifyCmd: 'fdesetup status',
        instructions: '1. Open System Settings > Privacy & Security.\n2. Scroll to FileVault.\n3. Click "Turn On" and securely store your recovery key.'
      },
      { 
        id: 'mac_disk_2', 
        label: 'Secure empty trash',
        verifyCmd: 'rm -P /path/to/file (to securely remove a file)',
        instructions: 'Apple removed "Secure Empty Trash" for SSDs. To ensure data is gone, enable FileVault so deleted data is encrypted and inaccessible.'
      }
    ],
    'Firewall': [
      { 
        id: 'mac_firewall_1', 
        label: 'Enable firewall',
        verifyCmd: '/usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate',
        instructions: '1. Open System Settings > Network > Firewall.\n2. Toggle it on.'
      },
      { 
        id: 'mac_firewall_2', 
        label: 'Enable stealth mode',
        verifyCmd: '/usr/libexec/ApplicationFirewall/socketfilterfw --getstealthmode',
        instructions: '1. Open System Settings > Network > Firewall.\n2. Click "Options".\n3. Turn on "Enable stealth mode".'
      }
    ],
    'Updates': [
      { 
        id: 'mac_updates_1', 
        label: 'Enable automatic updates',
        verifyCmd: 'defaults read /Library/Preferences/com.apple.SoftwareUpdate AutomaticCheckEnabled',
        instructions: '1. Open System Settings > General > Software Update.\n2. Click the info (i) button next to Automatic Updates.\n3. Turn on all options.'
      }
    ],
    'Privacy': [
      { 
        id: 'mac_priv_1', 
        label: 'Disable Siri',
        verifyCmd: 'defaults read com.apple.assistant.support "Assistant Enabled"',
        instructions: '1. Open System Settings > Siri & Spotlight.\n2. Turn off "Ask Siri".'
      },
      { 
        id: 'mac_priv_2', 
        label: 'Disable analytics sharing',
        verifyCmd: 'defaults read /Library/Application\\ Support/CrashReporter/DiagnosticMessagesHistory.plist AutoSubmit',
        instructions: '1. Open System Settings > Privacy & Security > Analytics & Improvements.\n2. Turn off "Share Mac Analytics".'
      },
      { 
        id: 'mac_priv_3', 
        label: 'Review app permissions',
        verifyCmd: 'tccutil reset All (Warning: Resets all permissions)',
        instructions: '1. Open System Settings > Privacy & Security.\n2. Review Location Services, Camera, Microphone, etc.\n3. Remove access for apps that don\'t need it.'
      },
      { 
        id: 'mac_priv_4', 
        label: 'Disable AirDrop for everyone',
        verifyCmd: 'defaults read com.apple.NetworkBrowser DisableAirDrop',
        instructions: '1. Open Control Center (top right icon).\n2. Click AirDrop.\n3. Set to "Contacts Only" or "Receiving Off".'
      }
    ],
    'Browser': [
      { 
        id: 'mac_browser_1', 
        label: 'Use Firefox/Brave',
        verifyCmd: 'defaults read com.apple.LaunchServices/com.apple.launchservices.secure | grep -A 2 "http"',
        instructions: '1. Download and install Firefox or Brave.\n2. Open System Settings > Desktop & Dock.\n3. Set "Default web browser" to your new browser.'
      },
      { 
        id: 'mac_browser_2', 
        label: 'Enable HTTPS-Only',
        verifyCmd: 'echo "Check browser settings manually"',
        instructions: '1. Open your browser settings.\n2. Search for "HTTPS".\n3. Enable "HTTPS-Only Mode".'
      },
      { 
        id: 'mac_browser_3', 
        label: 'Install uBlock Origin',
        verifyCmd: 'echo "Check browser extensions"',
        instructions: '1. Go to your browser\'s extension store.\n2. Search for "uBlock Origin".\n3. Click "Add to browser".'
      },
      { 
        id: 'mac_browser_4', 
        label: 'Disable WebRTC',
        verifyCmd: 'echo "Check browser settings/flags"',
        instructions: '1. In Brave: Settings > Shields > WebRTC IP Handling > Disable non-proxied UDP.\n2. In Firefox: about:config > media.peerconnection.enabled > set to false.'
      }
    ],
    'Network': [
      { 
        id: 'mac_net_1', 
        label: 'Use DNS over HTTPS (1.1.1.1 or 9.9.9.9)',
        verifyCmd: 'networksetup -getdnsservers Wi-Fi',
        instructions: '1. Open System Settings > Network.\n2. Click Wi-Fi > Details > DNS.\n3. Add 1.1.1.1 and 1.0.0.1.'
      },
      { 
        id: 'mac_net_2', 
        label: 'Disable Wi-Fi auto-connect',
        verifyCmd: 'networksetup -getairportnetwork en0',
        instructions: '1. Open System Settings > Network > Wi-Fi.\n2. Click Details next to your network.\n3. Turn off "Auto-Join".'
      },
      { 
        id: 'mac_net_3', 
        label: 'Use VPN',
        verifyCmd: 'scutil --nc list',
        instructions: '1. Choose a reputable VPN provider.\n2. Install their macOS app.\n3. Connect and ensure the kill switch is enabled.'
      }
    ]
  },
  Linux: {
    'Disk': [
      { 
        id: 'lin_disk_1', 
        label: 'Enable LUKS encryption',
        verifyCmd: 'lsblk -f | grep crypto_LUKS',
        instructions: 'Encryption is best enabled during OS installation. To encrypt a non-system partition, use: sudo cryptsetup luksFormat /dev/sdX'
      },
      { 
        id: 'lin_disk_2', 
        label: 'Encrypt swap',
        verifyCmd: 'cat /etc/crypttab | grep swap',
        instructions: '1. Modify /etc/crypttab to map swap with a random key.\n2. Update /etc/fstab to point to the mapped encrypted device.'
      }
    ],
    'Firewall': [
      { 
        id: 'lin_firewall_1', 
        label: 'Configure UFW/iptables',
        verifyCmd: 'sudo ufw status verbose',
        instructions: '1. Open terminal.\n2. Run: sudo ufw enable\n3. Run: sudo ufw status'
      },
      { 
        id: 'lin_firewall_2', 
        label: 'Deny incoming by default',
        verifyCmd: 'sudo ufw status verbose | grep Default',
        instructions: '1. Run: sudo ufw default deny incoming\n2. Run: sudo ufw default allow outgoing'
      }
    ],
    'Updates': [
      { 
        id: 'lin_updates_1', 
        label: 'Enable unattended-upgrades',
        verifyCmd: 'systemctl status unattended-upgrades',
        instructions: '1. Run: sudo apt install unattended-upgrades\n2. Run: sudo dpkg-reconfigure --priority=low unattended-upgrades'
      }
    ],
    'Privacy': [
      { 
        id: 'lin_priv_1', 
        label: 'Disable crash reporting',
        verifyCmd: 'cat /etc/default/apport | grep enabled',
        instructions: '1. Edit /etc/default/apport.\n2. Set enabled=0.\n3. Save and close.'
      },
      { 
        id: 'lin_priv_2', 
        label: 'Audit installed packages',
        verifyCmd: 'dpkg -l',
        instructions: '1. Regularly review installed packages: dpkg -l or rpm -qa.\n2. Remove unused ones: sudo apt autoremove.'
      }
    ],
    'Browser': [
      { 
        id: 'lin_browser_1', 
        label: 'Use Firefox/Brave',
        verifyCmd: 'xdg-settings get default-web-browser',
        instructions: 'Firefox is usually pre-installed. For Brave: follow installation instructions from brave.com/linux.'
      },
      { 
        id: 'lin_browser_2', 
        label: 'Enable HTTPS-Only',
        verifyCmd: 'echo "Check browser settings manually"',
        instructions: '1. Open Firefox preferences.\n2. Go to Privacy & Security.\n3. Scroll down and enable HTTPS-Only Mode.'
      },
      { 
        id: 'lin_browser_3', 
        label: 'Install uBlock Origin',
        verifyCmd: 'echo "Check browser extensions"',
        instructions: '1. Go to Firefox Add-ons.\n2. Search for uBlock Origin.\n3. Add to Firefox.'
      },
      { 
        id: 'lin_browser_4', 
        label: 'Disable WebRTC',
        verifyCmd: 'echo "Check browser flags"',
        instructions: '1. Type about:config in Firefox address bar.\n2. Search media.peerconnection.enabled.\n3. Toggle to false.'
      },
      { 
        id: 'lin_browser_5', 
        label: 'Use Tor Browser for sensitive tasks',
        verifyCmd: 'tor --version',
        instructions: '1. Download Tor Browser from torproject.org.\n2. Extract and run start-tor-browser.desktop.'
      }
    ],
    'Network': [
      { 
        id: 'lin_net_1', 
        label: 'Use DNS over HTTPS (1.1.1.1 or 9.9.9.9)',
        verifyCmd: 'resolvectl status',
        instructions: '1. Edit /etc/systemd/resolved.conf.\n2. Set DNS=1.1.1.1 1.0.0.1 and DNSOverTLS=yes.\n3. Run: sudo systemctl restart systemd-resolved.'
      },
      { 
        id: 'lin_net_2', 
        label: 'Disable Wi-Fi auto-connect',
        verifyCmd: 'nmcli connection show',
        instructions: '1. Use nmcli or network manager GUI.\n2. Edit connection settings and uncheck "Connect automatically".'
      },
      { 
        id: 'lin_net_3', 
        label: 'Use VPN',
        verifyCmd: 'ip a | grep -E "tun|tap|wg"',
        instructions: '1. Install OpenVPN or WireGuard or a VPN provider app.\n2. Configure and connect.'
      },
      { 
        id: 'lin_net_4', 
        label: 'Configure MAC address randomization',
        verifyCmd: 'cat /etc/NetworkManager/NetworkManager.conf',
        instructions: '1. Edit /etc/NetworkManager/NetworkManager.conf.\n2. Add under [device]: wifi.scan-rand-mac-address=yes.\n3. Restart NetworkManager.'
      }
    ]
  }
};

export default function HardeningGuide() {
  const [activeTab, setActiveTab] = useState('Windows');
  const [completed, setCompleted] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem('opsec_hardening_completed');
    if (saved) {
      setCompleted(JSON.parse(saved));
    }
  }, []);

  const toggleItem = (id) => {
    const newCompleted = { ...completed, [id]: !completed[id] };
    setCompleted(newCompleted);
    localStorage.setItem('opsec_hardening_completed', JSON.stringify(newCompleted));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Command copied to clipboard!');
  };

  const currentChecklist = checklists[activeTab];
  let totalItems = 0;
  let completedItems = 0;

  Object.values(currentChecklist).forEach(items => {
    items.forEach(item => {
      totalItems++;
      if (completed[item.id]) completedItems++;
    });
  });

  const overallProgress = totalItems === 0 ? 0 : Math.round((completedItems / totalItems) * 100);

  return (
    <div style={{ padding: '24px', fontFamily: '"Inter", sans-serif', color: '#a3a3a3', background: '#030303', minHeight: '100vh' }}>
      <h1 style={{ color: '#fff', fontSize: '24px', marginBottom: '8px' }}>OS Hardening Guide</h1>
      <p style={{ marginBottom: '24px' }}>Step-by-step checklists to secure your operating system.</p>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {['Windows', 'macOS', 'Linux'].map(os => (
          <button
            key={os}
            onClick={() => setActiveTab(os)}
            style={{
              background: activeTab === os ? '#10b981' : 'transparent',
              color: activeTab === os ? '#000' : '#a3a3a3',
              border: activeTab === os ? 'none' : '1px solid rgba(255,255,255,0.2)',
              padding: '8px 24px',
              borderRadius: '20px',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '14px',
              transition: 'all 0.2s ease'
            }}
          >
            {os}
          </button>
        ))}
      </div>

      <div style={{ background: 'linear-gradient(to bottom, #0a0a0a, #040404)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '12px', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ color: '#fff', fontSize: '18px', margin: 0 }}>{activeTab} Hardening Progress</h2>
          <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '18px' }}>{overallProgress}%</span>
        </div>
        <div style={{ height: '8px', background: '#222', borderRadius: '4px', overflow: 'hidden', marginBottom: '32px' }}>
          <div style={{ height: '100%', background: '#10b981', width: `${overallProgress}%`, transition: 'width 0.3s ease' }}></div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {Object.entries(currentChecklist).map(([category, items]) => {
            const catTotal = items.length;
            const catCompleted = items.filter(item => completed[item.id]).length;
            const catProgress = Math.round((catCompleted / catTotal) * 100);

            return (
              <div key={category}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '8px' }}>
                  <h3 style={{ color: '#fff', fontSize: '16px', margin: 0 }}>{category}</h3>
                  <span style={{ fontSize: '12px', color: catProgress === 100 ? '#10b981' : '#a3a3a3' }}>{catProgress}% completed</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {items.map(item => (
                    <div key={item.id} style={{ background: completed[item.id] ? 'rgba(16, 185, 129, 0.05)' : 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '8px', padding: '16px', transition: 'background 0.2s' }}>
                      <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer', marginBottom: '12px' }}>
                        <input
                          type="checkbox"
                          checked={completed[item.id] || false}
                          onChange={() => toggleItem(item.id)}
                          style={{ width: '18px', height: '18px', accentColor: '#10b981', marginTop: '2px' }}
                        />
                        <span style={{ color: completed[item.id] ? '#10b981' : '#fff', textDecoration: completed[item.id] ? 'line-through' : 'none', fontSize: '15px', fontWeight: '500' }}>{item.label}</span>
                      </label>

                      <div style={{ paddingLeft: '30px' }}>
                        <div style={{ marginBottom: '12px' }}>
                          <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Verify via Terminal</div>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <code style={{ flex: 1, background: '#000', padding: '8px 12px', borderRadius: '4px', fontSize: '12px', color: '#10b981', fontFamily: '"JetBrains Mono", monospace', wordBreak: 'break-all' }}>
                              {item.verifyCmd}
                            </code>
                            <button onClick={() => copyToClipboard(item.verifyCmd)} style={{ background: '#222', border: 'none', color: '#fff', padding: '0 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Copy</button>
                          </div>
                        </div>

                        <div>
                          <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Instructions</div>
                          <div style={{ fontSize: '13px', lineHeight: '1.5', whiteSpace: 'pre-line' }}>
                            {item.instructions}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
