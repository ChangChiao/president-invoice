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
      'ddp',
      this.#domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/icons/ddp-logo.svg'
      )
    );

    this.#matIconRegistry.addSvgIcon(
      'kmt',
      this.#domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/icons/kmt-logo.svg'
      )
    );

    this.#matIconRegistry.addSvgIcon(
      'pfp',
      this.#domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/icons/pfp-logo.svg'
      )
    );
  }
}
