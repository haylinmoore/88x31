async function main(canvas){
  const ee31 = new EightyEightByThirtyOne(canvas, 100, 1000 / 12);
  const ctx = ee31.ctx;

  const magikoopa = await Sprite.create(ctx, "./assets/magikoopa.png", 24, 31, 4, 3);
  const magic = await Sprite.create(ctx, "./assets/magic.png", 27, 24, 4, 4);
  const font = await Font.create(ctx, "./assets/spleen-8x16.png", 8, 16, 95, 1, " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~");

  await font.mapColors(([r, g, b, a]) => {
      if (r > 0){
        return [255, 255, 255, 255];
    }
    return [0, 0, 0, 0]
  });
  
  ee31.attachLayerFunction('magikoopa', (ee31, frame) => {
      const ctx = ee31.ctx;
    
      if (frame <= 7) {
          magikoopa.render(frame % 8);
      } else if (frame > 7 && frame <= 10) {
          magikoopa.render(7);
      } else if (frame >= 11 && frame <= 19) {
          magikoopa.render(Math.floor((frame - 11) / 3) + 8);
      } else if (frame > 19 && frame < 60) {
          magikoopa.render(10);
      } else if (frame >= 60 && frame < 64) {
          magikoopa.render(7);
      } else if (frame >= 64 && frame <= 72) {
          magikoopa.render(7 - (frame - 64));
      }
  });

  ee31.attachLayerFunction('hammy', (ee31, frame) => {
      const ctx = ee31.ctx;
      
      let text = "hammy";
      
      if (frame > 20 && frame <= 70) {
        text = text.slice(0, Math.max((frame - 20) / 4.2, 0));
        font.to(35, 7);
        font.renderText(text);
      }
      if (frame > 70) {
        text = text.slice(0, 5 - Math.max((frame - 70) / 4.2, 0));
        font.to(35, 7);
        font.renderText(text);
  }
  });

  ee31.attachLayerFunction('magic', (ee31, frame) => {
      const ctx = ee31.ctx;
      
      if (frame >= 20) {
        magic.move(2, 0);
          magic.render(frame % 16);
      }
      
  }, (ee31)=> {
      magic.to(10, 2);
  });

  const url = await ee31.renderGif();
  document.getElementById('badge').src = url;
  document.getElementById('badge').style.display = 'block';
}