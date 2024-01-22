async function main(canvas){
    const ee31 = new EightyEightByThirtyOne(canvas, 100, 1000 / 12);
  
    const font_5_8 = await Font.create("./assets/spleen-5x8.png", 5, 8, 95, 1, " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~");
    const font_6_12 = await Font.create("./assets/spleen-6x12.png", 6, 12, 95, 1, " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~");
    const font_8_16 = await Font.create("./assets/spleen-8x16.png", 8, 16, 95, 1, " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~");
  	const font_12_24 = await Font.create("./assets/spleen-12x24.png", 12, 24, 95, 1, " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~");

  	ee31.attachLayerFunction('text', (ee31, frame) => {
        const ctx = ee31.ctx;
        
      	font_12_24.to(28, -2);
      	font_12_24.renderText(ctx, "12x24");
      
        font_5_8.to(2, 0);
        font_5_8.renderText(ctx, "5x8");
        font_6_12.to(2, 8);
        font_6_12.renderText(ctx, "6x12");
        font_8_16.to(2, 18);
      	font_8_16.renderText(ctx, "8x20");
    });
  
    const url = await ee31.renderGif();
    document.getElementById('badge').src = url;
    document.getElementById('badge').style.display = 'block';
  }