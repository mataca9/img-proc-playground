import { getIntensity, getPixel, writePixel } from "./utils";

export function grayscale(input: HTMLCanvasElement, output: HTMLCanvasElement) {
    const inputCtx = input.getContext("2d") as CanvasRenderingContext2D;
    const outputCtx = output.getContext("2d") as CanvasRenderingContext2D;

    const data = inputCtx.getImageData(0, 0, input.width, input.height);
    const result = inputCtx.getImageData(0, 0, input.width, input.height);

    for (let x = 0; x < data.width; x++) {
        for (let y = 0; y < data.height; y++) {
            const pixel = getPixel(data, x, y);
            const v = 0.2126 * pixel.r + 0.7152 * pixel.g + 0.0722 * pixel.b;
            writePixel(result, x, y, v, v, v);
        }
    }

    outputCtx.putImageData(result, 0, 0);
};

export function brighten(input: HTMLCanvasElement, output: HTMLCanvasElement, brighten: number) {
    const inputCtx = input.getContext("2d") as CanvasRenderingContext2D;
    const outputCtx = output.getContext("2d") as CanvasRenderingContext2D;

    const data = inputCtx.getImageData(0, 0, input.width, input.height);
    const result = inputCtx.getImageData(0, 0, input.width, input.height);

    for (let x = 0; x < data.width; x++) {
        for (let y = 0; y < data.height; y++) {
            const pixel = getPixel(data, x, y);
            const [r, g, b] = [pixel.r + brighten, pixel.g + brighten, pixel.b + brighten]

            writePixel(result, x, y, r, g, b);
        }
    }

    outputCtx.putImageData(result, 0, 0);
};

export function threshold(input: HTMLCanvasElement, output: HTMLCanvasElement, threshold: number) {
    const inputCtx = input.getContext("2d") as CanvasRenderingContext2D;
    const outputCtx = output.getContext("2d") as CanvasRenderingContext2D;

    const data = inputCtx.getImageData(0, 0, input.width, input.height);
    const result = inputCtx.getImageData(0, 0, input.width, input.height);

    for (let x = 0; x < data.width; x++) {
        for (let y = 0; y < data.height; y++) {
            const pixel = getPixel(data, x, y);
            const v = 0.2126 * pixel.r + 0.7152 * pixel.g + 0.0722 * pixel.b;
            const t = v > threshold ? 0 : 255;

            writePixel(result, x, y, t, t, t);
        }
    }

    outputCtx.putImageData(result, 0, 0);
};

export function blur(input: HTMLCanvasElement, output: HTMLCanvasElement) {
    const kernel = [
        [1 / 9, 1 / 9, 1 / 9],
        [1 / 9, 1 / 9, 1 / 9],
        [1 / 9, 1 / 9, 1 / 9],
    ]
    convolute(input, output, kernel);
}

export function sharpen(input: HTMLCanvasElement, output: HTMLCanvasElement) {
    const kernel = [
        [0, -1, 0],
        [-1, 5, -1],
        [0, -1, 0]
    ]
    convolute(input, output, kernel);
}

export function sobel(input: HTMLCanvasElement, output: HTMLCanvasElement) {
    const kernel1 = [
        [-1, 0, 1],
        [-2, 0, 2],
        [-1, 0, 1]
    ];
    const kernel2 = [
        [-1, -2, -1],
        [0, 0, 0],
        [1, 2, 1]
    ];
    convolute(input, output, kernel1, 0.5);
    convolute(input, output, kernel2, 0.5);
}

