import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { pantoneList } from '../../../../shared/domain/configs/mapColor';

@Component({
  selector: 'invoice-pantone',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="pantone">
      @for (group of pantoneList; track group) {
      <div class="pantone-group">
        <span class="global-body-md">{{ group.name }}</span>
        <ul class="color-list">
          @for (color of group.colorList; track color) {
          <li class="color-list-item" [style.backgroundColor]="color"></li>
          }
        </ul>
      </div>
      }
    </div>
  `,
  styleUrls: ['./pantone.component.scss'],
})
export class PantoneComponent {
  titleBgColor = [];
  pantoneList = [
    { name: '民進黨', colorList: pantoneList.greenList },
    { name: '國民黨', colorList: pantoneList.blueList },
    { name: '親民黨', colorList: pantoneList.orangeList },
  ];
}
