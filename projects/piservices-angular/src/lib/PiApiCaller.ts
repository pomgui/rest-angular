import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { PiTypeDescriptor } from 'piservices-common';

export interface PiApiParams {
    path?: { [name: string]: any };
    query?: { [name: string]: any };
    body?: { [name: string]: any };
    headers?: { [name: string]: any };
}

export class PiApiCaller {
    basePath: string = '';
    errorHandler: { (error) };

    constructor(private _http: HttpClient) { }

    get(url: string, params?: PiApiParams, desc?: PiTypeDescriptor): Promise<any> { return this._request('get', url, params, desc); }
    post(url: string, params?: PiApiParams, desc?: PiTypeDescriptor): Promise<any> { return this._request('post', url, params, desc); }
    put(url: string, params?: PiApiParams, desc?: PiTypeDescriptor): Promise<any> { return this._request('put', url, params, desc); }
    patch(url: string, params?: PiApiParams, desc?: PiTypeDescriptor): Promise<any> { return this._request('patch', url, params, desc); }
    delete(url: string, params?: PiApiParams, desc?: PiTypeDescriptor): Promise<any> { return this._request('delete', url, params, desc); }

    private _request(method: string, url: string, params: PiApiParams = {}, desc?: PiTypeDescriptor): Promise<any> {
        let me = this;
        this._normalizeParams(params, desc);
        url = makeUrl(url, params);
        return this._http.request<any>(
            method,
            url,
            <any>{
                body: params.body && Object.values(params.body)[0],
                headers: params.headers && normalizeHeaders(params.headers),
                observe: 'response',
                params: params.query,
                responseType: 'json'
            })
            .pipe(
                catchError(e => {
                    if (this.errorHandler) this.errorHandler(e);
                    throw e;
                })
            )
            .toPromise();

        function makeUrl(url: string, params: PiApiParams): string {
            url = me.basePath + url;
            if (params.path)
                return url.replace(/:(\w+)/g, (g, p) => params.path[p]);
            else
                return url;
        }
        function normalizeHeaders(headers: object): object {
            Object.entries(headers)
                .forEach(([name, value]) =>
                    typeof value != 'string' && (headers[name] = String(value)));
            return headers;
        }
    }

    private _normalizeParams(params: PiApiParams, desc?: PiTypeDescriptor) {
        if (!desc) return;
        let sent: string[] = [];
        normalize(params.path);
        normalize(params.query);
        normalize(params.headers);
        normalize(params.body);
        validateNotSentRequired();
        return;

        function normalize(obj: any) {
            if (!obj) return;
            Object.keys(obj)
                .forEach(name => {
                    desc.get(name).cast(obj);
                    sent.push(name);
                });
        }
        function validateNotSentRequired() {
            let reqlist = desc.asArray()
                .filter(f => f.required && !sent.includes(f.name));
            let reqNotSent = reqlist
                .map(f => f.name);
            if (reqNotSent.length)
                throw new Error(`Fields [${reqNotSent.toString()}] are required, but not found`);
        }
    }
}