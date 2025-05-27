#!/usr/bin/env node

import YTMusic from "ytmusic-api";
import { spawn } from "child_process";
import inquirer from "inquirer";
import chalk from "chalk";

// Initialize YTMusic API
const ytm = new YTMusic();

// MPV player instance
let mpvProcess = null;

// Current playlist
let currentPlaylist = [];
let currentTrackIndex = 0;
let isPlaying = false;
let autoPlay = true; // Flag to control auto-play
let isTransitioning = false; // Prevent multiple simultaneous transitions

// Initialize the YTMusic API
async function initialize() {
  try {
    await ytm.initialize();
    console.log(chalk.green("YTMusic API initialized successfully!"));
  } catch (error) {
    console.error(chalk.red("Error initializing YTMusic API:"), error);
    process.exit(1);
  }
}

// Search for tracks
async function searchTracks(query) {
  try {
    const results = await ytm.search(query);
    return results
      .filter((result) => result.type === "VIDEO" && result.videoId)
      .map((result) => ({
        id: result.videoId,
        title: result.name,
        artist: result.artist?.name || "Unknown Artist",
        duration: formatDuration(result.duration) || "0:00",
        thumbnail: result.thumbnails?.[0]?.url,
      }));
  } catch (error) {
    console.error(chalk.red("Error searching tracks:"), error);
    return [];
  }
}

