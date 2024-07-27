if ("__TAURI__" in window) {
	var __TAURI_PLUGIN_UPDATER__ = (function (e) {
		"use strict";
		function t(e, t, s, n) {
			if ("a" === s && !n)
				throw new TypeError(
					"Private accessor was defined without a getter",
				);
			if ("function" == typeof t ? e !== t || !n : !t.has(e))
				throw new TypeError(
					"Cannot read private member from an object whose class did not declare it",
				);
			return "m" === s
				? n
				: "a" === s
					? n.call(e)
					: n
						? n.value
						: t.get(e);
		}
		function s(e, t, s, n, i) {
			if ("function" == typeof t ? e !== t || !i : !t.has(e))
				throw new TypeError(
					"Cannot write private member to an object whose class did not declare it",
				);
			return t.set(e, s), s;
		}
		var n, i, r, a;
		"function" == typeof SuppressedError && SuppressedError;
		class o {
			constructor() {
				(this.__TAURI_CHANNEL_MARKER__ = !0),
					n.set(this, () => {}),
					i.set(this, 0),
					r.set(this, {}),
					(this.id = (function (e, t = !1) {
						return window.__TAURI_INTERNALS__.transformCallback(
							e,
							t,
						);
					})(({ message: e, id: a }) => {
						if (a === t(this, i, "f")) {
							s(this, i, a + 1), t(this, n, "f").call(this, e);
							const o = Object.keys(t(this, r, "f"));
							if (o.length > 0) {
								let e = a + 1;
								for (const s of o.sort()) {
									if (parseInt(s) !== e) break;
									{
										const i = t(this, r, "f")[s];
										delete t(this, r, "f")[s],
											t(this, n, "f").call(this, i),
											(e += 1);
									}
								}
								s(this, i, e);
							}
						} else t(this, r, "f")[a.toString()] = e;
					}));
			}
			set onmessage(e) {
				s(this, n, e);
			}
			get onmessage() {
				return t(this, n, "f");
			}
			toJSON() {
				return `__CHANNEL__:${this.id}`;
			}
		}
		async function d(e, t = {}, s) {
			return window.__TAURI_INTERNALS__.invoke(e, t, s);
		}
		(n = new WeakMap()), (i = new WeakMap()), (r = new WeakMap());
		class l {
			get rid() {
				return t(this, a, "f");
			}
			constructor(e) {
				a.set(this, void 0), s(this, a, e);
			}
			async close() {
				return d("plugin:resources|close", { rid: this.rid });
			}
		}
		a = new WeakMap();
		class c extends l {
			constructor(e) {
				super(e.rid),
					(this.available = e.available),
					(this.currentVersion = e.currentVersion),
					(this.version = e.version),
					(this.date = e.date),
					(this.body = e.body);
			}
			async download(e) {
				const t = new o();
				e && (t.onmessage = e);
				const s = await d("plugin:updater|download", {
					onEvent: t,
					rid: this.rid,
				});
				this.downloadedBytes = new l(s);
			}
			async install() {
				if (!this.downloadedBytes)
					throw new Error(
						"Update.install called before Update.download",
					);
				await d("plugin:updater|install", {
					updateRid: this.rid,
					bytesRid: this.downloadedBytes.rid,
				}),
					(this.downloadedBytes = void 0);
			}
			async downloadAndInstall(e) {
				const t = new o();
				e && (t.onmessage = e),
					await d("plugin:updater|download_and_install", {
						onEvent: t,
						rid: this.rid,
					});
			}
			async close() {
				await this.downloadedBytes?.close(), await super.close();
			}
		}
		return (
			(e.Update = c),
			(e.check = async function (e) {
				return (
					e?.headers &&
						(e.headers = Array.from(
							new Headers(e.headers).entries(),
						)),
					await d("plugin:updater|check", { ...e }).then((e) =>
						e.available ? new c(e) : null,
					)
				);
			}),
			e
		);
	})({});
	Object.defineProperty(window.__TAURI__, "updater", {
		value: __TAURI_PLUGIN_UPDATER__,
	});
}
