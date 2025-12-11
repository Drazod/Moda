import sharp from 'sharp';
import Human from '@vladmandic/human';

// Cache the Human instance to avoid reloading
let humanInstance: Human | null = null;

async function getHuman() {
  if (!humanInstance) {
    console.log('Initializing Human library for person detection...');
    humanInstance = new Human({
      backend: 'wasm',
      wasmPath: 'https://cdn.jsdelivr.net/npm/@vladmandic/human/dist/',
      modelBasePath: 'https://cdn.jsdelivr.net/npm/@vladmandic/human/models',
      face: { enabled: true },
      body: { enabled: true },
      hand: { enabled: false },
      object: { enabled: false },
      gesture: { enabled: false },
    });
    await humanInstance.load();
    console.log('✓ Human library initialized with WASM backend');
  }
  return humanInstance;
}

/**
 * Validate if an image contains a human/person using ML
 * Uses @vladmandic/human for face and body detection
 * @param imageBuffer - Buffer containing the image data
 * @returns Object with validation result
 */
export async function validateHumanImage(imageBuffer: Buffer): Promise<{
  isValid: boolean;
  confidence?: number;
  reason?: string;
  detections?: { faces: number; bodies: number; persons: number };
}> {
  try {
    const human = await getHuman();

    // Convert buffer to image that Human can process
    const image = await sharp(imageBuffer)
      .resize(640, 640, { fit: 'inside' })
      .raw()
      .toBuffer({ resolveWithObject: true });

    // Detect humans in the image
    const result = await human.detect(image.data, {
      width: image.info.width,
      height: image.info.height,
      channels: image.info.channels,
    } as any);

    const faceCount = result.face?.length || 0;
    const bodyCount = result.body?.length || 0;
    const personCount = Math.max(faceCount, bodyCount);

    // Check if any person is detected
    if (personCount === 0) {
      return {
        isValid: false,
        reason: 'No person detected in the image',
        detections: {
          faces: faceCount,
          bodies: bodyCount,
          persons: personCount,
        },
      };
    }

    // Get confidence from best detection
    const faceConfidence = result.face?.[0]?.faceScore || 0;
    const bodyConfidence = result.body?.[0]?.score || 0;
    const bestConfidence = Math.max(faceConfidence, bodyConfidence);

    // Require at least 40% confidence (Human library is more conservative)
    if (bestConfidence < 0.4) {
      return {
        isValid: false,
        confidence: bestConfidence,
        reason: `Person detected but confidence too low (${(bestConfidence * 100).toFixed(1)}%)`,
        detections: {
          faces: faceCount,
          bodies: bodyCount,
          persons: personCount,
        },
      };
    }

    return {
      isValid: true,
      confidence: bestConfidence,
      detections: {
        faces: faceCount,
        bodies: bodyCount,
        persons: personCount,
      },
    };
  } catch (error) {
    console.error('Error validating human image:', error);
    throw error;
  }
}

/**
 * Simpler validation using image analysis (no ML model required)
 * Checks basic image properties that suggest a photo of a person
 */
export async function validateHumanImageSimple(imageBuffer: Buffer): Promise<{
  isValid: boolean;
  reason?: string;
  stats?: any;
}> {
  try {
    const metadata = await sharp(imageBuffer).metadata();
    const stats = await sharp(imageBuffer).stats();

    // Basic validation checks
    const checks = {
      hasValidDimensions: (metadata.width || 0) >= 200 && (metadata.height || 0) >= 200,
      hasGoodAspectRatio: false,
      hasVariedColors: false,
    };

    // Check aspect ratio (typical portrait/person photos)
    if (metadata.width && metadata.height) {
      const aspectRatio = metadata.width / metadata.height;
      checks.hasGoodAspectRatio = aspectRatio >= 0.5 && aspectRatio <= 2.0;
    }

    // Check color variance (real photos have varied colors)
    const channels = stats.channels;
    if (channels && channels.length >= 3) {
      const avgStdDev = channels.reduce((sum, ch) => sum + ch.stdev, 0) / channels.length;
      checks.hasVariedColors = avgStdDev > 20; // Sufficient color variance
    }

    const isValid = Object.values(checks).every((check) => check === true);

    if (!isValid) {
      const failedChecks = Object.entries(checks)
        .filter(([_, passed]) => !passed)
        .map(([check]) => check);

      return {
        isValid: false,
        reason: `Image validation failed: ${failedChecks.join(', ')}`,
        stats: {
          width: metadata.width,
          height: metadata.height,
          format: metadata.format,
          checks,
        },
      };
    }

    return {
      isValid: true,
      stats: {
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
        checks,
      },
    };
  } catch (error) {
    console.error('Error in simple image validation:', error);
    throw error;
  }
}
