import { NgModule } from '@angular/core';
import { PiApiCaller } from './PiApiCaller';
import { HttpClient } from '@angular/common/http';

/**
 * @dynamic // needed to avoid "Lambda not supported" error.
 */
@NgModule({
  declarations: [],
  imports: [],
  exports: [],
  providers: [{
    provide: PiApiCaller,
    useFactory: (http: HttpClient) => new PiApiCaller(http),
    deps: [HttpClient]
  }]
})
export class PiservicesAngularModule { }