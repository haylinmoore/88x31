async function main(canvas){
    const ee31 = new EightyEightByThirtyOne(canvas, 1, 1000);
    const ctx = ee31.ctx;

    const font = await Font.create(ctx, "./assets/space_channel_text.png", 30, 30, 10, 10, "!\"#$%&'()*+-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~");

    ee31.attachLayerFunction('background', (ee31, frame) => {
      	font.to(0, 2);
      	font.renderText("H");
      	font.move(-14, 0);
        font.renderText("e");
      	font.move(-15, 0);
        font.renderText("l");
      	font.move(-19, 0);
        font.renderText("l");
      	font.move(-17, 0);
        font.renderText("o");
      	font.move(-18, 2);
        font.renderText("!");
    });

    const url = await ee31.renderGif();
    document.getElementById('badge').src = url;
    document.getElementById('badge').style.display = 'block';
}