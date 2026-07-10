import axios from 'axios';
import { execFile } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import os from 'os';
import path from 'path';

const execFileAsync = promisify(execFile);

const cfApiToken = process.env.CLOUDFLARE_API_TOKEN;
const cfAccountId = process.env.CLOUDFLARE_ACCOUNT_ID;

const PIXVERSE_TIMEOUT_SEC = parseInt(process.env.PIXVERSE_TIMEOUT_SEC || '300', 10);
const PIXVERSE_ASPECT_RATIO = process.env.PIXVERSE_ASPECT_RATIO || '1:1';
// CLI's own default (gpt-image-2.0) requires a paid Standard+ plan; gemini-3.1-flash-lite
// is the cheapest model confirmed to work on the Free tier (6 credits/image vs 60/day cap).
const PIXVERSE_IMAGE_MODEL = process.env.PIXVERSE_IMAGE_MODEL || 'gemini-3.1-flash-lite';

// PixVerse prices text-to-video and image-to-video identically (same per-second rate,
// driven only by model/resolution/duration/audio) - see docs.platform.pixverse.ai/model-pricing.
// We use image-to-video anyway since it reuses an image we already generated that day
// at no extra credit cost, instead of spending a separate T2V generation on a new scene.
const PIXVERSE_VIDEO_TIMEOUT_SEC = parseInt(process.env.PIXVERSE_VIDEO_TIMEOUT_SEC || '600', 10);
const PIXVERSE_VIDEO_MODEL = process.env.PIXVERSE_VIDEO_MODEL || 'v6';
// 360p is v6's cheapest quality tier (~4-6 credits/sec no-audio). At the default 1:1
// aspect ratio this comes out to 640x640, vs 1024x1024 (and a higher rate) for 540p -
// confirmed by test generation, so keep this the lowest tier unless quality complaints come in.
const PIXVERSE_VIDEO_QUALITY = process.env.PIXVERSE_VIDEO_QUALITY || '360p';
const PIXVERSE_VIDEO_DURATION = process.env.PIXVERSE_VIDEO_DURATION || '5';
const PIXVERSE_VIDEO_AUDIO = process.env.PIXVERSE_VIDEO_AUDIO === 'true';

function createRandomPrompt(fragments) {
    const randomSubject = fragments[Math.floor(Math.random() * fragments.length)].subject;
    const randomAction = fragments[Math.floor(Math.random() * fragments.length)].action;
    const randomSetting = fragments[Math.floor(Math.random() * fragments.length)].setting;
    return `${randomSubject} ${randomAction} ${randomSetting}, vibrant colors, uplifting mood, cinematic lighting, epic composition`;
}

function createNotRandomPrompt(fragments, index) {
    const fragment = fragments[index % fragments.length];
    return `${fragment.subject} ${fragment.action} ${fragment.setting}, vibrant colors, uplifting mood, cinematic lighting, epic composition`;
}

/*
 * --- Cloudflare Workers AI (flux-1-schnell) image generation ---
 * Disabled in favor of the PixVerse CLI integration below. Left intact so we
 * can switch back instantly: just re-export this instead of the PixVerse
 * version at the bottom of the file.
 *
async function generateMotivationalImage(prompt, style) {
    try {
        const fullPrompt = style ? `${prompt}, style: ${style}` : prompt;
        const response = await axios.post(
            `https://api.cloudflare.com/client/v4/accounts/${cfAccountId}/ai/run/@cf/black-forest-labs/flux-1-schnell`,
            { prompt: fullPrompt },
            {
                headers: {
                    Authorization: `Bearer ${cfApiToken}`,
                    'Content-Type': 'application/json'
                },
                timeout: 60000
            }
        );

        if (!response.data.success || !response.data.result?.image) {
            console.error('❌ Cloudflare Workers AI error:', JSON.stringify(response.data.errors));
            return null;
        }

        const imageBuffer = Buffer.from(response.data.result.image, 'base64');
        console.log('🟢 Cloudflare Workers AI: image generated');
        return imageBuffer;
    } catch (err) {
        console.error('❌ Cloudflare Workers AI error:', err.response?.data ? JSON.stringify(err.response.data) : err.message);
        return null;
    }
}
*/

