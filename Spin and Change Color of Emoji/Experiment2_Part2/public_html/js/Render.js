class Render{
	constructor(callback){
		var self = this;
		this.msLastFrame = null;
		this.callBack = callback;

		this.run = function(){
			var msCurrent = performance.now();
			self.callBack(msCurrent);
			window.requestAnimationFrame(self.run);
		};
	}

	start(){
		this.msLastFrame = performance.now();
		window.requestAnimationFrame(this.run);
		return this;
	}
}