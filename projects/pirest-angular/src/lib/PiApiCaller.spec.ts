import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { PiApiCaller } from './PiApiCaller';
import { PiRestAngularModule } from './pirest-angular.module';
import { PiTypeDescriptor, PiFieldDescriptor, PiJstype, PiDescriptor } from 'pirest-lib';

const mockClient = {
    name: 'Juan',
    age: 25
};
const desc = new PiTypeDescriptor([
    new PiFieldDescriptor(F('name', 'string', true)),
    new PiFieldDescriptor(F('id', 'integer', true)),
    new PiFieldDescriptor(F('status', 'string', false, true)),
    new PiFieldDescriptor(F('dates', 'date', false, true))
]).render();

var ctrl: HttpTestingController;
var api: PiApiCaller;

function setup() {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, PiRestAngularModule]
        });
        ctrl = TestBed.get(HttpTestingController);
        api = TestBed.get(PiApiCaller);
        api.basePath = '/ws';
    });

    afterEach(() => ctrl.verify());
}

function mockHttp(ctrl: HttpTestingController, method: string, url: string, mockValue: any, validate?: { (req: TestRequest) }, error?: any) {
    const req = ctrl.expectOne(url);
    expect(req.request.method).toEqual(method);
    if (validate)
        validate(req);
    // If not value, returns the body sent in the request
    if (!mockValue)
        mockValue = req.request.body;
    req.flush(mockValue, error);
}

describe('PiApiCaller', () => {
    setup();

    it('Should be created and basePath settled', () => {
        expect(api).toBeTruthy();
        expect(api.basePath).toEqual('/ws');
    });
});

describe('GET tests', () => {
    setup();

    it('without parameters', () => {
        api.get('/clients').then(res => expect(res.body.name).toEqual(mockClient.name));
        mockHttp(ctrl, 'GET', '/ws/clients', mockClient);
    })

    it('with 1 path parameters', () => {
        api.get('/clients/:id', { path: { id: 12 } }).then(res => expect(res.body.name).toEqual(mockClient.name));
        mockHttp(ctrl, 'GET', '/ws/clients/12', mockClient);
    })

    it('with various path parameters', () => {
        api.get('/clients/:id/pics/:picId', { path: { id: 12, picId: 'xyz' } }).then(res => expect(res.body.name).toEqual(mockClient.name));
        mockHttp(ctrl, 'GET', '/ws/clients/12/pics/xyz', mockClient);
    })

    it('with query parameters', () => {
        api.get('/clients', { query: { id: 12, picId: 'xyz' } }).then(res => expect(res.body.name).toEqual(mockClient.name));
        mockHttp(ctrl, 'GET', '/ws/clients?id=12&picId=xyz', mockClient);
    })

    it('with header parameters', () => {
        api.get('/clients', { headers: { id: 12, picId: 'xyz' } }).then(res => expect(res.body.name).toEqual(mockClient.name));
        mockHttp(ctrl, 'GET', '/ws/clients', mockClient, req => {
            expect(req.request.headers.has('picId')).toBe(true);
            expect(req.request.headers.has('id')).toBe(true);
        });
    })
});

describe('GET tests validating parameters before send', () => {
    setup();

    it('with path parameters and query param', () => {
        api.get('/clients/:id', { path: { id: '12' }, query: { name: 'x' } }, desc).then(res => expect(res.body.name).toEqual(mockClient.name));
        mockHttp(ctrl, 'GET', '/ws/clients/12?name=x', mockClient);
    })

    it('with unknown path parameters', () => {
        expect(() =>
            api.get('/clients/:id/pics/:picId', { path: { id: 12, name: 'x', picId: 'xyz' } }, desc)
        ).toThrowError(/Field 'picId' unknown/)
    })

    it('with body parameters', () => {
        let dates = [12345, '12/24/2019', '2019-10-22'];
        api.post('/clients', { query: { id: 1, name: 'x' }, body: { dates } }, desc)
            .then(res => expect(res.body).toEqual(dates.map(d => new Date(d))));
        mockHttp(ctrl, 'POST', '/ws/clients?id=1&name=x', null, req => {
            expect(req.request.body).toEqual(dates.map(d => new Date(d)));
        });
    })

    it('with required parameters == null', () => {
        expect(() => api.post('/clients', { body: { id: null, name: 'xx' } }, desc))
            .toThrowError(/is required!/)
    })

    it('with required parameters not sent', () => {
        expect(() => api.post('/clients', { body: { id: 1 } }, desc))
            .toThrowError(/are required, but not found/)
    })
});

describe('POST tests', () => {
    setup();

    it('without parameters', () => {
        api.post('/clients').then(res => expect(res.body).toEqual('nobody'));
        mockHttp(ctrl, 'POST', '/ws/clients', 'nobody');
    })

    it('with path parameters', () => {
        api.post('/clients/:id/pics', { path: { id: 12 } }).then(res => expect(res.body).toEqual('nobody'));
        mockHttp(ctrl, 'POST', '/ws/clients/12/pics', 'nobody');
    })

    it('with query parameters', () => {
        api.post('/clients', { query: { id: 12, picId: 'xyz' } }).then(res => expect(res.body).toEqual('nobody'));
        mockHttp(ctrl, 'POST', '/ws/clients?id=12&picId=xyz', 'nobody');
    })

    it('with header parameters', () => {
        api.post('/clients', { headers: { id: 12, picId: 'xyz' } }).then(res => expect(res.body).toEqual('nobody'));
        mockHttp(ctrl, 'POST', '/ws/clients', 'nobody', req => {
            expect(req.request.headers.has('picId')).toBe(true);
            expect(req.request.headers.has('id')).toBe(true);
        });
    })

    it('with body parameter', () => {
        api.post('/clients', { body: { mockClient } }).then(res => expect(res.body.name).toEqual(mockClient.name));
        mockHttp(ctrl, 'POST', '/ws/clients', null);
    })
});

