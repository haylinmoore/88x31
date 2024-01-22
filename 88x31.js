class EightyEightByThirtyOne {
    
    constructor(canvas, frameCount, delay) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.mozImageSmoothingEnabled = false;
        this.ctx.webkitImageSmoothingEnabled = false;

        this.frameCount = frameCount;
        this.delay = delay;
        this.layers = [];
    }

    attachLayerFunction(layer, func, reset) {
        if (reset === undefined) {
            reset = () => {};
        }

        this.layers.push({layer: layer, func: func, reset: reset});
    }

    draw(frame) {
        console.log("Drawing frame " + frame);
        this.ctx.clearRect(0, 0, 88, 31);

        if (frame === 0) {
            for (let layer of this.layers) {
                layer.reset(this);
            }
        }

        for (let layer of this.layers) {
            layer.func(this, frame);
        }
    }

    renderLoop() {
        let frame = 0;
        let interval = setInterval(() => {
            this.draw(frame);
            frame++;
            if (frame > this.frameCount) {
                frame = 0;
            }
        }, this.delay);

        return interval;
    }

    async renderGif() {
        let gifLoading = await fetch('https://cdn.jsdelivr.net/npm/gif.js@0.2.0/dist/gif.worker.js');
        let workerBlob = await gifLoading.blob();
        let container = this.canvas;
        let gif = new GIF({
            workers: 1,
            workerScript: URL.createObjectURL(workerBlob),
            quality: 0,
            width: 88,
            height: 31
        });

        let frame = 0;
        for (let i = 0; i < this.frameCount; i++) {
            this.draw(frame);
            frame++;
            if (frame > this.frameCount) {
                frame = 0;
            }
            gif.addFrame(this.ctx, {copy: true, delay: this.delay});
        }

        let promise = new Promise((resolve, reject) => {
            gif.on('finished', function(blob) {
                let url = URL.createObjectURL(blob);
                return resolve(url);
            });
        });

        gif.render();

        return promise;
    }

    async renderAPNG() {
        var encoder = new APNGencoder(this.canvas);

        encoder.setDelay(this.delay / 10);
        encoder.setRepeat(0);

        encoder.start();

        let frame = 0;
        for (let i = 0; i < this.frameCount; i++) {
            this.draw(frame);
            frame++;
            if (frame > this.frameCount) {
                frame = 0;
            }
            encoder.addFrame(this.ctx);
        }

        encoder.finish();
        /* To facilitate processing, a special object ByteArray is defined. The animation is stored in an instance of ByteArray, part of the application. It hold an array of unsigned integers with some specific methods to process PNG data.
The resulting ByteArray can be asked by encoder.stream() and the array by encoder.stream().bin
Some useful methods facilitates debugging and converting the instance of a ByteArray object.*/

        const base64 = bytesToBase64(encoder.stream().bin);
        const url = 'data:image/png;base64,' + base64;
        return fetch(url).then(res => res.blob()).then(blob => URL.createObjectURL(blob));
    }

}

const fillPixel = (ctx, x, y) => {
    ctx.fillRect(x, y, 1, 1);
}


class Sprite {
    constructor(ctx, image, spriteWidth, spriteHeight, columns, rows) {
        this.ctx = ctx;
        this.image = image;
        this.spriteWidth = spriteWidth;
        this.spriteHeight = spriteHeight;
        this.columns = columns;
        this.rows = rows;

        this.x = 0;
        this.y = 0;
    }

    static async create(ctx, imageUrl, spriteWidth, spriteHeight, columns, rows) {
        const image = new Image();
        await new Promise((resolve, reject) => {
            image.onload = () => resolve();
            image.onerror = reject;
            image.src = imageUrl;
        });
        return new Sprite(ctx, image, spriteWidth, spriteHeight, columns, rows);
    }

    to(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }

    move(x, y) {
        this.x += x;
        this.y += y;
        return this;
    }

    // Render a sprite at the specified index to position (x, y) on the canvas context
    render(index) {
        const ctx = this.ctx;

        const column = index % this.columns;
        const row = Math.floor(index / this.columns);
        const spriteX = column * this.spriteWidth;
        const spriteY = row * this.spriteHeight;

        ctx.drawImage(
            this.image, 
            spriteX, 
            spriteY, 
            this.spriteWidth, 
            this.spriteHeight, 
            this.x, 
            this.y, 
            this.spriteWidth, 
            this.spriteHeight
        );

        return this;
    }

    async mapColors(colorFunc) {
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        canvas.width = this.spriteWidth * this.columns;
        canvas.height = this.spriteHeight * this.rows;
        ctx.drawImage(this.image, 0, 0);
        let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            let r = data[i];
            let g = data[i + 1];
            let b = data[i + 2];
            let a = data[i + 3];
            [r, g, b, a] = colorFunc([r, g, b, a]);
            data[i] = r;
            data[i + 1] = g;
            data[i + 2] = b;
            data[i + 3] = a;
        }
        ctx.putImageData(imageData, 0, 0);
        
        // convert canvas to image
        let image = new Image();
        image.src = canvas.toDataURL();
        this.image = image;

        let promise = new Promise((resolve, reject) => {
            image.onload = () => resolve();
            image.onerror = reject;
        });
        
        await promise;
        return this;
    }
}

class Font extends Sprite {
    constructor(ctx, image, spriteWidth, spriteHeight, columns, rows, characters) {
        super(ctx, image, spriteWidth, spriteHeight, columns, rows);
        this.characters = characters;
    }

    static async create(ctx, imageUrl, spriteWidth, spriteHeight, columns, rows, characters) {
        const image = new Image();
        await new Promise((resolve, reject) => {
            image.onload = () => resolve();
            image.onerror = reject;
            image.src = imageUrl;
        });
        return new Font(ctx, image, spriteWidth, spriteHeight, columns, rows, characters);
    }

    renderText(text) {
        for (let i = 0; i < text.length; i++) {
            let char = text[i];
            let index = this.characters.indexOf(char);
            if (index === -1) {
                throw new Error('Character "' + char + '" not found in font.');
            }
            this.render(index);
            this.move(this.spriteWidth, 0);
        }
    }
}