let mainPromise: any = null;

const scriptList = ['https://webapi.amap.com/ui/1.1/main.js'];

/* eslint-disable no-undef */
/**
 * 高德地图-AMapUI 组件库
 * https://lbs.amap.com/api/amap-ui/intro
 */
export default class AMapUILoader {
	buildScriptTag(src: string) {
		const script = document.createElement('script');
		script.type = 'text/javascript';
		script.async = false;
		script.defer = true;
		script.src = src;
		return script;
	}

	getPromise() {
		if (window.AMapUI) {
			return Promise.resolve();
		}
		const ps = scriptList.map((s) => {
			const script = this.buildScriptTag(s);
			return new Promise<void>((resolve) => {
				script.onload = () => {
					resolve();
				};
				document.body.appendChild(script);
			});
		});
		return Promise.all(ps);
	}

	load() {
		if (typeof window === 'undefined') {
			return Promise.reject(new Error('window is undefined'));
		}
		mainPromise = this.getPromise();
		return new Promise<void>((resolve) => {
			mainPromise.then(() => {
				if (window.AMapUI) {
					// console.log('qiniu', window.qiniu);
				}
				resolve();
			});
		});
	}
}
