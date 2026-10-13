"""Word-level transcription via faster-whisper (Windows CPU)."""
import json
import os
import sys
import time

from faster_whisper import WhisperModel

os.makedirs("transcripts", exist_ok=True)
model = WhisperModel("turbo", device="cpu", compute_type="int8")

for path in sys.argv[1:]:
    name = os.path.splitext(os.path.basename(path))[0]
    t0 = time.time()
    segments, _info = model.transcribe(path, word_timestamps=True, language="en")
    out_segments = []
    for s in segments:
        words = []
        for w in s.words or []:
            words.append({"w": w.word, "s": w.start, "e": w.end})
        out_segments.append({"start": s.start, "end": s.end, "text": s.text, "words": words})
    out = {"segments": out_segments}
    with open(f"transcripts/{name}.json", "w", encoding="utf-8") as f:
        json.dump(out, f)
    print(f"{name} done in {time.time()-t0:.0f}s, {len(out_segments)} segments", flush=True)
