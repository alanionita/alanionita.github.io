<script lang="ts">
	import { browser } from '$app/environment';

	let originalCanvas: HTMLCanvasElement;
	let ditheredCanvas: HTMLCanvasElement;
	let fileInput: FileList | undefined = $state();
	let storedDitheredData: ImageData | null = $state(null);

	if (browser) {
		originalCanvas = document.createElement('canvas');
		ditheredCanvas = document.createElement('canvas');
	}

	  // Configuration state
	let tintColor = '#625834';
    let scanlineOpacity = 20;
    
    // Helper functions
    async function loadImage(src: string): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    }

    function floydSteinbergDither(data: Uint8ClampedArray, width: number, height: number) {
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const idx = (y * width + x) * 4;
                const gray = Math.round(data[idx] * 0.3 + data[idx+1] * 0.59 + data[idx+2] * 0.11);
                const err = gray < 128 ? gray : gray - 255;
                
                // Set all channels to pure black/white
                data[idx] = data[idx+1] = data[idx+2] = gray < 128 ? 0 : 255;

                // Propagate error
                if (x < width - 1) distributeError(data, idx + 4, err * 7/16);
                if (y < height - 1) {
                    if (x > 0) distributeError(data, idx + width * 4 - 4, err * 3/16);
                    distributeError(data, idx + width * 4, err * 5/16);
                    if (x < width - 1) distributeError(data, idx + width * 4 + 4, err * 1/16);
                }
            }
        }
    }

    function distributeError(data: Uint8ClampedArray, idx: number, err: number) {
        data[idx] = Math.min(255, Math.max(0, data[idx] + err));
    }

    async function processImage(file: File) {
        if (!file) return;

        const img = await loadImage(URL.createObjectURL(file));
        
        // Draw original image
        originalCanvas.width = img.width;
        originalCanvas.height = img.height;
        const origCtx = originalCanvas.getContext('2d')!;
        origCtx.drawImage(img, 0, 0);

        // Process dithered version
        const ditherCtx = ditheredCanvas.getContext('2d')!;
        ditheredCanvas.width = img.width;
        ditheredCanvas.height = img.height;
        
        // Initialize with white background
        ditherCtx.fillStyle = '#ffffff';
        ditherCtx.fillRect(0, 0, ditheredCanvas.width, ditheredCanvas.height);
        ditherCtx.drawImage(img, 0, 0);

        // Apply dithering
        const imageData = ditherCtx.getImageData(0, 0, img.width, img.height);
        floydSteinbergDither(imageData.data, img.width, img.height);
        ditherCtx.putImageData(imageData, 0, 0);

        // Apply color tint and scanlines
        applyEffects(ditherCtx, img.width, img.height);
    }

    function applyEffects(ctx: CanvasRenderingContext2D, width: number, height: number) {
        const imageData = ctx.getImageData(0, 0, width, height);
        const tint = hexToRgb(tintColor);

        // Apply tint only to pure black pixels
        for (let i = 0; i < imageData.data.length; i += 4) {
            if (
                imageData.data[i] === 0 &&
                imageData.data[i+1] === 0 &&
                imageData.data[i+2] === 0
            ) {
                imageData.data[i] = tint.r;
                imageData.data[i+1] = tint.g;
                imageData.data[i+2] = tint.b;
            }
        }

        // Apply scanlines
        for (let y = 0; y < height; y += 2) {
            for (let x = 0; x < width; x++) {
                const idx = (y * width + x) * 4;
                imageData.data[idx + 3] = Math.min(255 - scanlineOpacity, imageData.data[idx + 3]);
            }
        }

        ctx.putImageData(imageData, 0, 0);
    }

    function hexToRgb(hex: string) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 0x62, g: 0x58, b: 0x34 };
    }

    function downloadImage() {
        const link = document.createElement('a');
        link.download = `dithered-${Date.now()}.png`;
        link.href = ditheredCanvas.toDataURL();
        link.click();
    }

    const handleFileUpload = async (event: Event) => {
        const files = (event.target as HTMLInputElement).files;
        if (files?.length) {
            await processImage(files[0]);
        }
    };
</script>

<div class="container">
	<h1>Image Dither Processor</h1>

	<div class="controls">
		<input type="file" accept="image/*" bind:files={fileInput} onchange={handleFileUpload} />

		<label>
			Tint Color:
			<input type="color" bind:value={tintColor} />
		</label>

		<label>
			Scanline Opacity:
			<input type="range" min="0" max="100" bind:value={scanlineOpacity} />
			{scanlineOpacity}%
		</label>

		<button onclick={downloadImage}>Download Dithered Image</button>
	</div>

	<div class="comparison">
		<div class="image-container">
			<h2>Original</h2>
			<canvas bind:this={originalCanvas}></canvas>
		</div>
		<div class="image-container">
			<h2>Dithered</h2>
			<canvas bind:this={ditheredCanvas}></canvas>
		</div>
	</div>
</div>

<style>
	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
	}

	.controls {
		margin: 2rem 0;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1rem;
	}

	.comparison {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2rem;
	}

	.image-container {
		background: #f0f0f0;
		padding: 1rem;
		border-radius: 8px;
	}

	canvas {
		max-width: 100%;
		height: auto;
		border: 1px solid #ddd;
		border-radius: 4px;
	}

	label {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	button {
		align-self: end;
		padding: 0.5rem 1rem;
	}
</style>
