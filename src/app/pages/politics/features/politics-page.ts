import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'invoice-politics',
  standalone: true,
  imports: [CommonModule, MatTabsModule, MatIconModule],
  template: `
    <div>
      <mat-tab-group>
        <mat-tab label="First"> Content 1 </mat-tab>
        <mat-tab label="Second"> Content 2 </mat-tab>
        <mat-tab label="Third"> Content 3 </mat-tab>
      </mat-tab-group>

      <!-- <mat-tab-group
        [mat-stretch-tabs]="stretchTabs"
        [selectedIndex]="selectedIndex"
      >
        @for (politic of politicsList; track politic.type) {
        <mat-tab [label]="politic.name">
          <div class="politic-group">
            <div class="politic-header">
              <div
                [class]="politic.type"
                class="politic-header-bar global-section-title-lg"
              >
                <mat-icon [svgIcon]="politic.type"></mat-icon>
                {{ politic.name }}政見
              </div>
              <img src="assets/img/{{ politic.type }}.png" alt="avatar" />
            </div>
            <div class="politic-list global-section-title-md">
              @for (item of politic.politics; track item.title) {
              <div class="politic-list-item" [class]="politic.type">
                <div class="politic-list-item-title" [class]="politic.type">
                  {{ item.title }}
                </div>
                <div class="politic-list-item-content">
                  {{ item.content }}
                </div>
              </div>
              }
            </div>
          </div>
        </mat-tab>
        }
      </mat-tab-group> -->
    </div>
  `,
  styleUrls: ['./politics-page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PoliticsComponent {
  stretchTabs = true;
  selectedIndex = 0;
  politicsList = [
    {
      type: 'kmt',
      name: '韓國瑜',
      avatar: '',
      politics: [
        {
          title: '對長照的規劃為何？',
          content:
            '主張「全民長照保險」，由勞方、資方、政府各出一部分錢，每人「一個月繳一個便當的錢」，就能照顧到最需要長照資源的群體。',
        },
        {
          title: '如何規劃整體觀光政策',
          content:
            '舉國之力發展觀光，把台灣塑造成「世界最光采多樣的觀光島」與知名旅遊社群與平台合作國際行銷。打造十大特色小鎮、百大休閒農村，協助地方發展，並推動全民觀光，引導觀光客分流至全台各地。',
        },
        {
          title: '對區域經濟整合有何主張',
          content:
            '主張在「富國利民、捍衛主權、發財外交、裡子外交、多交朋友」原則下，全力推動洽簽雙邊自由貿易協定及加入CPTPP及RCEP等區域經濟整合。',
        },
      ],
    },
    {
      type: 'ddp',
      name: '蔡英文',
      avatar: '',
      politics: [
        {
          title: '對長照的規劃為何？',
          content:
            '長照2.0已實施3年，下階段將推動長照3.0，也就是機構照護，讓那些無法在家或在社區照護的長輩可以住進機構內接受照護。',
        },
        {
          title: '如何規劃整體觀光政策',
          content:
            '交通部提出觀光三箭政策，包括觀光局升格觀光署、研擬2030觀光政策白皮書，及整合政府能量強化觀光，蔡英文表示全力支持。',
        },
        {
          title: '對區域經濟整合有何主張',
          content:
            '認為台日開始洽談CPTPP，現在正是時機；另外，由中國主導的RCEP預訂明年簽署，經濟部稱對台灣的影響不大。',
        },
      ],
    },
    {
      type: 'pfp',
      name: '宋楚瑜',
      avatar: '',
      politics: [
        {
          title: '對長照的規劃為何？',
          content:
            '應讓老年人口發揮對社會的貢獻，例如：可縮短老人上班時間，非體力的工作仍可做出貢獻，如此政府也可以更加關注安養、長照等問題。',
        },
        {
          title: '如何規劃整體觀光政策',
          content:
            '認為自己曾走訪台灣309個鄉鎮，若當選總統就是最好的觀光局長，將親自操盤觀光產業，凸顯台灣的吸引力。當選的第一件大事，就是親自把兩岸旅遊處理好',
        },
        {
          title: '對區域經濟整合有何主張',
          content: '主張政經分離，持續用力推動簽署CPTPP及RCEP等區域經濟協議。',
        },
      ],
    },
  ];
}
