import { spawn } from 'child_process';

export default function handler(req, res) {
  const url = req.query.url;
  if (!url) return res.status(400).send("Missing URL");

  res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');

  const ffmpeg = spawn('ffmpeg', [
    '-i', url,
    '-map', '0:v',
    '-map', '0:a',
    '-map', '0:s?',
    '-c:v', 'libx264',
    '-c:a', 'aac',
    '-c:s', 'mov_text',
    '-f', 'hls',
    '-hls_time', '4',
    '-hls_list_size', '0',
    'pipe:1'
  ]);

  ffmpeg.stdout.pipe(res);
  ffmpeg.stderr.on('data', data => console.error(`stderr: ${data}`));
  ffmpeg.on('close', () => res.end());
}
