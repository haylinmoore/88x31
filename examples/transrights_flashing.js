async function main(canvas){
    const ee31 = new EightyEightByThirtyOne(canvas, 69, 1000 / 12);

    const backdrop = await Sprite.create("./assets/backdrop_mario.png", 88, 31, 1, 1);
    const toad = await Sprite.create("./assets/toad.png", 18, 27, 8, 4);
    const speechBubble = await Sprite.create("./assets/speech_bubble.png", 88, 31, 1, 1);
    const font = await Font.create("./assets/spleen-8x16.png", 8, 16, 95, 1, " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~");
  
  	// Cursed but legal
  	const fontColors = [];
    await font.mapColors(([r, g, b, a]) => {
      	if (r > 0){
            return [245, 169, 184, 255];
        }
        return [0, 0, 0, 0]
    });
  	fontColors.push(font.image);
  
  	await font.mapColors(([r, g, b, a]) => {
      	if (r > 0){
            return [91, 206, 250, 255];
        }
        return [0, 0, 0, 0]
    });
  	fontColors.push(font.image);

    ee31.attachLayerFunction('background', (ee31, frame) => {
        const ctx = ee31.ctx;
        backdrop.render(ctx, 0);
    });
    
    ee31.attachLayerFunction('toad', (ee31, frame) => {
        const ctx = ee31.ctx;
        if (frame < 16) {
            toad.move(2, 0);
            toad.render(ee31.ctx, 24 + (frame % 8));
        } else if (frame < 32) {
            // Toad should now be at x = 22
            toad.render(ee31.ctx, 0)
            if (frame > 17 && frame < 30){
                speechBubble.render(ee31.ctx, 0);
                
                font.to(37, 3);
              	let text = "TRANS";
                let color = frame % 2;
              	for (let i = 0; i < text.length; i++){
                  color = (!color) + 0
                  font.image = fontColors[color];
                  font.renderText(ee31.ctx, text[i]);
				}
              
                font.to(34, 14);
              	text = "RIGHTS";
              	for (let i = 0; i < text.length; i++){
                  color = (!color) + 0
                  font.image = fontColors[color];
                  font.renderText(ee31.ctx, text[i]);
				}
            }
        } else {
            toad.move(2, 0);
            toad.render(ee31.ctx, 24 + (frame % 8));
        }
    }, (ee31)=> {
        toad.to(-18, 1);
        speechBubble.to(0, 1)
    });

    const url = await ee31.renderGif();
    document.getElementById('badge').src = url;
    document.getElementById('badge').style.display = 'block';
}