export function medianGrayscale(input: HTMLCanvasElement, output: HTMLCanvasElement, kernelWidth: number) {
    const inputCtx = input.getContext("2d") as CanvasRenderingContext2D;
    const outputCtx = output.getContext("2d") as CanvasRenderingContext2D;

    const data = inputCtx.getImageData(0, 0, input.width, input.height);
    const result = inputCtx.getImageData(0, 0, input.width, input.height);

    const hw = Math.floor(kernelWidth / 2);

    for (let x = 0; x < data.width; x++) {
        for (let y = 0; y < data.height; y++) {
            const pixelsAround = [];
            for (let xx = x - hw; xx <= x + hw; xx++) {
                for (let yy = y - hw; yy <= y + hw; yy++) {
                    const pixel = getPixel(data, xx, yy);
                    const intensity = getIntensity(pixel);
                    pixelsAround.push(intensity);
                }
            }
            // median
            const value = pixelsAround.sort((a, b) => a - b)[Math.floor(pixelsAround.length / 2)];
            writePixel(result, x, y, value, value, value, 255);
        }
    }

    outputCtx.putImageData(result, 0, 0);
}

export function median(input: HTMLCanvasElement, output: HTMLCanvasElement, kernelWidth: number) {
    const inputCtx = input.getContext("2d") as CanvasRenderingContext2D;
    const outputCtx = output.getContext("2d") as CanvasRenderingContext2D;

    const data = inputCtx.getImageData(0, 0, input.width, input.height);
    const result = inputCtx.getImageData(0, 0, input.width, input.height);

    const hw = Math.floor(kernelWidth / 2);

    for (let x = 0; x < data.width; x++) {
        for (let y = 0; y < data.height; y++) {
            const rPixelsAround = [];
            const gPixelsAround = [];
            const bPixelsAround = [];
            for (let xx = x - hw; xx <= x + hw; xx++) {
                for (let yy = y - hw; yy <= y + hw; yy++) {
                    const pixel = getPixel(data, xx, yy);
                    rPixelsAround.push(pixel.r);
                    gPixelsAround.push(pixel.g);
                    bPixelsAround.push(pixel.b);
                }
            }
            // median
            const r = rPixelsAround.sort((a, b) => a - b)[Math.floor(rPixelsAround.length / 2)];
            const g = gPixelsAround.sort((a, b) => a - b)[Math.floor(gPixelsAround.length / 2)];
            const b = bPixelsAround.sort((a, b) => a - b)[Math.floor(bPixelsAround.length / 2)];
            writePixel(result, x, y, r, g, b, 255);
        }
    }

    outputCtx.putImageData(result, 0, 0);
}

export function convolute(input: HTMLCanvasElement, output: HTMLCanvasElement, kernel: number[][], adjust: number = 0) {
    const inputCtx = input.getContext("2d") as CanvasRenderingContext2D;
    const outputCtx = output.getContext("2d") as CanvasRenderingContext2D;

    const data = inputCtx.getImageData(0, 0, input.width, input.height);
    const result = inputCtx.getImageData(0, 0, input.width, input.height);

    // half of kernel's width
    const hw = Math.floor(kernel[0].length / 2);
    const opaque = 0;

    for (let x = 0; x < data.width; x++) {
        for (let y = 0; y < data.height; y++) {
            let [r, g, b, a] = [0, 0, 0, 0];

            // xx and yy represent the position where the kernel will be applied
            // kx and ky represent the kernel itself
            for (let xx = x - hw, kx = 0; xx <= x + hw; xx++, kx++) {
                for (let yy = y - hw, ky = 0; yy <= y + hw; yy++, ky++) {
                    const kernelWeigth = kernel[ky][kx];

                    const pixel = getPixel(data, xx, yy);
                    r += pixel.r * kernelWeigth;
                    g += pixel.g * kernelWeigth;
                    b += pixel.b * kernelWeigth;
                    a += pixel.a * kernelWeigth;
                }
            }

            // in some cases there is a need for adjust depending on kernel values,
            // where they can result in numbers above the 2^8 (the limit for rgb values)
            if (adjust) {
                r *= adjust;
                g *= adjust;
                b *= adjust;
                a = 255;
            }

            writePixel(result, x, y, r, g, b, a + opaque * (255 - a));
        }
    }

    outputCtx.putImageData(result, 0, 0);
}