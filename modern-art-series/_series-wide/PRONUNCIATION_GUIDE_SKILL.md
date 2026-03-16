# Skill: Pronunciation Guide Generator

## Purpose
Generate MP3 pronunciation audio files for a list of names using ElevenLabs TTS, then package them into a shareable HTML page hosted via GitHub Gist.

## Prerequisites
- ElevenLabs API key (paid Starter plan or above) stored in `.env` at project root as `ELEVENLABS_API_KEY=sk_...`
- `.env` must be in `.gitignore`
- `gh` CLI installed and authenticated (with `gist` scope)
- `python3` available

## Inputs
- A list of names to pronounce
- The episode directory path (e.g. `modern-art-series/ep01-neoclassicism`)

## Steps

### 1. Generate MP3 files with ElevenLabs

For each name, call the ElevenLabs TTS API:

```bash
curl -s "https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM" \
  -H "xi-api-key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"text":"<NAME>","model_id":"eleven_multilingual_v2"}' \
  -o "<output_dir>/<filename>.mp3"
```

- Voice ID `21m00Tcm4TlvDq8ikWAM` is "Rachel" — works well for multilingual names
- Model `eleven_multilingual_v2` handles French, Italian, German, Latin names correctly
- Filenames: lowercase, accents stripped, spaces/hyphens replaced with underscores (e.g. `Jacques-Louis David` → `jacques_louis_david.mp3`)
- Add `sleep 0.5` between requests to avoid rate limiting
- Save files to `<episode_dir>/pronunciations/`

### 2. Verify all files are real audio

Check that no file is suspiciously small (< 1000 bytes), which would indicate an error JSON response instead of audio:

```bash
for f in *.mp3; do
  size=$(stat -f%z "$f")
  if [ "$size" -lt 1000 ]; then echo "SUSPECT: $f"; cat "$f"; fi
done
```

### 3. Build the HTML pronunciation guide

Use Python to generate a single self-contained HTML file:

- Read each MP3, base64-encode it, embed as `data:audio/mp3;base64,...` in native `<audio controls>` elements
- Group names into categories (e.g. People, Places, Artworks & Terms)
- Each row: name label + `<audio controls preload="none">` with inline base64 source
- Dark theme, mobile-friendly layout
- **Do NOT use JavaScript `Audio()` or inline `onclick` handlers** — they get blocked by iframe sandboxes. Use only native `<audio controls>` elements.
- Save as `<episode_dir>/pronunciations/pronunciation_guide.html`

### 4. Host via GitHub Gist

```bash
# Create public gist
gh gist create --public --desc "<description>" "<path_to_html>"

# Note the gist ID from the output URL

# To update later:
gh gist edit <GIST_ID> -f pronunciation_guide.html "<path_to_html>"
```

The shareable URL format is:
```
https://gistpreview.github.io/?<GIST_ID>
```

This renders the HTML in a real browser context when opened from WhatsApp or similar apps.

## Key Lessons / Gotchas

- **macOS `say` is not good enough** for foreign name pronunciation — use ElevenLabs
- **ElevenLabs free tier** cannot use library voices via API — needs Starter plan ($5/mo)
- **WhatsApp's in-app HTML viewer** blocks JavaScript and `Audio()` — use native `<audio controls>` elements only
- **gistpreview.github.io** sandboxes content in an iframe — inline `onclick` handlers and `new Audio()` won't work, but native `<audio>` elements do
- **raw.githack.com** did not work for serving gist HTML — gistpreview did
- The resulting HTML is ~1MB for 40 names — well within gist limits

## File Structure After Running

```
<episode_dir>/
  pronunciations/
    jacques_louis_david.mp3
    jean_honore_fragonard.mp3
    ... (one mp3 per name)
    pronunciation_guide.html   ← the shareable page
```
