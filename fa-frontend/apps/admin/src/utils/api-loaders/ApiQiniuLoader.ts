let mainPromise: any = null;

const scriptList = ['/plugins/qiniu/qiniu-js@2.5.1/qiniu.min.js'];
/* eslint-disable no-undef */
/**
 * 七牛云js上传插件
 */
export default class ApiQiniuLoader {
	buildScriptTag(src: string) {
		const script = document.createElement('script');
		script.type = 'text/javascript';
		script.async = false;
		script.defer = true;
		script.src = src;
		return script;
	}

	getPromise() {
		if (window.qiniu) {
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
			return null;
		}
		mainPromise = this.getPromise();
		return new Promise<void>((resolve) => {
			mainPromise.then(() => {
				if (window.qiniu) {
					// console.log('qiniu', window.qiniu);
				}
				resolve();
			});
		});
	}
}
