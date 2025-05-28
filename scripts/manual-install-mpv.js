#!/usr/bin/env node

/**
 * Standalone MPV installer for terminal-music-player
 * Can be run independently to install MPV
 */

import MPVInstaller from './install-mpv.js';

async function main() {
  const installer = new MPVInstaller();
  
  console.log('🎵 Manual MPV Installation for Terminal Music Player\n');
  
  await installer.checkSystemRequirements();
  
  const success = await installer.install();
  
  if (success) {
    console.log('\n🎉 MPV installation completed successfully!');
    console.log('You can now use the terminal music player with: tmusic');
  } else {
    console.log('\n❌ MPV installation failed.');
    console.log('Please check the manual installation instructions above.');
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
}); 