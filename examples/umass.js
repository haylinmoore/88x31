async function main(canvas){
    const ee31 = new EightyEightByThirtyOne(canvas, 1, 1000);
    const ctx = ee31.ctx;

    const sam = await Sprite.create(ctx, "./assets/sam.png", 23, 27, 1, 1);
    const font = await Font.create(ctx, "./assets/spleen-8x16.png", 8, 16, 95, 1, " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~");
  
    await font.mapColors(([r, g, b, a]) => {
        if (r == 0){
            return [0, 0, 0, 0];
        }
        return [0, 0, 0, 255]
    });
  
    ee31.attachLayerFunction('draw', (ee31, frame) => {
        const ctx = ee31.ctx;
      
        ctx.fillStyle = "rgb(136, 28, 28)";
        ctx.fillRect(0, 0, 88, 31);

        ctx.fillStyle = "black";
        for (let i = 0; i < 31; i+=3) {
            fillPixel(ctx, 0, i)
          	fillPixel(ctx, 87, i)
        }
      	for (let i = 0; i < 88; i+=3) {
            fillPixel(ctx, i, 0)
          	fillPixel(ctx, i, 30)
        }

      	font.to(36, 2);
        font.renderText("UMass");
      	font.to(29, 14);
        font.renderText("Amherst");
      
        sam.to(5, 2);
      	sam.render(0);
    });

    return ee31.renderGif();
}