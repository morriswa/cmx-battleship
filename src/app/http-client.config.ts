import {EnvironmentProviders, inject} from "@angular/core";
import {HttpInterceptorFn, provideHttpClient, withInterceptors} from "@angular/common/http";
import {SessionAuthenticationService} from "./services/session-authentication.service";


const SessionHeaderInterceptor: HttpInterceptorFn = (req, next) => {
  const session = inject(SessionAuthenticationService);

  if (session.active&&session.id) {
    console.log('adding headers', session.id);
    req = req.clone({
      headers: req.headers.set('session-id', session.id)
    });
  }

  return next(req);
};


export const AppHttpClient: EnvironmentProviders
  = provideHttpClient(withInterceptors([SessionHeaderInterceptor]));
