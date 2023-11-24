import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  signal,
} from '@angular/core';
import {
  blueList,
  greenList,
  orangeList,
} from '../../../../shared/domain/configs';
import {
  AreaProperties,
  AreaPropertiesItem,
  ColorLevel,
  SelectedOptionState,
  VoteState,
} from '../../../../shared/domain/models';
import { getAreaIds, roundedNumber } from '../../../../shared/domain/utils';
import { BarWithAvatarComponent } from '../bar-with-avatar/bar-with-avatar.component';
import { BarComponent } from '../bar/bar.component';

@Component({
  selector: 'invoice-chart-info',
  standalone: true,
  imports: [CommonModule, BarWithAvatarComponent, BarComponent],
  template: ` <div class="chart-info">
    <div class="chart-info-title global-section-title-md">{{ titleText() }}</div>
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

  titleText = signal<string>('全台');
  dataList = signal<AreaProperties>([]);
  avatarList = signal([
    {
      name: '蔡英文',
      avatar: 'assets/img/ddp-avatar.png',
      winRate: 0,
      borderColor: greenList[ColorLevel.normal],
    },
    {
      name: '韓國瑜',
      avatar: 'assets/img/kmt-avatar.png',
      winRate: 0,
      borderColor: blueList[ColorLevel.normal],
    },
    {
      name: '宋楚瑜',
      avatar: 'assets/img/pfp-avatar.png',
      winRate: 0,
      borderColor: orangeList[ColorLevel.normal],
    },
  ]);

  ngOnChanges(changes: SimpleChanges): void {
    const voteData = changes['data']?.currentValue;
    const selectedOption = changes['selectedOption']?.currentValue;
    if (voteData || selectedOption) {
      this.filterResult();
      this.calcAverage();
    }
  }

  getIds(element: AreaPropertiesItem) {
    return getAreaIds(element);
  }

  getName(element: AreaPropertiesItem) {
    let key = '';

    switch (true) {
      case 'villageName' in element:
        key = 'villageName';
        break;
      case 'townName' in element:
        key = 'townName';
        break;
      default:
        key = 'countyName';
        break;
    }
    return element[key as keyof AreaPropertiesItem];
  }

  filterResult() {
    if (this.overViewType === 'taiwan') {
      this.data.county && this.dataList.set(this.data.county);
    }
    if (this.overViewType === 'county') {
      const newList = this.data?.town?.filter(
        (item) => item.countyId === this.selectedOption.county
      );
      newList && this.dataList.set(newList);
    }
    if (this.overViewType === 'town') {
      const newList = this.data?.village?.filter(
        (item) => item.townId === this.selectedOption.town
      );
      newList && this.dataList.set(newList);
    }
  }

  calcAverage() {
    let rateArr: number[] = [];
    const length = this.dataList().length;
    const ddp = this.dataList().reduce((a, b) => a + b.ddp, 0);
    const kmt = this.dataList().reduce((a, b) => a + b.kmt, 0);
    const pfp = this.dataList().reduce((a, b) => a + b.pfp, 0);

    rateArr = [
      roundedNumber(ddp / length),
      roundedNumber(kmt / length),
      roundedNumber(pfp / length),
    ];
    this.avatarList.update((list) => {
      return list.map((item, i) => {
        return {
          ...item,
          winRate: rateArr[i],
        };
      });
    });
  }
}
