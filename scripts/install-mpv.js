#!/usr/bin/env node

import { spawn, exec } from 'child_process';
import { promisify } from 'util';
import which from 'which';
import chalk from 'chalk';
import ora from 'ora';
import os from 'os';

const execAsync = promisify(exec);

class MPVInstaller {
  constructor() {
    this.platform = os.platform();
    this.arch = os.arch();
  }

  async checkMPVInstalled() {
    try {
      await which('mpv');
      return true;
    } catch (error) {
      return false;
    }
  }

  async checkPackageManager() {
    const managers = {
      brew: 'brew',
      apt: 'apt-get',
      dnf: 'dnf',
      yum: 'yum',
      pacman: 'pacman',
      choco: 'choco',
      scoop: 'scoop',
      winget: 'winget'
    };

    for (const [name, command] of Object.entries(managers)) {
      try {
        await which(command);
        return name;
      } catch (error) {
        continue;
      }
    }
    return null;
  }

  async installMPVLinux(packageManager) {
    const commands = {
      apt: 'sudo apt-get update && sudo apt-get install -y mpv',
      dnf: 'sudo dnf install -y mpv',
      yum: 'sudo yum install -y mpv',
      pacman: 'sudo pacman -S --noconfirm mpv'
    };

    const command = commands[packageManager];
    if (!command) {
      throw new Error(`Unsupported package manager: ${packageManager}`);
    }

    console.log(chalk.yellow(`Installing MPV using ${packageManager}...`));
    console.log(chalk.gray(`Command: ${command}`));
    
    return new Promise((resolve, reject) => {
      const child = spawn('sh', ['-c', command], { 
        stdio: 'inherit',
        env: { ...process.env }
      });

      child.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Installation failed with code ${code}`));
        }
      });

      child.on('error', (error) => {
        reject(error);
      });
    });
  }

  async installMPVMacOS(packageManager) {
    const commands = {
      brew: 'brew install mpv'
    };

    const command = commands[packageManager];
    if (!command) {
      throw new Error(`Unsupported package manager: ${packageManager}. Please install Homebrew first.`);
    }

    console.log(chalk.yellow('Installing MPV using Homebrew...'));
    console.log(chalk.gray(`Command: ${command}`));
    
    return new Promise((resolve, reject) => {
      const child = spawn('sh', ['-c', command], { 
        stdio: 'inherit',
        env: { ...process.env }
      });

      child.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Installation failed with code ${code}`));
        }
      });

      child.on('error', (error) => {
        reject(error);
      });
    });
  }

  async installMPVWindows(packageManager) {
    const commands = {
      choco: 'choco install mpv -y',
      scoop: 'scoop install mpv',
      winget: 'winget install --id=mpv-player.mpv -e'
    };

    const command = commands[packageManager];
    if (!command) {
      throw new Error(`Unsupported package manager: ${packageManager}`);
    }

    console.log(chalk.yellow(`Installing MPV using ${packageManager}...`));
    console.log(chalk.gray(`Command: ${command}`));
    
    return new Promise((resolve, reject) => {
      const child = spawn('cmd', ['/c', command], { 
        stdio: 'inherit',
        env: { ...process.env }
      });

      child.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Installation failed with code ${code}`));
        }
      });

      child.on('error', (error) => {
        reject(error);
      });
    });
  }

  async install() {
    const spinner = ora('Checking MPV installation...').start();

    try {
      const isInstalled = await this.checkMPVInstalled();
      
      if (isInstalled) {
        spinner.succeed(chalk.green('MPV is already installed!'));
        
        // Verify version
        try {
          const { stdout } = await execAsync('mpv --version');
          const version = stdout.split('\n')[0];
          console.log(chalk.gray(`${version}`));
        } catch (error) {
          console.log(chalk.gray('MPV version check failed, but MPV is available.'));
        }
        return true;
      }

      spinner.text = 'MPV not found. Checking package managers...';
      
      const packageManager = await this.checkPackageManager();
      
      if (!packageManager) {
        spinner.fail(chalk.red('No supported package manager found!'));
        this.printManualInstructions();
        return false;
      }

      spinner.succeed(chalk.yellow(`Found package manager: ${packageManager}`));
      
      console.log(chalk.blue.bold('\n🎵 Installing MPV Media Player...'));
      console.log(chalk.gray('MPV is required for audio playback in the terminal music player.'));
      
      if (this.platform === 'win32') {
        await this.installMPVWindows(packageManager);
      } else if (this.platform === 'darwin') {
        await this.installMPVMacOS(packageManager);
      } else {
        await this.installMPVLinux(packageManager);
      }

      // Verify installation
      const finalSpinner = ora('Verifying MPV installation...').start();
      const isNowInstalled = await this.checkMPVInstalled();
      
      if (isNowInstalled) {
        finalSpinner.succeed(chalk.green('MPV installed successfully!'));
        
        try {
          const { stdout } = await execAsync('mpv --version');
          const version = stdout.split('\n')[0];
          console.log(chalk.gray(`${version}`));
        } catch (error) {
          console.log(chalk.gray('MPV installed but version check failed.'));
        }
        
        console.log(chalk.green.bold('\n✅ Setup complete! You can now use the terminal music player.'));
        return true;
      } else {
        finalSpinner.fail(chalk.red('MPV installation verification failed!'));
        this.printManualInstructions();
        return false;
      }

    } catch (error) {
      spinner.fail(chalk.red('Installation failed!'));
      console.error(chalk.red('Error:'), error.message);
      this.printManualInstructions();
      return false;
    }
  }

  printManualInstructions() {
    console.log(chalk.yellow.bold('\n📋 Manual Installation Required'));
    console.log(chalk.white('Please install MPV manually using the appropriate method for your system:\n'));

    if (this.platform === 'win32') {
      console.log(chalk.cyan('Windows:'));
      console.log(chalk.white('• Chocolatey: ') + chalk.gray('choco install mpv'));
      console.log(chalk.white('• Scoop: ') + chalk.gray('scoop install mpv'));
      console.log(chalk.white('• Winget: ') + chalk.gray('winget install mpv-player.mpv'));
      console.log(chalk.white('• Manual: ') + chalk.gray('Download from https://mpv.io/installation/'));
    } else if (this.platform === 'darwin') {
      console.log(chalk.cyan('macOS:'));
      console.log(chalk.white('• Homebrew: ') + chalk.gray('brew install mpv'));
      console.log(chalk.white('• MacPorts: ') + chalk.gray('sudo port install mpv'));
    } else {
      console.log(chalk.cyan('Linux:'));
      console.log(chalk.white('• Ubuntu/Debian: ') + chalk.gray('sudo apt-get install mpv'));
      console.log(chalk.white('• Fedora/RHEL: ') + chalk.gray('sudo dnf install mpv'));
      console.log(chalk.white('• Arch Linux: ') + chalk.gray('sudo pacman -S mpv'));
    }

    console.log(chalk.gray('\nAfter installation, run the music player again with: ') + chalk.white('tmusic'));
  }

  async checkSystemRequirements() {
    console.log(chalk.blue.bold('🔍 Checking system requirements...\n'));
    
    // Check Node.js version
    const nodeVersion = process.version;
    const requiredNodeVersion = '18.0.0';
    
    if (nodeVersion.slice(1).split('.')[0] >= 18) {
      console.log(chalk.green('✅ Node.js version:'), chalk.white(nodeVersion));
    } else {
      console.log(chalk.red('❌ Node.js version:'), chalk.white(nodeVersion));
      console.log(chalk.red(`   Required: >= ${requiredNodeVersion}`));
    }

    // Check platform
    console.log(chalk.green('✅ Platform:'), chalk.white(`${this.platform} (${this.arch})`));
    
    // Check internet connectivity (basic)
    try {
      await execAsync('ping -c 1 google.com', { timeout: 5000 });
      console.log(chalk.green('✅ Internet connection: Available'));
    } catch (error) {
      console.log(chalk.yellow('⚠️  Internet connection: Could not verify'));
    }

    console.log(''); // Empty line
  }
}

// Main execution
async function main() {
  console.log(chalk.blue.bold('🎵 Terminal Music Player - Setup\n'));
  
  const installer = new MPVInstaller();
  
  await installer.checkSystemRequirements();
  
  const success = await installer.install();
  
  if (success) {
    console.log(chalk.green.bold('\n🎉 Installation completed successfully!'));
    console.log(chalk.white('Run ') + chalk.cyan('tmusic') + chalk.white(' to start the music player.'));
  } else {
    console.log(chalk.red.bold('\n❌ Installation incomplete.'));
    console.log(chalk.white('Please install MPV manually and try again.'));
    process.exit(1);
  }
}

// Only run if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(chalk.red('Fatal error:'), error);
    process.exit(1);
  });
}

export default MPVInstaller; 