# Audio Files for Never Ending Dream

This directory contains audio files for the game. You can add your own audio files or use placeholder files for development.

## Required Audio Files

- `ambient.mp3` - Background ambient forest sounds (looped)
- `click.mp3` - UI click sound effect
- `achievement.mp3` - Achievement unlock sound effect

## Audio Specifications

### Ambient Sound
- **Format**: MP3
- **Duration**: 30-60 seconds (will be looped)
- **Bitrate**: 128-192 kbps
- **Sample Rate**: 44.1 kHz
- **Channels**: Stereo
- **Content**: Forest ambience, gentle nature sounds

### Click Sound
- **Format**: MP3
- **Duration**: 0.1-0.3 seconds
- **Bitrate**: 128 kbps
- **Sample Rate**: 44.1 kHz
- **Channels**: Mono
- **Content**: Soft UI click or tap sound

### Achievement Sound
- **Format**: MP3
- **Duration**: 1-3 seconds
- **Bitrate**: 128 kbps
- **Sample Rate**: 44.1 kHz
- **Channels**: Stereo
- **Content**: Triumphant or magical sound

## Free Audio Resources

You can find free audio files from these sources:
- [Freesound.org](https://freesound.org/)
- [Zapsplat](https://www.zapsplat.com/)
- [BBC Sound Effects](https://sound-effects.bbcrewind.co.uk/)
- [YouTube Audio Library](https://www.youtube.com/audiolibrary)

## Development Notes

For development, you can create placeholder audio files or use silence:

```bash
# Create silent audio files for development
ffmpeg -f lavfi -i anullsrc=channel_layout=stereo:sample_rate=44100 -t 30 ambient.mp3
ffmpeg -f lavfi -i anullsrc=channel_layout=mono:sample_rate=44100 -t 0.2 click.mp3
ffmpeg -f lavfi -i anullsrc=channel_layout=stereo:sample_rate=44100 -t 2 achievement.mp3
```

## File Size Optimization

Keep audio files small for better loading times:
- Compress MP3 files appropriately
- Use lower bitrates for shorter sounds
- Consider using WebM format for better compression 