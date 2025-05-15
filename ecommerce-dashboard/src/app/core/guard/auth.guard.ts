import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const _router=inject(Router);
  const _PLATFORM_ID=inject(PLATFORM_ID);

  // will make localstorage work in brower.
  if(isPlatformBrowser(_PLATFORM_ID)){
    if(localStorage.getItem('token')){
      return true;
    }else{
      _router.navigate(['/login']);
      return false;
    }
  }else{
    return false;
  }
 
};
