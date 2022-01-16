class Render{
	constructor(callback){
		var self = this;
		this.msLastFrame = null;
		this.callBack = callback;

		this.run = function(){
			var msCurrent = performance.now();
			var deltaTime = (msCurrent - self.msLastFrame) / 1000.0;
			self.fps = Math.floor(1/deltaTime);
			self.msLastFrame = msCurrent;
			self.callBack(deltaTime);
			window.requestAnimationFrame(self.run);
		}
	}

	start(){
		this.msLastFrame = performance.now();
		window.requestAnimationFrame(this.run);
		return this;
	}
}