function formatDuration(seconds) {
  if (!seconds) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// Enhanced cleanup function
function cleanup() {
  console.log(chalk.yellow("\nCleaning up..."));

  if (mpvProcess && !mpvProcess.killed) {
    try {
      // First try SIGTERM for graceful shutdown
      mpvProcess.kill("SIGTERM");

      // If the process doesn't exit within 2 seconds, force kill it
      setTimeout(() => {
        if (mpvProcess && !mpvProcess.killed) {
          console.log(chalk.red("Force killing MPV process..."));
          mpvProcess.kill("SIGKILL");
        }
      }, 2000);
    } catch (error) {
      console.error(chalk.red("Error stopping MPV:"), error.message);
      // Try force kill as fallback
      try {
        mpvProcess.kill("SIGKILL");
      } catch (killError) {
        console.error(chalk.red("Error force killing MPV:"), killError.message);
      }
    }

    mpvProcess = null;
  }

  isPlaying = false;
  isTransitioning = false;
}

// Properly stop the current track
function stopTrack() {
  if (mpvProcess) {
    autoPlay = false; // Prevent auto-play when manually stopping
    cleanup();
  }
}

// Play a track by YouTube ID
function playTrack(trackId) {
  // Prevent multiple simultaneous plays
  if (isTransitioning) {
    console.log(chalk.yellow("Track transition in progress, please wait..."));
    return;
  }

  isTransitioning = true;

  // Stop current track if playing
  if (mpvProcess) {
    mpvProcess.kill("SIGTERM");
    mpvProcess = null;
  }

  const url = `https://www.youtube.com/watch?v=${trackId}`;
  const currentTrack = currentPlaylist[currentTrackIndex];

  console.log(
    chalk.yellow.bold("\nNow Playing:"),
    chalk.white(`${currentTrack.title} - ${currentTrack.artist}`)
  );
  console.log(chalk.gray(`Duration: ${currentTrack.duration}`));

  mpvProcess = spawn("mpv", [
    "--no-video",
    "--quiet",
    "--no-terminal",
    "--audio-display=no",
    "--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    url,
  ]);

  isPlaying = true;
  autoPlay = true; // Enable auto-play for natural playback

  // Add error handling
  mpvProcess.on("error", (error) => {
    console.error(chalk.red("MPV Error:"), error.message);
    isPlaying = false;
    isTransitioning = false;

    // Try next track if auto-play is enabled and there are more tracks
    if (autoPlay && currentPlaylist.length > 1) {
      setTimeout(() => {
        playNext();
      }, 1000);
    }
  });

  mpvProcess.on("close", (code) => {
    isPlaying = false;
    isTransitioning = false;

    if (code === 0) {
      console.log(chalk.gray("\nTrack finished playing"));
    } else if (code !== null) {
      console.log(chalk.red(`\nTrack stopped with code: ${code}`));
    }

    // Only auto-play next track if it finished naturally and auto-play is enabled
    if (autoPlay && code === 0 && currentPlaylist.length > 1) {
      setTimeout(() => {
        playNext();
      }, 500); // Small delay to prevent rapid cycling
    }
  });

  // Clear transition flag after a short delay
  setTimeout(() => {
    isTransitioning = false;
  }, 1000);
}

// Play next track in playlist
function playNext() {
  if (currentPlaylist.length === 0) {
    console.log(chalk.yellow("Playlist is empty"));
    return;
  }

  if (currentPlaylist.length === 1) {
    console.log(chalk.yellow("Only one track in playlist"));
    return;
  }

  const oldIndex = currentTrackIndex;
  currentTrackIndex++;
  if (currentTrackIndex >= currentPlaylist.length) {
    currentTrackIndex = 0;
  }

  // Prevent infinite loops by checking if we're cycling back to the same problematic track
  if (currentTrackIndex === oldIndex) {
    console.log(chalk.yellow("Reached end of playlist"));
    return;
  }

  playTrack(currentPlaylist[currentTrackIndex].id);
}

// Play previous track in playlist
function playPrevious() {
  if (currentPlaylist.length === 0) {
    console.log(chalk.yellow("Playlist is empty"));
    return;
  }

  currentTrackIndex--;
  if (currentTrackIndex < 0) {
    currentTrackIndex = currentPlaylist.length - 1;
  }

  playTrack(currentPlaylist[currentTrackIndex].id);
}

// Display current playlist
function displayPlaylist() {
  if (currentPlaylist.length === 0) {
    console.log(chalk.yellow("\nPlaylist is empty"));
    return;
  }

  console.log(chalk.blue.bold("\nCurrent Playlist:"));
  currentPlaylist.forEach((track, index) => {
    const prefix =
      index === currentTrackIndex ? chalk.green.bold("▶ ") : chalk.gray("  ");
    console.log(
      `${prefix}${track.title} - ${track.artist} ${chalk.gray(
        `(${track.duration})`
      )}`
    );
  });
}

// Display now playing information
function nowPlaying() {
  if (!isPlaying || currentPlaylist.length === 0) {
    console.log(chalk.yellow("\nNo track is currently playing"));
    return;
  }

  const track = currentPlaylist[currentTrackIndex];
  console.log(chalk.green.bold("\nNow Playing:"));
  console.log(chalk.white(`Title: ${track.title}`));
  console.log(chalk.white(`Artist: ${track.artist}`));
  console.log(chalk.white(`Duration: ${track.duration}`));
}

// Main menu
async function mainMenu() {
  while (true) {
    const { choice } = await inquirer.prompt({
      type: "list",
      name: "choice",
      message: "Music Player Menu",
      choices: [
        { name: "Search and play music", value: "search" },
        { name: "Show current playlist", value: "show" },
        { name: "Now playing", value: "now" },
        { name: "Play next track", value: "next" },
        { name: "Play previous track", value: "prev" },
        { name: "Stop playback", value: "stop" },
        { name: "Exit", value: "exit" },
      ],
    });

    switch (choice) {
      case "search":
        await searchAndPlay();
        break;
      case "show":
        displayPlaylist();
        break;
      case "now":
        nowPlaying();
        break;
      case "next":
        playNext();
        break;
      case "prev":
        playPrevious();
        break;
      case "stop":
        stopTrack();
        console.log(chalk.yellow("Playback stopped"));
        break;
      case "exit":
        cleanup();
        console.log(chalk.green("Goodbye!"));
        process.exit(0);
    }
  }
}

async function searchAndPlay() {
  const { query } = await inquirer.prompt({
    type: "input",
    name: "query",
    message: "Enter search query:",
  });

  const results = await searchTracks(query);

  if (results.length === 0) {
    console.log(chalk.red("\nNo results found"));
    return;
  }

  const { selectedIndex } = await inquirer.prompt({
    type: "list",
    name: "selectedIndex",
    message: "Select a track to play:",
    choices: [
      ...results.map((track, index) => ({
        name: `${track.title} - ${track.artist} (${track.duration})`,
        value: index,
      })),
      { name: "Cancel", value: -1 },
    ],
  });

  if (selectedIndex === -1) return;

  currentPlaylist = results;
  currentTrackIndex = selectedIndex;
  playTrack(results[selectedIndex].id);
}

function gracefulShutdown(signal) {
  console.log(chalk.yellow(`\nReceived ${signal}, cleaning up...`));
  cleanup();

  setTimeout(() => {
    console.log(chalk.green("Cleanup complete. Goodbye!"));
    process.exit(0);
  }, 1000);
}

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGHUP", () => gracefulShutdown("SIGHUP"));
process.on("SIGQUIT", () => gracefulShutdown("SIGQUIT"));

process.on("uncaughtException", (error) => {
  console.error(chalk.red("Uncaught Exception:"), error);
  cleanup();
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error(
    chalk.red("Unhandled Rejection at:"),
    promise,
    "reason:",
    reason
  );
  cleanup();
  process.exit(1);
});

process.on("exit", (code) => {
  console.log(chalk.gray(`Process exiting with code: ${code}`));
  cleanup();
});

(async () => {
  await initialize();
  console.log(chalk.blue.bold("\nCLI Music Player\n"));
  await mainMenu();
})();
