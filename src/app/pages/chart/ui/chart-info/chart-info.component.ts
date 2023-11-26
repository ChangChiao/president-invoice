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
  TownProperties,
  VoteState,
} from '../../../../shared/domain/models';
import {
  getAreaIds,
  getAreaName,
  roundedNumber,
} from '../../../../shared/domain/utils';
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
      <div class="chart-info-list-item global-body-md">
        <div class="zone">縣市</div>
        <div class="percentage">得票佔比</div>
      </div>
      @for (zone of dataList(); track getIds(zone)) {
        <div class="chart-info-list-item global-body-md">
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
  @Input() voteData!: VoteState;
  @Input() overViewType: string = 'taiwan';
  @Input() selectedAreaObj!: SelectedOptionState;

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
    const voteData = changes['voteData']?.currentValue;
    if (voteData) {
      this.renderText();
      return;
    }

    const selectedAreaNewObj = changes['selectedAreaObj']?.currentValue;
    const selectedAreaOldObj = changes['selectedAreaObj']?.previousValue;
    const { county: countyNew, town: townNew } = selectedAreaNewObj;
    const { county: countyOld, town: townOld } = selectedAreaOldObj;
    if (countyNew !== countyOld) {
      this.renderText();
    }
    if (townNew !== townOld) {
      this.renderText();
    }
  }

  renderText() {
    this.filterResult();
    this.calcAverage();
    this.getTitle();
  }

  getTitle() {
    if (this.overViewType === 'taiwan') {
      this.titleText.set('全台');
    }
    if (this.overViewType === 'county') {
      this.titleText.set(this.dataList()[0].countyName);
    }
    if (this.overViewType === 'town') {
      this.titleText.set((this.dataList()[0] as TownProperties).townName);
    }
  }

  getIds(element: AreaPropertiesItem) {
    return getAreaIds(element);
  }

  getName(element: AreaPropertiesItem) {
    return getAreaName(element);
  }

  filterResult() {
    if (this.overViewType === 'taiwan') {
      this.voteData.county && this.dataList.set(this.voteData.county);
    }
    if (this.overViewType === 'county') {
      const newList = this.voteData?.town?.filter(
        (item) => item.countyId === this.selectedAreaObj.county
      );
      newList && this.dataList.set(newList);
    }
    if (this.overViewType === 'town') {
      const newList = this.voteData?.village?.filter(
        (item) => item.townId === this.selectedAreaObj.town
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
