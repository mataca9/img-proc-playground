interface IPixel {
    r: number;
    g: number;
    b: number;
    a: number;
}

export function getPixel(image: ImageData, x: number, y: number): IPixel {
    const position = (x + image.width * y) * 4;
    const d = image.data;
    const pixel = {
        r: d[position],
        g: d[position + 1],
        b: d[position + 2],
        a: d[position + 3]
    };

    return pixel;
}

export function writePixel(image: ImageData,x: number, y: number, r: number, g: number, b: number, a = 255) {
    const position = (x + image.width * y) * 4;
    const d = image.data;
    [d[position],
    d[position + 1],
    d[position + 2],
    d[position + 3]] = [r, g, b, a];
}

export function drawImage(canvas: HTMLCanvasElement, img: HTMLImageElement) {
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    canvas.width = img.width;
    canvas.height = img.height;
    ctx
        .drawImage(
            img,
            0,
            0,
            img.width,
            img.height,
            0,
            0,
            canvas.width,
            canvas.height
        );
}

export function getIntensity({ r, g, b }: IPixel) {
    return Math.floor(0.2126 * r + 0.7152 * g + 0.0722 * b);
}

export class Deboucer {
    public timeout: any;

    debouce(callback: Function, deboucedTime: number) {
        if (this?.timeout) {
            clearTimeout(this.timeout);
        }

        this.timeout = setTimeout(callback, deboucedTime);
    }
}