import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  computed,
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
import { AvatarComponent } from '../avatar/avatar.component';
import { BarWithAvatarComponent } from '../bar-with-avatar/bar-with-avatar.component';
import { BarComponent } from '../bar/bar.component';

@Component({
  selector: 'invoice-chart-info',
  standalone: true,
  imports: [
    CommonModule,
    BarWithAvatarComponent,
    AvatarComponent,
    BarComponent,
  ],
  template: ` <div class="chart-info">
    <div class="chart-info-title global-section-title-md">{{ titleText() }}</div>
    <div class="chart-info-avatar">
      @for (avatar of candidateList(); track avatar.name) {
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
    <div class="chart-info-support">
    <span class="chart-info-support-title">
      最支持
    </span>  
      <div class="support-group">
        <div class="support-group-item first"  
        [ngClass]="sortedCandidateList()[0].id">
          <span>{{ sortedCandidateList()[0].name }}</span>
          <invoice-avatar 
           [size]="30"
           [borderColor]="sortedCandidateList()[0].borderColor"
           [avatar]="sortedCandidateList()[0].avatar">
          </invoice-avatar>  
        </div>
        <div class="support-group-item second"
        [ngClass]="sortedCandidateList()[1].id">
        </div>
        <div class="support-group-item third"
        [ngClass]="sortedCandidateList()[2].id">
        </div>
      </div>
    </div>
    <div class="chart-info-list">
      <div class="chart-info-list-item title global-body-lg">
        <div class="zone">縣市</div>
        <div class="percentage">得票佔比</div>
      </div>
      <div class="chart-info-list-scroll">
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
  candidateList = signal([
    {
      id: 'ddp',
      name: '蔡英文',
      avatar: 'assets/img/ddp-avatar.png',
      winRate: 0,
      borderColor: greenList[ColorLevel.normal],
    },
    {
      id: 'kmt',
      name: '韓國瑜',
      avatar: 'assets/img/kmt-avatar.png',
      winRate: 0,
      borderColor: blueList[ColorLevel.normal],
    },
    {
      id: 'pfp',
      name: '宋楚瑜',
      avatar: 'assets/img/pfp-avatar.png',
      winRate: 0,
      borderColor: orangeList[ColorLevel.normal],
    },
  ]);

  sortedCandidateList = computed(() =>
    [...this.candidateList()].sort((a, b) => b.winRate - a.winRate)
  );

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
    switch (this.overViewType) {
      case 'taiwan':
        this.titleText.set('全台');
        break;
      case 'county':
        this.titleText.set(this.dataList()[0].countyName);
        break;
      case 'town':
        this.titleText.set((this.dataList()[0] as TownProperties).townName);
        break;
      default:
        break;
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
    this.candidateList.update((list) => {
      return list.map((item, i) => ({
        ...item,
        winRate: rateArr[i],
      }));
    });
  }
}
