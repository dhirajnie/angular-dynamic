import { Injectable, EventEmitter } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor() { }


  public statusUpdated = new EventEmitter<string>();


  updateStatus(id: number, status: string) {

  }


}
