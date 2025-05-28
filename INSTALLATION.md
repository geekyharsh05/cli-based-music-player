# Automatic MPV Installation System

This document explains how the automatic MPV installation system works in the Terminal Music Player package.

## Overview

The Terminal Music Player now includes an **automatic MPV installation system** that:

- ✅ **Detects** if MPV is already installed
- 🔍 **Identifies** available package managers on the system
- 📦 **Automatically installs** MPV using the appropriate package manager
- ✅ **Verifies** successful installation
- 🚀 **Works seamlessly** during package installation

## How It Works

### 1. Installation Triggers

The MPV installation system is triggered in three scenarios:

#### A. During Package Installation (Automatic)

```bash
npm install -g terminal-music-player
```

- Runs automatically via `postinstall` script
- No user interaction required if MPV is already installed
- Prompts for installation if MPV is missing

#### B. When Starting the Music Player (Runtime Check)

```bash
tmusic
```

- Checks MPV availability before starting
- Prompts user to install if MPV is missing
- Integrates seamlessly with the startup process

#### C. Manual Installation (On-Demand)

```bash
npm run install-mpv
# or
npx terminal-music-player install-mpv
```

- Can be run independently at any time
- Useful for troubleshooting or reinstalling

### 2. Detection Process

The system performs these checks in order:

1. **MPV Availability Check**

   ```javascript
   await which("mpv");
   ```

   - Uses the `which` package to locate MPV in PATH
   - Returns `true` if found, `false` otherwise

2. **Package Manager Detection**

   ```javascript
   const managers = {
     brew: "brew", // macOS
     apt: "apt-get", // Debian/Ubuntu
     dnf: "dnf", // Fedora/RHEL
     yum: "yum", // CentOS/RHEL
     pacman: "pacman", // Arch Linux
     choco: "choco", // Windows Chocolatey
     scoop: "scoop", // Windows Scoop
     winget: "winget", // Windows Winget
   };
   ```

   - Systematically checks for available package managers
   - Returns the first available manager found

3. **System Requirements Check**
   - Node.js version (>= 18.0.0)
   - Operating system platform
   - Internet connectivity (basic ping test)

### 3. Installation Commands by Platform

#### Linux

- **Ubuntu/Debian**: `sudo apt-get update && sudo apt-get install -y mpv`
- **Fedora/RHEL**: `sudo dnf install -y mpv`
- **CentOS/Older RHEL**: `sudo yum install -y mpv`
- **Arch Linux**: `sudo pacman -S --noconfirm mpv`

#### macOS

- **Homebrew**: `brew install mpv`

#### Windows

- **Chocolatey**: `choco install mpv -y`
- **Scoop**: `scoop install mpv`
- **Winget**: `winget install --id=mpv-player.mpv -e`

### 4. Error Handling

The system handles various failure scenarios:

#### Package Manager Not Found

```
❌ No supported package manager found!
📋 Manual Installation Required
Please install MPV manually using the appropriate method for your system:
```

#### Installation Failure

```
❌ Installation failed with code 1
📋 Manual Installation Required
```

#### Permission Issues

```
❌ Installation failed: Permission denied
Please run with appropriate permissions for your package manager
```

#### Network Issues

```
⚠️ Internet connection: Could not verify
```

## Integration Points

### 1. Package.json Configuration

```json
{
  "scripts": {
    "postinstall": "node scripts/install-mpv.js",
    "install-mpv": "node scripts/manual-install-mpv.js"
  },
  "dependencies": {
    "which": "^4.0.0"
  }
}
```

### 2. CLI Integration

The main CLI (`bin/cli.js`) includes:

```javascript
import MPVInstaller from "../scripts/install-mpv.js";

async function handleMPVInstallation() {
  const isMPVAvailable = await checkMPVAvailability();

  if (!isMPVAvailable) {
    // Prompt user for automatic installation
    const installer = new MPVInstaller();
    await installer.install();
  }
}

// Called before initializing the music player
(async () => {
  await handleMPVInstallation();
  await initialize();
  await mainMenu();
})();
```