// --- PixVerse CLI image generation ---
//
// Requires the `pixverse` CLI installed globally (Node >= 20) and a one-time
// interactive login on the host/container so the OAuth token gets cached:
//   docker compose exec bot pixverse auth login
// Follow the printed URL in any browser to authorize. The token is stored on
// disk (persisted via the pixverse_config/pixverse_home volumes) and is only
// valid for ~30 days, so it needs to be redone periodically. PixVerse does
// not currently document a headless/API-key auth method.
async function runPixverseCli(args, timeoutSec = PIXVERSE_TIMEOUT_SEC) {
    const { stdout } = await execFileAsync('pixverse', args, {
        timeout: (timeoutSec + 20) * 1000,
        maxBuffer: 20 * 1024 * 1024
    });
    return stdout;
}

// The CLI's --json output schema isn't fully documented publicly, so this
// defensively pulls a URL / local file path / asset id out of whatever shape
// comes back instead of assuming one exact structure.
function extractAssetInfo(result) {
    const asset = result?.assets?.[0] || result?.result?.assets?.[0] || result?.data?.assets?.[0] || result;
    return {
        url: asset?.url || asset?.image_url || asset?.video_url || result?.url || result?.image_url || result?.video_url || null,
        localPath: asset?.path || asset?.file || asset?.file_path || result?.path || null,
        id: asset?.id || asset?.asset_id || result?.id || result?.image_id || result?.video_id || null
    };
}

async function generateMotivationalImage(prompt, style) {
    const fullPrompt = style ? `${prompt}, style: ${style}` : prompt;
    const args = [
        'create', 'image',
        '--prompt', fullPrompt,
        '--aspect-ratio', PIXVERSE_ASPECT_RATIO,
        '--timeout', String(PIXVERSE_TIMEOUT_SEC),
        '--json'
    ];
    if (PIXVERSE_IMAGE_MODEL) {
        args.push('--model', PIXVERSE_IMAGE_MODEL);
    }

    let tmpDir;
    try {
        const stdout = await runPixverseCli(args);
        const result = JSON.parse(stdout);
        let { url, localPath, id } = extractAssetInfo(result);

        if (!url && !localPath && id) {
            tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'pixverse-'));
            const dlOut = await runPixverseCli(['asset', 'download', id, '--dest', tmpDir, '--json']);
            const dlResult = JSON.parse(dlOut);
            ({ url, localPath } = extractAssetInfo(dlResult));
            if (!url && !localPath) {
                const files = await fs.readdir(tmpDir);
                if (files.length) localPath = path.join(tmpDir, files[0]);
            }
        }

        if (localPath) {
            const buffer = await fs.readFile(localPath);
            console.log('🟢 PixVerse CLI: image generated');
            return buffer;
        }

        if (url) {
            const response = await axios.get(url, { responseType: 'arraybuffer', timeout: 60000 });
            console.log('🟢 PixVerse CLI: image generated');
            return Buffer.from(response.data);
        }

        console.error('❌ PixVerse CLI: could not locate generated image in output:', stdout);
        return null;
    } catch (err) {
        const details = err.stderr || err.stdout || err.message;
        if (err.code === 'ENOENT') {
            console.error('❌ PixVerse CLI: `pixverse` binary not found — is it installed globally? (npm install -g pixverse)');
        } else if (err.code === 3) {
            console.error('❌ PixVerse CLI: authentication error — run `pixverse auth login` again (tokens last ~30 days).');
        } else if (err.code === 4) {
            console.error('❌ PixVerse CLI: credit/subscription limit reached.');
        } else if (err.code === 2) {
            console.error('❌ PixVerse CLI: generation timed out.');
        } else {
            console.error('❌ PixVerse CLI error:', details);
        }
        return null;
    } finally {
        if (tmpDir) {
            fs.rm(tmpDir, { recursive: true, force: true }).catch(() => {});
        }
    }
}

