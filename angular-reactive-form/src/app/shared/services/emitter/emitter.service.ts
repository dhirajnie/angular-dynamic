import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class EmitterService {

  
  private  _emitters: { [channel: string]: EventEmitter<any> } = {};
   get(channel: string): EventEmitter<any> {
    if (!this._emitters[channel]) 
      this._emitters[channel] = new EventEmitter();
    return this._emitters[channel];
  }

}