describe('PUT tests', () => {
    setup();

    it('without parameters', () => {
        api.put('/clients').then(res => expect(res.body).toEqual('nobody'));
        mockHttp(ctrl, 'PUT', '/ws/clients', 'nobody');
    })

    it('with path parameters', () => {
        api.put('/clients/:id/pics', { path: { id: 12 } }).then(res => expect(res.body).toEqual('nobody'));
        mockHttp(ctrl, 'PUT', '/ws/clients/12/pics', 'nobody');
    })

    it('with query parameters', () => {
        api.put('/clients', { query: { id: 12, picId: 'xyz' } }).then(res => expect(res.body).toEqual('nobody'));
        mockHttp(ctrl, 'PUT', '/ws/clients?id=12&picId=xyz', 'nobody');
    })

    it('with header parameters', () => {
        api.put('/clients', { headers: { id: 12, picId: 'xyz' } }).then(res => expect(res.body).toEqual('nobody'));
        mockHttp(ctrl, 'PUT', '/ws/clients', 'nobody', req => {
            expect(req.request.headers.has('picId')).toBe(true);
            expect(req.request.headers.has('id')).toBe(true);
        });
    })

    it('with body parameter', () => {
        api.put('/clients', { body: { mockClient } }).then(res => expect(res.body.name).toEqual(mockClient.name));
        mockHttp(ctrl, 'PUT', '/ws/clients', null);
    })
});

describe('PATCH tests', () => {
    setup();

    it('without parameters', () => {
        api.patch('/clients').then(res => expect(res.body).toEqual('nobody'));
        mockHttp(ctrl, 'PATCH', '/ws/clients', 'nobody');
    })

    it('with path parameters', () => {
        api.patch('/clients/:id/pics', { path: { id: 12 } }).then(res => expect(res.body).toEqual('nobody'));
        mockHttp(ctrl, 'PATCH', '/ws/clients/12/pics', 'nobody');
    })

    it('with query parameters', () => {
        api.patch('/clients', { query: { id: 12, picId: 'xyz' } }).then(res => expect(res.body).toEqual('nobody'));
        mockHttp(ctrl, 'PATCH', '/ws/clients?id=12&picId=xyz', 'nobody');
    })

    it('with header parameters', () => {
        api.patch('/clients', { headers: { id: 12, picId: 'xyz' } }).then(res => expect(res.body).toEqual('nobody'));
        mockHttp(ctrl, 'PATCH', '/ws/clients', 'nobody', req => {
            expect(req.request.headers.has('picId')).toBe(true);
            expect(req.request.headers.has('id')).toBe(true);
        });
    })

    it('with body parameter', () => {
        api.patch('/clients', { body: { mockClient } }).then(res => expect(res.body.name).toEqual(mockClient.name));
        mockHttp(ctrl, 'PATCH', '/ws/clients', null);
    })
});

// @See https://stackoverflow.com/questions/299628/is-an-entity-body-allowed-for-an-http-delete-request
describe('DELETE tests', () => {
    setup();

    it('without parameters', () => {
        api.delete('/clients').then(res => expect(res.body).toEqual('nobody'));
        mockHttp(ctrl, 'DELETE', '/ws/clients', 'nobody');
    })

    it('with path parameters', () => {
        api.delete('/clients/:id', { path: { id: 12 } }).then(res => expect(res.body).toEqual('nobody'));
        mockHttp(ctrl, 'DELETE', '/ws/clients/12', 'nobody');
    })

    it('with query parameters', () => {
        api.delete('/clients', { query: { id: 12, picId: 'xyz' } }).then(res => expect(res.body).toEqual('nobody'));
        mockHttp(ctrl, 'DELETE', '/ws/clients?id=12&picId=xyz', 'nobody');
    })

    it('with header parameters', () => {
        api.delete('/clients', { headers: { id: 12, picId: 'xyz' } }).then(res => expect(res.body).toEqual('nobody'));
        mockHttp(ctrl, 'DELETE', '/ws/clients', 'nobody', req => {
            expect(req.request.headers.has('picId')).toBe(true);
            expect(req.request.headers.has('id')).toBe(true);
        });
    })
});

describe('ERROR treatment', () => {
    setup();

    it('GET with error', () => {
        api.get('/clients')
            .then(res => expect('This code should have never been reached').toBeFalsy())
            .catch(err => {
                expect(err.status).toEqual(400);
                expect(err.statusText).toEqual('Error in parameters');
            });
        mockHttp(ctrl, 'GET', '/ws/clients', null, null, { status: 400, statusText: 'Error in parameters' });
    });

    it('GET with custom error treatment', () => {
        api.errorHandler = err => {
            expect(err.status).toEqual(400);
            expect(err.statusText).toEqual('Error in parameters');
        };

        api.get('/clients')
            .then(res => expect('This code should have never been reached').toBeFalsy())
            .catch(err => {
                expect(err.status).toEqual(400);
                expect(err.statusText).toEqual('Error in parameters');
            });
        mockHttp(ctrl, 'GET', '/ws/clients', null, null, { status: 400, statusText: 'Error in parameters' });
    });
})

function F(name: string, jsType: PiJstype, required: boolean, isArray?: boolean) {
    return { name, jsType, required, isArray }
}