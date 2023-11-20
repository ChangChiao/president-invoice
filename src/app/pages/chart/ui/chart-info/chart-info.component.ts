import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ChartData,
  ChartDataItem,
  DropdownEmitData,
  SelectedOptionState,
  VoteState,
} from '../../../../shared/domain/models';
import { BarWithAvatarComponent } from '../bar-with-avatar/bar-with-avatar.component';
import {
  blueList,
  greenList,
  orangeList,
} from '../../../../shared/domain/configs';
import { BarComponent } from '../bar/bar.component';

@Component({
  selector: 'invoice-chart-info',
  standalone: true,
  imports: [CommonModule, BarWithAvatarComponent, BarComponent],
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
        暫無資料
      }
    </div>
    <div class="chart-info-list">
      <div class="chart-info-list-item global-body-lg">
        <div class="zone">縣市</div>
        <div class="percentage">得票佔比</div>
      </div>
      @for (zone of dataList(); track getIds(zone)) {
        <div class="chart-info-list-item global-body-lg">
          <div class="zone">
            {{ getName(zone) }}
          </div>
          <div class="percentage">
            <invoice-bar [data]="zone"></invoice-bar>
          </div>
      </div>
      } @empty {
        暫無資料
      }
    </div>
  </div>`,
  styleUrls: ['./chart-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartInfoComponent implements OnChanges {
  @Input() data!: VoteState;
  @Input() overViewType: string = 'taiwan';
  @Input() selectedOption!: SelectedOptionState;

  dataList = signal<ChartData>([]);
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

  ngOnChanges(changes: SimpleChanges): void {
    const val = changes['data'].currentValue;
    if (val) {
      this.filterResult(val);
    }
  }

  getName(element: ChartDataItem) {
    let key = '';
    if ('villageName' in element) {
      key = 'villageName';
    }
    if ('townName' in element) {
      key = 'townName';
    }
    key = 'countryName';
    return element[key as keyof ChartDataItem];
  }

  getIds(element: ChartDataItem) {
    let id = '';
    if ('villageId' in element) {
      id = 'villageId';
    }
    if ('townId' in element) {
      id = 'townId';
    }
    id = 'countyId';
    return element[id as keyof ChartDataItem];
  }

  filterResult(voteObj: VoteState) {
    if (this.overViewType === 'taiwan') {
      voteObj.country && this.dataList.set(voteObj.country);
    }
    if (this.overViewType === 'country') {
      const newList = voteObj?.village?.filter(
        (item) => item.countyId === this.selectedOption.country
      );
      newList && this.dataList.set(newList);
    }
    if (this.overViewType === 'town') {
      const newList = voteObj?.village?.filter(
        (item) => item.townId === this.selectedOption.town
      );
      newList && this.dataList.set(newList);
    }
  }
}
