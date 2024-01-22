async function main(canvas){
    const ee31 = new EightyEightByThirtyOne(canvas, 100, 1000 / 12);
  
    const magicBase = await Sprite.create("./assets/magic.png", 27, 24, 4, 4);
  	const magicYellow = await Sprite.create("./assets/magic.png", 27, 24, 4, 4);
  
  	await magicYellow.mapColors(([r, g, b, a]) => {
        if (r > 0){
          return [255, 255, 0, 255];
      }
      return [0, 0, 0, 255]
    });

    
    ee31.attachLayerFunction('magic', (ee31, frame) => {
        const ctx = ee31.ctx;
        
      	magicBase.render(ctx, frame % 16);
      	magicYellow.render(ctx, frame % 16);
      	
    }, (ee31)=> {
        magicBase.to(10, 2);
      	magicYellow.to(50, 2);
    });
  
    const url = await ee31.renderGif();
    document.getElementById('badge').src = url;
    document.getElementById('badge').style.display = 'block';
  }