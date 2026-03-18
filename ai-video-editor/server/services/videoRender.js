const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const uuid = require('uuid');

class VideoRenderer {
  constructor(options = {}) {
    this.ffmpegPath = options.ffmpegPath || 'ffmpeg';
    this.ffprobePath = options.ffprobePath || 'ffprobe';
    this.outputDir = options.outputDir || path.join(__dirname, '../uploads/video');
    
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * Get video metadata
   */
  async getMediaInfo(inputPath) {
    return new Promise((resolve, reject) => {
      const args = [
        '-v', 'quiet',
        '-print_format', 'json',
        '-show_format',
        '-show_streams',
        inputPath
      ];
      
      const process = spawn(this.ffprobePath, args);
      let output = '';
      let error = '';
      
      process.stdout.on('data', (data) => output += data);
      process.stderr.on('data', (data) => error += data);
      
      process.on('close', (code) => {
        if (code === 0) {
          try {
            resolve(JSON.parse(output));
          } catch (e) {
            reject(e);
          }
        } else {
          reject(new Error(error || 'ffprobe failed'));
        }
      });
    });
  }

  /**
   * Render video with filters
   */
  async render(options) {
    const {
      input,
      outputName,
      filters = [],
      duration,
      startTime = 0,
      videoCodec = 'libx264',
      audioCodec = 'aac',
      videoBitrate = '2000k',
      audioBitrate = '128k',
      resolution,
      format = 'mp4'
    } = options;

    const outputFile = outputName || `${uuid.v4()}.${format}`;
    const outputPath = path.join(this.outputDir, outputFile);

    const args = [];
    
    // Input
    args.push('-i', input);
    
    // Start time
    if (startTime > 0) {
      args.push('-ss', startTime.toString());
    }
    
    // Duration
    if (duration) {
      args.push('-t', duration.toString());
    }
    
    // Video filters
    if (filters.length > 0) {
      args.push('-vf', filters.join(','));
    }
    
    // Resolution
    if (resolution) {
      const [width, height] = resolution.split('x');
      args.push('-s', `${width}x${height}`);
    }
    
    // Codecs
    args.push('-c:v', videoCodec);
    args.push('-c:a', audioCodec);
    
    // Bitrates
    args.push('-b:v', videoBitrate);
    args.push('-b:a', audioBitrate);
    
    // Preset for faster encoding
    args.push('-preset', 'medium');
    args.push('-crf', '23');
    
    // Output
    args.push('-y', outputPath);

    return new Promise((resolve, reject) => {
      const process = this.ffmpegPath ? spawn(this.ffmpegPath, args) : spawn('ffmpeg', args);
      let error = '';
      
      process.stderr.on('data', (data) => {
        // Parse progress from stderr
        const output = data.toString();
        const timeMatch = output.match(/time=(\d{2}):(\d{2}):(\d{2})/);
        if (timeMatch && duration) {
          const currentTime = parseInt(timeMatch[1]) * 3600 + parseInt(timeMatch[2]) * 60 + parseInt(timeMatch[3]);
          const progress = Math.min(100, Math.round((currentTime / duration) * 100));
          if (this.onProgress) {
            this.onProgress({ progress, currentTime, duration });
          }
        }
      });
      
      process.on('close', (code) => {
        if (code === 0) {
          resolve({
            success: true,
            outputPath,
            outputName: outputFile,
            url: `/uploads/video/${outputFile}`
          });
        } else {
          reject(new Error(error || 'Render failed'));
        }
      });
      
      process.on('error', (err) => {
        reject(err);
      });
    });
  }

  /**
   * Add watermark to video
   */
  async addWatermark(options) {
    const { input, watermark, position = 'RT', opacity = 0.5 } = options;
    
    const positions = {
      'LT': '10:10',
      'RT': 'main-w-overlay_w-10:10',
      'LB': '10:main-h-overlay_h-10',
      'RB': 'main-w-overlay_w-10:main-h-overlay_h-10',
      'C': 'main-w-overlay_w/2:main-h-overlay_h/2'
    };
    
    const pos = positions[position] || positions['RT'];
    
    const filters = [
      `movie=${watermark},scale=100:-1[wm]`,
      `[in][wm]overlay=${pos}:format=auto:opacity=${opacity}[out]`
    ];
    
    return this.render({ input, filters: [filters.join(',')] });
  }

  /**
   * Add text overlay
   */
  async addText(options) {
    const { input, text, fontSize = 24, fontColor = 'white', position = 'C' } = options;
    
    const positions = {
      'T': '(w-text_w)/2:10',
      'B': '(w-text_w)/2:h-text_h-10',
      'C': '(w-text_w)/2:(h-text_h)/2'
    };
    
    const pos = positions[position] || positions['C'];
    
    const filters = [
      `drawtext=text='${text}':fontsize=${fontSize}:fontcolor=${fontColor}:x=${pos}`
    ];
    
    return this.render({ input, filters });
  }

  /**
   * Apply filter preset
   */
  async applyFilter(input, filterName) {
    const filters = {
      'warm': 'colorbalance=rs=0.3:gs=0.1:bs=0.0',
      'cool': 'colorbalance=rs=-0.2:gs=0.0:bs=0.3',
      'vintage': 'curves=vintage',
      'grayscale': 'colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3',
      'blur': 'gblur=sigma=2',
      'sharpen': 'unsharp=5:5:1.0:5:5:0.0',
      'brightness': 'eq=brightness=0.1:saturation=1.2',
      'contrast': 'eq=contrast=1.2'
    };
    
    const filter = filters[filterName];
    if (!filter) {
      throw new Error(`Unknown filter: ${filterName}`);
    }
    
    return this.render({ input, filters: [filter] });
  }

  /**
   * Concatenate multiple videos
   */
  async concat(videos, options = {}) {
    const { transition = 'none' } = options;
    
    // Create concat file
    const concatFile = path.join(this.outputDir, `concat_${uuid.v4()}.txt`);
    const content = videos.map(v => `file '${v}'`).join('\n');
    fs.writeFileSync(concatFile, content);
    
    const outputName = `concat_${uuid.v4()}.mp4`;
    const outputPath = path.join(this.outputDir, outputName);
    
    const args = [
      '-f', 'concat',
      '-safe', '0',
      '-i', concatFile,
      '-c', 'copy',
      '-y', outputPath
    ];
    
    return new Promise((resolve, reject) => {
      const process = spawn(this.ffmpegPath || 'ffmpeg', args);
      
      process.on('close', (code) => {
        // Clean up concat file
        fs.unlinkSync(concatFile);
        
        if (code === 0) {
          resolve({
            success: true,
            outputPath,
            outputName,
            url: `/uploads/video/${outputName}`
          });
        } else {
          reject(new Error('Concatenation failed'));
        }
      });
      
      process.on('error', (err) => {
        fs.unlinkSync(concatFile);
        reject(err);
      });
    });
  }

  /**
   * Extract audio from video
   */
  async extractAudio(input, options = {}) {
    const { format = 'mp3', bitrate = '192k' } = options;
    
    const outputName = `audio_${uuid.v4()}.${format}`;
    const outputPath = path.join(this.outputDir, outputName);
    
    const args = [
      '-i', input,
      '-vn',
      '-acodec', format === 'mp3' ? 'libmp3lame' : 'copy',
      '-ab', bitrate,
      '-y', outputPath
    ];
    
    return new Promise((resolve, reject) => {
      const process = spawn(this.ffmpegPath || 'ffmpeg', args);
      
      process.on('close', (code) => {
        if (code === 0) {
          resolve({
            success: true,
            outputPath,
            outputName,
            url: `/uploads/audio/${outputName}`
          });
        } else {
          reject(new Error('Audio extraction failed'));
        }
      });
      
      process.on('error', reject);
    });
  }

  /**
   * Generate thumbnail
   */
  async generateThumbnail(input, options = {}) {
    const { time = '00:00:01', size = '320x568', format = 'jpg' } = options;
    
    const outputName = `thumb_${uuid.v4()}.${format}`;
    const outputPath = path.join(this.outputDir, outputName);
    
    const args = [
      '-i', input,
      '-ss', time,
      '-vframes', '1',
      '-s', size,
      '-y', outputPath
    ];
    
    return new Promise((resolve, reject) => {
      const process = spawn(this.ffmpegPath || 'ffmpeg', args);
      
      process.on('close', (code) => {
        if (code === 0) {
          resolve({
            success: true,
            outputPath,
            outputName,
            url: `/uploads/thumb/${outputName}`
          });
        } else {
          reject(new Error('Thumbnail generation failed'));
        }
      });
      
      process.on('error', reject);
    });
  }

  /**
   * Trim video
   */
  async trim(input, startTime, duration) {
    return this.render({
      input,
      startTime,
      duration
    });
  }

  /**
   * Change video speed
   */
  async changeSpeed(input, speed) {
    const filters = [`setpts=${1/speed}*PTS`];
    
    if (speed > 1) {
      filters.push(`atempo=${speed}`);
    }
    
    return this.render({
      input,
      filters,
      audioBitrate: `${128 * speed}k`
    });
  }

  /**
   * Merge video with audio
   */
  async mergeAudio(videoPath, audioPath, options = {}) {
    const { replace = false } = options;
    
    const outputName = `merged_${uuid.v4()}.mp4`;
    const outputPath = path.join(this.outputDir, outputName);
    
    const args = [
      '-i', videoPath
    ];
    
    if (replace) {
      args.push('-i', audioPath, '-map', '0:v:0', '-map', '1:a:0');
    } else {
      args.push('-i', audioPath, '-map', '0:v:0', '-map', '0:a:0', '-map', '1:a:0');
    }
    
    args.push('-shortest', '-y', outputPath);
    
    return new Promise((resolve, reject) => {
      const process = spawn(this.ffmpegPath || 'ffmpeg', args);
      
      process.on('close', (code) => {
        if (code === 0) {
          resolve({
            success: true,
            outputPath,
            outputName,
            url: `/uploads/video/${outputName}`
          });
        } else {
          reject(new Error('Merge failed'));
        }
      });
      
      process.on('error', reject);
    });
  }
}

module.exports = VideoRenderer;
