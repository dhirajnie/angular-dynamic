
import {throwError as observableThrowError, Observable} from 'rxjs';

export function handleError (error: Response | any) {
  // In a real world app, you might use a remote logging infrastructure
  let errMsg: string;
  if (error instanceof Response) {
    const body = error || '';
    const err = body["error"] || JSON.stringify(body);
    errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
  } else {
    errMsg = error.message ? error.message : error.toString();
  }
  return observableThrowError(errMsg);
}

export function handleErrorReason (error: Response | any) {
  // In a real world app, you might use a remote logging infrastructure
  let body = error || {};
  let reason = "Error Something went wrong ";
  if (body.hasOwnProperty("error") && body.error.hasOwnProperty("Fault")) {
    reason = body.error.Fault.Reason.Text;
  }else if (body.hasOwnProperty("Fault")) {
    reason = body.Fault.Reason.Text;
  }

  return observableThrowError(reason);
}


