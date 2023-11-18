import { Injectable, inject } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class IconRegistryService {
  #matIconRegistry = inject(MatIconRegistry);
  #domSanitizer = inject(DomSanitizer);

  init() {
    this.#matIconRegistry.addSvgIcon(
      'fog',
      this.#domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/icons/cloud-fog-svgrepo-com.svg'
      )
    );

    this.#matIconRegistry.addSvgIcon(
      'moon',
      this.#domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/icons/cloud-moon-svgrepo-com.svg'
      )
    );
  }
}
