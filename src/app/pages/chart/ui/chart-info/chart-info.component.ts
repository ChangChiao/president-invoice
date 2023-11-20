import {
  ChangeDetectionStrategy,
  Component,
  Input,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartData } from '../../../../shared/domain/models';
import { BarWithAvatarComponent } from '../bar-with-avatar/bar-with-avatar.component';
import { blueList, greenList, orangeList } from 'src/app/shared/domain/configs';

@Component({
  selector: 'invoice-chart-info',
  standalone: true,
  imports: [CommonModule, BarWithAvatarComponent],
  template: ` <div class="chart-info">
    <div class="chart-info-title global-section-title-md">全台</div>
    <div class="chart-info-avatar">
      @for (avatar of avatarList(); track avatar.name) {
        <invoice-bar-with-avatar 
          [name]="avatar.name" 
          [avatar]="avatar.avatar" 
          [winRate]="avatar.winRate"  
          [borderColor]="avatar.borderColor" 
        />
      } @empty {
        Empty list of avatar
      }
    </div>
  </div>`,
  styleUrls: ['./chart-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartInfoComponent {
  @Input() data!: ChartData;

  avatarList = signal([
    {
      name: '蔡英文',
      avatar: 'assets/img/ddp-avatar.png',
      winRate: 0,
      borderColor: greenList.normal,
    },
    {
      name: '韓國瑜',
      avatar: 'assets/img/kmt-avatar.png',
      winRate: 0,
      borderColor: blueList.normal,
    },
    {
      name: '宋楚瑜',
      avatar: 'assets/img/pfp-avatar.png',
      winRate: 0,
      borderColor: orangeList.normal,
    },
  ]);
}