// --- PixVerse CLI image-to-video generation ---
//
// Takes an already-generated motivational image (Buffer) and animates it,
// reusing the same prompt/style used for the image so the motion matches
// the scene instead of paying for a second, unrelated generation.
async function generateMotivationalVideo(prompt, imageBuffer, style) {
    const fullPrompt = `${style ? `${prompt}, style: ${style}` : prompt}, slow cinematic camera movement, gentle motion, uplifting mood`;

    let inputTmpDir;
    let outputTmpDir;
    try {
        inputTmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'pixverse-video-in-'));
        const inputImagePath = path.join(inputTmpDir, 'source.png');
        await fs.writeFile(inputImagePath, imageBuffer);

        const args = [
            'create', 'video',
            '--prompt', fullPrompt,
            '--image', inputImagePath,
            '--model', PIXVERSE_VIDEO_MODEL,
            '--quality', PIXVERSE_VIDEO_QUALITY,
            '--duration', PIXVERSE_VIDEO_DURATION,
            '--aspect-ratio', PIXVERSE_ASPECT_RATIO,
            PIXVERSE_VIDEO_AUDIO ? '--audio' : '--no-audio',
            '--timeout', String(PIXVERSE_VIDEO_TIMEOUT_SEC),
            '--json'
        ];

        const stdout = await runPixverseCli(args, PIXVERSE_VIDEO_TIMEOUT_SEC);
        const result = JSON.parse(stdout);
        let { url, localPath, id } = extractAssetInfo(result);

        if (!url && !localPath && id) {
            outputTmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'pixverse-video-out-'));
            const dlOut = await runPixverseCli(['asset', 'download', id, '--dest', outputTmpDir, '--json'], PIXVERSE_VIDEO_TIMEOUT_SEC);
            const dlResult = JSON.parse(dlOut);
            ({ url, localPath } = extractAssetInfo(dlResult));
            if (!url && !localPath) {
                const files = await fs.readdir(outputTmpDir);
                if (files.length) localPath = path.join(outputTmpDir, files[0]);
            }
        }

        if (localPath) {
            const buffer = await fs.readFile(localPath);
            console.log('🟢 PixVerse CLI: video generated');
            return buffer;
        }

        if (url) {
            const response = await axios.get(url, { responseType: 'arraybuffer', timeout: 120000 });
            console.log('🟢 PixVerse CLI: video generated');
            return Buffer.from(response.data);
        }

        console.error('❌ PixVerse CLI: could not locate generated video in output:', stdout);
        return null;
    } catch (err) {
        const details = err.stderr || err.stdout || err.message;
        if (err.code === 'ENOENT') {
            console.error('❌ PixVerse CLI: `pixverse` binary not found — is it installed globally? (npm install -g pixverse)');
        } else if (err.code === 3) {
            console.error('❌ PixVerse CLI: authentication error — run `pixverse auth login` again (tokens last ~30 days).');
        } else if (err.code === 4) {
            console.error('❌ PixVerse CLI: credit/subscription limit reached.');
        } else if (err.code === 2) {
            console.error('❌ PixVerse CLI: generation timed out.');
        } else {
            console.error('❌ PixVerse CLI video error:', details);
        }
        return null;
    } finally {
        if (inputTmpDir) fs.rm(inputTmpDir, { recursive: true, force: true }).catch(() => {});
        if (outputTmpDir) fs.rm(outputTmpDir, { recursive: true, force: true }).catch(() => {});
    }
}

export { createRandomPrompt, createNotRandomPrompt, generateMotivationalImage, generateMotivationalVideo };