### 3. Runtime Error Handling

Enhanced MPV error handling in playback:

```javascript
mpvProcess.on("error", (error) => {
  if (error.code === "ENOENT") {
    console.error(
      "MPV not found! It may have been uninstalled or removed from PATH."
    );
    console.log(
      "Please restart the application to reinstall MPV, or install it manually."
    );
  }
});
```

## File Structure

```
terminal-music-player/
├── bin/
│   └── cli.js                    # Main CLI with MPV checks
├── scripts/
│   ├── install-mpv.js           # Main installation logic
│   └── manual-install-mpv.js    # Standalone installer
├── package.json                  # PostInstall script configuration
├── README.md                     # Updated with auto-install info
└── INSTALLATION.md              # This documentation
```

## User Experience

### Successful Installation (MPV Already Present)

```
🎵 Terminal Music Player - Setup

🔍 Checking system requirements...
✅ Node.js version: v18.15.0
✅ Platform: darwin (arm64)
✅ Internet connection: Available

✔ MPV is already installed!
mpv v0.35.1 Copyright © 2000-2023 mpv/MPlayer/mplayer2 projects

🎉 Installation completed successfully!
Run tmusic to start the music player.
```

### New Installation (MPV Missing)

```
🎵 Terminal Music Player - Setup

🔍 Checking system requirements...
✅ Node.js version: v18.15.0
✅ Platform: darwin (arm64)
✅ Internet connection: Available

⚠️ MPV not found. Checking package managers...
✔ Found package manager: brew

🎵 Installing MPV Media Player...
MPV is required for audio playback in the terminal music player.

Installing MPV using Homebrew...
Command: brew install mpv
[... installation output ...]

✔ Verifying MPV installation...
✔ MPV installed successfully!
mpv v0.35.1 Copyright © 2000-2023 mpv/MPlayer/mplayer2 projects

✅ Setup complete! You can now use the terminal music player.
🎉 Installation completed successfully!
Run tmusic to start the music player.
```

### Runtime Check (User Starts App)

```
$ tmusic

⚠️ MPV Media Player not found!
MPV is required for audio playback in the terminal music player.

? Would you like to install MPV automatically now? (Y/n)
```

## Benefits

1. **Zero Configuration**: Users don't need to manually install MPV
2. **Cross-Platform**: Works on Linux, macOS, and Windows
3. **Smart Detection**: Only installs if needed
4. **Fallback Options**: Multiple installation methods per platform
5. **User Choice**: Always asks permission before installing
6. **Robust Error Handling**: Graceful fallback to manual instructions
7. **Verification**: Confirms successful installation
8. **Runtime Recovery**: Can detect and fix missing MPV during usage

## Troubleshooting

### Common Issues

1. **Permission Denied**

   - Solution: Run with appropriate sudo/admin privileges
   - Alternative: Use non-sudo package managers (scoop, brew)

2. **Package Manager Not Found**

   - Solution: Install a supported package manager first
   - Alternative: Follow manual installation instructions

3. **Network Issues**

   - Solution: Check internet connection
   - Alternative: Download MPV manually

4. **Antivirus Blocking**
   - Solution: Temporarily disable antivirus or add exception
   - Alternative: Manual installation

### Manual Override

If automatic installation fails, users can:

1. Run the manual installer: `npm run install-mpv`
2. Follow platform-specific instructions in README.md
3. Download from https://mpv.io/installation/

## Future Enhancements

Potential improvements to the installation system:

1. **Offline Installation**: Bundle MPV binaries for offline use
2. **Version Management**: Install specific MPV versions
3. **Update Notifications**: Notify users of MPV updates
4. **Custom Installation Paths**: Support non-standard MPV locations
5. **Installation Analytics**: Track installation success rates

---

This automatic installation system ensures that users can start enjoying music immediately after installing the terminal music player package, without the friction of manual dependency management.
