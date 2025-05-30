# 🎵 Terminal Music Player

A sleek command-line music player that streams music directly from YouTube Music. Built with Node.js for music lovers who prefer the terminal experience.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-green.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ Features

- 🔍 **Search & Stream**: Search and play music directly from YouTube
- 📋 **Playlist Management**: Create and manage playlists on-the-fly
- ⏯️ **Playback Controls**: Play, pause, next, previous, and stop
- 🎯 **Auto-play**: Automatically plays next track in playlist
- 🎨 **Beautiful Interface**: Colorful and intuitive terminal interface
- 🔄 **Loop Support**: Seamlessly loops through your playlist
- 📊 **Track Information**: Display current track details and duration
- 🚀 **Auto MPV Installation**: Automatically installs MPV media player during setup

## 🎬 Demo

```
┌─────────────────────────────────────┐
│         CLI Music Player           │
├─────────────────────────────────────┤
│ ▶ Search and play music           │
│   Show current playlist            │
│   Now playing                      │
│   Play next track                  │
│   Play previous track              │
│   Stop playback                    │
│   Exit                             │
└─────────────────────────────────────┘
```

## 📋 Prerequisites

### 📦 Node.js

Make sure you have Node.js version 18.0.0 or higher installed:

```bash
node --version
```

If you need to install Node.js, visit [nodejs.org](https://nodejs.org/)

### 🎵 MPV Media Player (Auto-Installed)

This application requires MPV media player for audio playback. **MPV will be automatically installed during package installation** on most systems.

**Supported automatic installation methods:**

- **Linux**: apt-get, dnf, yum, pacman
- **macOS**: Homebrew
- **Windows**: Chocolatey, Scoop, Winget

If automatic installation fails, you can:

1. Run the manual installer: `npm run install-mpv`
2. Install MPV manually (see manual installation section below)

## 🚀 Installation

### Global Installation (Recommended)

```bash
npm install -g terminal-music-player
```

During installation, the setup will:

1. ✅ Check system requirements
2. 🔍 Check if MPV is already installed
3. 📦 Automatically install MPV if needed
4. ✅ Verify installation

### Local Installation

```bash
npm install terminal-music-player
```

### Manual MPV Installation (if needed)

If automatic installation fails, you can install MPV manually:

```bash
# If installed globally
npm run install-mpv

# If installed locally
npx terminal-music-player install-mpv
```

#### 🐧 Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install mpv
```

#### 🐧 Linux (Fedora/RHEL/CentOS)

```bash
sudo dnf install mpv
# or for older versions:
sudo yum install mpv
```

#### 🐧 Linux (Arch Linux)

```bash
sudo pacman -S mpv
```

#### 🍎 macOS

Using Homebrew (recommended):

```bash
brew install mpv
```

Using MacPorts:

```bash
sudo port install mpv
```

#### 🪟 Windows

**Option 1: Using Chocolatey (Recommended)**

```powershell
choco install mpv
```

**Option 2: Using Scoop**

```powershell
scoop install mpv
```

**Option 3: Using Winget**

```powershell
winget install mpv-player.mpv
```

**Option 4: Manual Installation**

1. Download MPV from [https://mpv.io/installation/](https://mpv.io/installation/)
2. Extract the archive to a folder (e.g., `C:\mpv`)
3. Add the MPV folder to your system PATH environment variable

## 🎯 Usage

### Global Installation

Simply run:

```bash
tmusic
```

### Local Installation

```bash
npx terminal-music-player
```

## 🎮 How to Use

1. **Launch the application**: Run `tmusic` in your terminal
2. **Search for music**: Select "Search and play music" and enter your search query
3. **Select a track**: Choose from the search results
4. **Control playback**: Use the menu options to control playback:
   - **Next/Previous**: Navigate through your playlist
   - **Now Playing**: See current track information
   - **Show Playlist**: View your current playlist
   - **Stop**: Stop current playback
   - **Exit**: Quit the application

### 🎵 Example Workflow

```bash
$ tmusic

CLI Music Player

? Music Player Menu (Use arrow keys)
❯ Search and play music
  Show current playlist
  Now playing
  Play next track
  Play previous track
  Stop playback
  Exit

? Enter search query: bohemian rhapsody queen

? Select a track to play: (Use arrow keys)
❯ Bohemian Rhapsody - Queen (5:55)
  Bohemian Rhapsody (Remastered 2011) - Queen (5:54)
  Queen - Bohemian Rhapsody (Official Video) - Queen (5:55)
  Cancel

Now Playing: Bohemian Rhapsody - Queen
Duration: 5:55
```

## 🔧 Troubleshooting

### MPV Not Found Error

If you get an "MPV not found" error:

1. **Try automatic installation**:

   - Restart the music player: `tmusic`
   - It will prompt you to install MPV automatically
   - Or run manual installer: `npm run install-mpv`

2. **Verify MPV installation**:

   ```bash
   mpv --version
   ```

3. **Check PATH**: Make sure MPV is in your system PATH

   - Linux/macOS: Add MPV location to `~/.bashrc` or `~/.zshrc`
   - Windows: Add MPV folder to Environment Variables PATH

4. **Manual installation**: Follow the manual installation instructions above

### Installation Issues

- **Permission denied**: Run with appropriate permissions for your package manager
- **Package manager not found**: Install a supported package manager first
- **Network issues**: Ensure stable internet connection during installation
- **Antivirus blocking**: Some antivirus software may block automatic installations

### Network Issues

- Ensure you have a stable internet connection
- Some regions may have restrictions on YouTube access
- Try using a VPN if you encounter access issues

### Audio Issues

- Check your system's audio settings
- Ensure your audio drivers are up to date
- Test MPV directly: `mpv https://www.youtube.com/watch?v=dQw4w9WgXcQ`

### Permission Issues (Linux/macOS)

If you get permission errors:

```bash
sudo chown -R $(whoami) ~/.npm
```

## ⚠️ Legal Disclaimer

This tool is for educational and personal use only. Please respect YouTube's Terms of Service and copyright laws. The authors are not responsible for any misuse of this software.

## 🔗 Links

- [NPM Package](https://www.npmjs.com/package/terminal-music-player)

- [MPV Official Website](https://mpv.io/)

## 🙏 Acknowledgments

- [MPV Media Player](https://mpv.io/) - For excellent media playback
- [YTMusic API](https://github.com/nicklaw5/ytmusic-api) - For YouTube Music integration
- [Inquirer.js](https://github.com/SBoudrias/Inquirer.js) - For beautiful CLI prompts
- [Chalk](https://github.com/chalk/chalk) - For terminal colors

## 📊 Stats

- **Package Size**: < 1MB
- **Dependencies**: Minimal and secure
- **Platform Support**: Windows, macOS, Linux
- **Node.js**: >= 18.0.0

---

Made with ❤️ for music lovers who live in the terminal.

**Happy Listening! 🎧**
