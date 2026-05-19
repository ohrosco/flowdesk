export class NextResponse {
  static json(body, init = {}) {
    const res = new NextResponse(JSON.stringify(body), {
      status: init.status || 200,
      headers: { 'Content-Type': 'application/json', ...init.headers },
    });
    res._bodyJson = body;
    res._status = init.status || 200;
    return res;
  }

  constructor(body, init = {}) {
    this._body = body;
    this._status = init.status || 200;
    this.headers = new Map(Object.entries(init.headers || {}));
    this.headers.get = function (name) {
      return this.get(name);
    };
    // Make headers work like real Headers object
    const headersMap = new Map(Object.entries(init.headers || {}));
    headersMap.get = function (name) {
      for (const [k, v] of this) {
        if (k.toLowerCase() === name.toLowerCase()) return v;
      }
      return null;
    };
    this.headers = headersMap;
  }

  async text() {
    return this._body;
  }
}