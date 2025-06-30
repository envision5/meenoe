/**
 * CustomWaveformAudioPlayer - Simple, reliable custom waveform visualization
 * No external dependencies - built from scratch for maximum compatibility
 */

// Only declare the class if it hasn't been declared already
if (typeof window.CustomWaveformAudioPlayer === 'undefined') {
    class CustomWaveformAudioPlayer {
        constructor() {
            this.audioPlayers = new Map();
        }

        /**
         * Initialize custom waveform audio player for an audio clip
         * @param {HTMLElement} audioElement - The audio clip DOM element
         * @param {Object} audioClip - The audio clip data
         */
        async initializeWaveformPlayer(audioElement, audioClip) {
            console.log('🎵 Initializing custom waveform player for audio clip:', audioClip.id);
            
            try {
                const playBtn = audioElement.querySelector('.audio-play-btn');
                const timeDisplay = audioElement.querySelector('.audio-time-display small');
                const durationDisplay = audioElement.querySelector(`#duration-${audioClip.id}`);
                const waveformContainer = audioElement.querySelector('.audio-waveform');
                const audioPlayer = audioElement.querySelector('audio');

                if (!waveformContainer || !playBtn || !audioPlayer) {
                    console.error('❌ Required elements not found for custom waveform player');
                    return;
                }

                // Create our custom waveform visualization
                await this.createCustomWaveform(waveformContainer, audioClip, audioPlayer, playBtn, timeDisplay, durationDisplay);
                
                console.log('✅ Custom waveform player initialized successfully!');

            } catch (error) {
                console.error('❌ Error in custom waveform initialization:', error);
            }
        }

        /**
         * Create a custom waveform visualization using canvas and Web Audio API
         * @param {HTMLElement} container - The waveform container
         * @param {Object} audioClip - The audio clip data
         * @param {HTMLAudioElement} audioPlayer - The audio element
         * @param {HTMLElement} playBtn - The play button
         * @param {HTMLElement} timeDisplay - The time display element
         * @param {HTMLElement} durationDisplay - The duration display element
         */
        async createCustomWaveform(container, audioClip, audioPlayer, playBtn, timeDisplay, durationDisplay) {
            // Clear container and set up styles
            container.innerHTML = '';
            container.style.position = 'relative';
            container.style.width = '100%';
            container.style.height = '30px';
            container.style.backgroundColor = '#ffffff';
            container.style.borderRadius = '4px';
            container.style.overflow = 'hidden';
            container.style.cursor = 'pointer';

            // Create canvas for waveform
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Set canvas size
            const containerRect = container.getBoundingClientRect();
            const width = containerRect.width || 400;
            const height = 30;
            
            canvas.width = width * 2; // Higher resolution
            canvas.height = height * 2;
            canvas.style.width = width + 'px';
            canvas.style.height = height + 'px';
            canvas.style.position = 'absolute';
            canvas.style.top = '0';
            canvas.style.left = '0';
            
            container.appendChild(canvas);

            // Set up audio source
            if (audioClip.audioBlob) {
                if (audioClip.audioUrl) {
                    URL.revokeObjectURL(audioClip.audioUrl);
                }
                audioClip.audioUrl = URL.createObjectURL(audioClip.audioBlob);
                audioPlayer.src = audioClip.audioUrl;
            }

            // Generate real waveform from audio data
            let waveformData = null;
            try {
                waveformData = await this.generateRealWaveform(audioClip.audioBlob, width * 2);
                console.log('✅ Generated real waveform from audio data');
            } catch (error) {
                console.log('⚠️ Failed to generate real waveform, using fallback pattern');
                waveformData = this.generateFallbackWaveform(width * 2);
            }

            // Draw the waveform with clipped progress
            this.drawWaveformWithProgress(ctx, waveformData, width * 2, height * 2, 0);

            // Set up audio player functionality
            this.setupAudioPlayerControls(audioPlayer, playBtn, timeDisplay, durationDisplay, null, audioClip, container, ctx, waveformData, width * 2, height * 2);

            // Store player reference
            this.audioPlayers.set(audioClip.id, {
                audioPlayer,
                playBtn,
                container,
                canvas: ctx,
                waveformData,
                canvasWidth: width * 2,
                canvasHeight: height * 2
            });

            console.log('🎨 Real audio waveform visualization created');
        }

        /**
         * Generate real waveform data from audio blob using Web Audio API
         * @param {Blob} audioBlob - The audio blob to analyze
         * @param {number} targetWidth - Target width for waveform bars
         * @returns {Array} Array of normalized amplitude values
         */
        async generateRealWaveform(audioBlob, targetWidth) {
            console.log('🎵 Analyzing audio to generate real waveform...');
            
            // Convert blob to array buffer
            const arrayBuffer = await audioBlob.arrayBuffer();
            
            // Create audio context
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Decode audio data
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
            
            // Get audio data from first channel
            const channelData = audioBuffer.getChannelData(0);
            const sampleRate = audioBuffer.sampleRate;
            const duration = audioBuffer.duration;
            
            console.log(`📊 Audio analysis: ${duration.toFixed(2)}s, ${sampleRate}Hz, ${channelData.length} samples`);
            
            // Calculate how many bars we want
            const barWidth = 6;
            const barGap = 2;
            const totalBarWidth = barWidth + barGap;
            const numBars = Math.floor(targetWidth / totalBarWidth);
            
            // Calculate samples per bar
            const samplesPerBar = Math.floor(channelData.length / numBars);
            
            // Generate waveform data
            const waveformData = [];
            for (let i = 0; i < numBars; i++) {
                const startSample = i * samplesPerBar;
                const endSample = Math.min(startSample + samplesPerBar, channelData.length);
                
                // Calculate RMS (Root Mean Square) for this segment
                let sum = 0;
                for (let j = startSample; j < endSample; j++) {
                    sum += channelData[j] * channelData[j];
                }
                const rms = Math.sqrt(sum / (endSample - startSample));
                
                // Normalize and apply some scaling for better visualization
                const normalizedAmplitude = Math.min(rms * 8, 1); // Scale up and cap at 1
                waveformData.push(normalizedAmplitude);
            }
            
            // Close audio context to free memory
            audioContext.close();
            
            console.log(`✅ Generated ${waveformData.length} waveform bars from real audio data`);
            return waveformData;
        }

        /**
         * Generate fallback waveform data if real analysis fails
         * @param {number} targetWidth - Target width for waveform bars
         * @returns {Array} Array of normalized amplitude values
         */
        generateFallbackWaveform(targetWidth) {
            const barWidth = 6;
            const barGap = 2;
            const totalBarWidth = barWidth + barGap;
            const numBars = Math.floor(targetWidth / totalBarWidth);
            
            const waveformData = [];
            for (let i = 0; i < numBars; i++) {
                const normalizedPosition = i / numBars;
                
                // Create a more realistic audio waveform pattern
                const amplitude = Math.abs(
                    Math.sin(normalizedPosition * Math.PI * 4) * 0.4 +
                    Math.sin(normalizedPosition * Math.PI * 8) * 0.25 +
                    Math.sin(normalizedPosition * Math.PI * 12) * 0.15 +
                    (Math.random() - 0.5) * 0.3
                );
                
                waveformData.push(Math.min(amplitude, 1));
            }
            
            return waveformData;
        }

        /**
         * Draw waveform with progress clipping
         * @param {CanvasRenderingContext2D} ctx - Canvas context
         * @param {Array} waveformData - Array of amplitude values
         * @param {number} width - Canvas width
         * @param {number} height - Canvas height
         * @param {number} progress - Progress value (0-1)
         */
        drawWaveformWithProgress(ctx, waveformData, width, height, progress) {
            ctx.clearRect(0, 0, width, height);
            
            const barWidth = 6;
            const barGap = 2;
            const totalBarWidth = barWidth + barGap;
            const progressX = progress * width;
            
            // Draw each bar
            waveformData.forEach((amplitude, i) => {
                const x = i * totalBarWidth;
                const barHeight = amplitude * height * 0.9 + height * 0.05;
                const y = (height - barHeight) / 2;
                
                // Determine bar color based on progress
                if (x + barWidth <= progressX) {
                    // Played portion - blue
                    ctx.fillStyle = '#0d6efd';
                } else if (x <= progressX) {
                    // Partially played bar - draw both colors
                    ctx.fillStyle = '#0d6efd';
                    ctx.beginPath();
                    ctx.roundRect(x, y, progressX - x, barHeight, barWidth / 2);
                    ctx.fill();
                    
                    ctx.fillStyle = '#d1d5db';
                    ctx.beginPath();
                    ctx.roundRect(progressX, y, x + barWidth - progressX, barHeight, barWidth / 2);
                    ctx.fill();
                    return;
                } else {
                    // Unplayed portion - gray
                    ctx.fillStyle = '#d1d5db';
                }
                
                // Draw the bar
                ctx.beginPath();
                ctx.roundRect(x, y, barWidth, barHeight, barWidth / 2);
                ctx.fill();
            });
        }

        /**
         * Set up audio player controls and event listeners
         */
        setupAudioPlayerControls(audioPlayer, playBtn, timeDisplay, durationDisplay, progressOverlay, audioClip, container) {
            let isPlaying = false;
            let durationSet = false;

            // Format time helper
            const formatTime = (timeValue) => {
                if (!timeValue || !isFinite(timeValue) || isNaN(timeValue) || timeValue <= 0) {
                    return '00:00';
                }
                const minutes = Math.floor(timeValue / 60);
                const seconds = Math.floor(timeValue % 60);
                return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            };

            // Use estimated duration initially
            if (audioClip.estimatedDuration && audioClip.estimatedDuration > 0) {
                durationDisplay.textContent = formatTime(audioClip.estimatedDuration);
                durationSet = true;
            }

            // Update duration when metadata loads
            audioPlayer.addEventListener('loadedmetadata', () => {
                const duration = audioPlayer.duration;
                if (isFinite(duration) && !isNaN(duration) && duration > 0) {
                    durationDisplay.textContent = formatTime(duration);
                    durationSet = true;
                }
            });

            // Update progress during playback - redraw waveform with clipped progress
            audioPlayer.addEventListener('timeupdate', () => {
                const currentTime = audioPlayer.currentTime;
                const duration = audioPlayer.duration;
                
                timeDisplay.textContent = formatTime(currentTime);
                
                let effectiveDuration = null;
                if (isFinite(duration) && !isNaN(duration) && duration > 0) {
                    effectiveDuration = duration;
                    if (!durationSet) {
                        durationDisplay.textContent = formatTime(duration);
                        durationSet = true;
                    }
                } else if (audioClip.estimatedDuration && audioClip.estimatedDuration > 0) {
                    effectiveDuration = audioClip.estimatedDuration;
                }
                
                if (effectiveDuration && effectiveDuration > 0) {
                    const progress = currentTime / effectiveDuration;
                    
                    // Get player data and redraw waveform with clipped progress
                    const playerData = this.audioPlayers.get(audioClip.id);
                    if (playerData && playerData.canvas && playerData.waveformData) {
                        this.drawWaveformWithProgress(
                            playerData.canvas, 
                            playerData.waveformData, 
                            playerData.canvasWidth, 
                            playerData.canvasHeight, 
                            progress
                        );
                    }
                }
            });

            // Handle play/pause
            playBtn.addEventListener('click', async () => {
                try {
                    if (isPlaying) {
                        audioPlayer.pause();
                        playBtn.innerHTML = '<i class="ti ti-player-play fs-6"></i>';
                        isPlaying = false;
                    } else {
                        // Pause other players
                        this.pauseOtherPlayers(audioClip.id);
                        
                        await audioPlayer.play();
                        playBtn.innerHTML = '<i class="ti ti-player-pause fs-6"></i>';
                        isPlaying = true;
                    }
                } catch (error) {
                    console.error('Error playing audio:', error);
                    playBtn.innerHTML = '<i class="ti ti-player-play fs-6"></i>';
                    isPlaying = false;
                }
            });

            // Handle audio end - reset waveform to beginning
            audioPlayer.addEventListener('ended', () => {
                playBtn.innerHTML = '<i class="ti ti-player-play fs-6"></i>';
                timeDisplay.textContent = '00:00';
                isPlaying = false;
                
                // Reset waveform progress to 0
                const playerData = this.audioPlayers.get(audioClip.id);
                if (playerData && playerData.canvas && playerData.waveformData) {
                    this.drawWaveformWithProgress(
                        playerData.canvas, 
                        playerData.waveformData, 
                        playerData.canvasWidth, 
                        playerData.canvasHeight, 
                        0
                    );
                }
            });

            // Handle clicking on waveform for seeking
            container.addEventListener('click', (e) => {
                if (e.target === playBtn || playBtn.contains(e.target)) return; // Don't seek when clicking play button
                
                const duration = audioPlayer.duration;
                let effectiveDuration = null;
                
                if (isFinite(duration) && !isNaN(duration) && duration > 0) {
                    effectiveDuration = duration;
                } else if (audioClip.estimatedDuration && audioClip.estimatedDuration > 0) {
                    effectiveDuration = audioClip.estimatedDuration;
                }
                
                if (effectiveDuration && effectiveDuration > 0) {
                    const rect = container.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const progress = clickX / rect.width;
                    audioPlayer.currentTime = progress * effectiveDuration;
                }
            });

            // Load audio
            audioPlayer.load();
        }

        /**
         * Pause all other audio players except the specified one
         * @param {string} excludeId - ID of the audio clip to exclude from pausing
         */
        pauseOtherPlayers(excludeId) {
            // Pause other custom audio players
            this.audioPlayers.forEach((playerData, id) => {
                if (id !== excludeId && !playerData.audioPlayer.paused) {
                    playerData.audioPlayer.pause();
                    playerData.playBtn.innerHTML = '<i class="ti ti-player-play fs-6"></i>';
                }
            });

            // Also pause any other audio players in the DOM
            document.querySelectorAll('.agenda-audio-clip audio').forEach(audio => {
                if (!audio.paused && audio.closest('.agenda-audio-clip').dataset.audioId !== excludeId) {
                    audio.pause();
                }
            });

            // Update play buttons for paused players
            document.querySelectorAll('.agenda-audio-clip .audio-play-btn').forEach(btn => {
                const audioClipElement = btn.closest('.agenda-audio-clip');
                if (audioClipElement && audioClipElement.dataset.audioId !== excludeId) {
                    btn.innerHTML = '<i class="ti ti-player-play fs-6"></i>';
                }
            });
        }

        /**
         * Format time in MM:SS format
         * @param {number} timeValue - Time value in seconds
         * @returns {string} Formatted time string
         */
        formatTime(timeValue) {
            if (!timeValue || !isFinite(timeValue) || isNaN(timeValue) || timeValue <= 0) {
                return '00:00';
            }
            const minutes = Math.floor(timeValue / 60);
            const seconds = Math.floor(timeValue % 60);
            return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }

        /**
         * Clean up audio player instance
         * @param {string} audioId - ID of the audio clip to clean up
         */
        cleanup(audioId) {
            const playerData = this.audioPlayers.get(audioId);
            if (playerData) {
                // Clean up audio URL if it exists
                if (playerData.audioPlayer.src && playerData.audioPlayer.src.startsWith('blob:')) {
                    URL.revokeObjectURL(playerData.audioPlayer.src);
                }
                this.audioPlayers.delete(audioId);
            }
        }

        /**
         * Clean up all audio player instances
         */
        cleanupAll() {
            this.audioPlayers.forEach((playerData, id) => {
                this.cleanup(id);
            });
            this.audioPlayers.clear();
        }
    }

    // Create global instance with the custom waveform player
    window.waveformAudioPlayer = new CustomWaveformAudioPlayer();
    window.CustomWaveformAudioPlayer = CustomWaveformAudioPlayer;
}