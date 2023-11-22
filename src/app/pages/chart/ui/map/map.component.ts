import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Input,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import * as d3 from 'd3';
import { feature } from 'topojson-client';
import { tap } from 'rxjs';
import {
  CountyGeometry,
  D3GSelection,
  D3SVGSelection,
  D3Selection,
  MapBounds,
  MapGeometryData,
  MapState,
  TownGeometry,
  TransferData,
  VillageGeometry,
} from '../../../../shared/domain/models';
import { AppComponentStore } from '../../../../shared/domain/store';
import { LetDirective } from '@ngrx/component';
import {
  blueList,
  greenList,
  orangeList,
} from '../../../../shared/domain/configs';

@Component({
  selector: 'invoice-map',
  standalone: true,
  imports: [CommonModule, LetDirective],
  template: `
    <div class="map-container">
      <svg class="map"></svg>
      <div id="collapse-content"></div>
      <!-- <div class="map-info-box">
        <h3 class="map-info-box__title">{{ handleInfoName() }}</h3>
        <ul class="map-info-box__list">
          <li>{{ infoSelected().ddp }}%</li>
          <li>{{ infoSelected().kmt }}%</li>
          <li>{{ infoSelected().pfp }}%</li>
        </ul>
      </div> -->
      <button *ngIf="isPrevShow" (click)="goBackArea()" class="map-back">
        go Back
      </button>
    </div>
  `,
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent implements AfterViewInit {
  @Input() mapData!: MapState;
  #store = inject(AppComponentStore);
  #destroyRef = inject(DestroyRef);
  selectedData = signal({});

  centerPoint = { x: 0, y: 0 };
  width = 800;
  height = 800;
  initialScale = 12000;
  isDesktopDevice = false;

  infoSelected = signal({
    countyName: '',
    townName: '',
    villageName: '',
    ddp: 0,
    kmt: 0,
    pfp: 0,
  });

  scaleRecord = [0.8];
  translateRecord = [{ x: 30, y: 200 }];

  isPrevShow = false;

  isMobile = false;
  map!: D3Selection;
  g!: D3GSelection;
  // toolTip = null;
  colorScale = null;
  clickedTarget!: D3SVGSelection;

  activeLineColor = 'black';
  normalLineColor = 'white';
  activeLineWidth = 0.3;
  normalLineWidth = 0.1;

  townData: TransferData | null = null;
  villageData: TransferData | null = null;
  countyData: TransferData | null = null;

  projection = d3.geoMercator().scale(this.initialScale).center([121, 24.5]);
  path = d3.geoPath().projection(this.projection);

  collapse = d3.select('#collapse-content').style('opacity', 1);

  // handleInfoName() {
  //   const { countyName, townName, villageName } = this.infoSelected();
  //   let str = countyName;
  //   if (townName) {
  //     str += townName;
  //   }
  //   if (villageName) {
  //     str += villageName;
  //   }
  //   return str;
  // }

  // showInfo(data: MapGeometryData) {
  //   if ('villageName' in data.properties) {
  //     const { countyName, townName, villageName, ddp, kmt, pfp } =
  //       data.properties;
  //     this.infoSelected.update((value) => ({
  //       ...value,
  //       townName,
  //       countyName,
  //       villageName,
  //       ddp,
  //       kmt,
  //       pfp,
  //     }));
  //   } else if ('townName' in data.properties) {
  //     const { countyName, townName, ddp, kmt, pfp } = data.properties;
  //     this.infoSelected.update((value) => ({
  //       ...value,
  //       townName,
  //       countyName,
  //       ddp,
  //       kmt,
  //       pfp,
  //     }));
  //   } else {
  //     const { countyName, ddp, kmt, pfp } = data.properties;
  //     this.infoSelected.update((value) => ({
  //       ...value,
  //       countyName,
  //       ddp,
  //       kmt,
  //       pfp,
  //     }));
  //   }
  // }

  setLineWidth(type?: string, isActive = false) {
    let lineWidth = 0.5;
    if (type === 'county') lineWidth = 0.3;
    if (type === 'town') lineWidth = 0.05;
    if (type === 'village') lineWidth = 0.02;
    return isActive ? lineWidth * 5 : lineWidth;
  }

  genColor(value: number, winner: string) {
    const index = Math.floor(value / 20);
    if (winner === 'ddp') {
      return greenList[index];
    }
    if (winner === 'kmt') {
      return blueList[index];
    }

    return orangeList[index];
  }

  createCounty() {
    if (!this.g || !this.countyData) return;
    const self = this;
    this.g
      .selectAll('.county')
      .data(this.countyData.features)
      .enter()
      .append('path')
      .classed('county', true)
      .style('stroke-width', this.setLineWidth('town'))
      .style('stroke', this.normalLineColor)
      .attr('d', this.path)
      .style('fill', function (i: CountyGeometry) {
        const { winnerRate, winner } = i.properties;
        return self.genColor(winnerRate, winner);
      })
      .on('click', function (event, d: CountyGeometry) {
        self.clearBoundary('county');
        self.clickedTarget = d3.select(this);
        self.drawBoundary('county');
        // self.showInfo(d);
        self.switchArea(d);
      })
      .on('mouseover', function (event, data) {
        d3.select(this).attr('opacity', 0.8);
        // self.showInfo(data);
      })
      .on('mouseout', function () {
        d3.select(this).attr('opacity', 1);
      });

    const [{ x, y }] = this.translateRecord;
    const [scale] = this.scaleRecord;
    this.g.attr('transform', `translate(${x},${y})scale(${scale})`);
  }

  createTown(data: CountyGeometry) {
    const self = this;
    const countyTowns =
      this.townData?.features.filter(
        (item) => item.properties.countyId == data.id
      ) || [];
    console.log('countyTowns', countyTowns);
    const townPaths = this.g
      .selectAll('.town')
      .data(countyTowns)
      .enter()
      .append('path')
      .classed('town', true)
      .attr('d', this.path)
      .style('opacity', 0)
      .style('stroke-width', this.setLineWidth('town'))
      .style('stroke', this.normalLineColor)
      .style('fill', function (i: TownGeometry) {
        const { winnerRate, winner } = i.properties;
        return self.genColor(winnerRate, winner);
      })
      .on('click', function (event, d: TownGeometry) {
        self.clearBoundary('town');
        self.clickedTarget = d3.select(this);
        self.drawBoundary('town');
        self.switchArea(d);
      })
      .on('mouseover', function (event, d: TownGeometry) {
        d3.select(this).attr('opacity', 0.8);
        // self.showInfo(d);
      })
      .on('mouseout', function () {
        d3.select(this).attr('opacity', 1);
      });

    return { townPaths };
  }

  createVillage(data: TownGeometry) {
    const self = this;
    const villages =
      this.villageData?.features.filter(
        (i) => i.properties.townId == data.id
      ) || [];
    console.log('townVillages', villages);
    const villagePaths = this.g
      .selectAll('.village')
      .data(villages)
      .enter()
      .append('path')
      .classed('village', true)
      .attr('d', this.path)
      .style('stroke-width', this.setLineWidth('village'))
      .style('stroke', this.normalLineColor)
      .style('fill', function (i: VillageGeometry) {
        const { winnerRate, winner } = i.properties;
        return self.genColor(winnerRate, winner);
      })
      .on('mouseover', function (event, d: VillageGeometry) {
        d3.select(this).attr('opacity', 0.8);
        // self.showInfo(d);
      })
      .on('mouseout', function () {
        d3.select(this).attr('opacity', 1);
      });
    return { villagePaths };
  }

  createMapArea(parentData: any, data: any) {
    const self = this;
    const countyTowns =
      this.townData?.features.filter(
        (item) => item.properties.countyId == data.id
      ) || [];
    console.log('countyTowns', countyTowns);
    const townPaths = this.g
      .selectAll('.town')
      .data(countyTowns)
      .enter()
      .append('path')
      .classed('town', true)
      .attr('d', this.path)
      .style('opacity', 0)
      .style('stroke-width', this.setLineWidth('town'))
      .style('stroke', this.normalLineColor)
      .style('fill', function (i: TownGeometry) {
        const { winnerRate, winner } = i.properties;
        return self.genColor(winnerRate, winner);
      })
      .on('click', function (event, d: TownGeometry) {
        self.clearBoundary('town');
        self.clickedTarget = d3.select(this);
        self.drawBoundary('town');
        self.switchArea(d);
      })
      .on('mouseover', function (event, d: TownGeometry) {
        d3.select(this).attr('opacity', 0.8);
        // self.showInfo(d);
      })
      .on('mouseout', function () {
        d3.select(this).attr('opacity', 1);
      });

    return { townPaths };
  }

  drawBoundary(type: string) {
    if (!this.clickedTarget) return;
    this.clickedTarget.style('stroke-width', this.setLineWidth(type, true));
    this.clickedTarget.style('stroke', this.activeLineColor);
    this.clickedTarget.raise();
  }

  clearBoundary(type: string) {
    if (!this.clickedTarget) return;
    this.clickedTarget.style('stroke-width', this.setLineWidth(type));
    this.clickedTarget.style('stroke', this.normalLineColor);
    this.clickedTarget.lower();
  }

  clearArea(type: string) {
    this.g
      .selectAll(`.${type}`)
      .data([])
      .exit()
      .transition()
      .duration(500)
      .style('opacity', 0)
      .remove();
  }

  // setToolTip() {
  //   this.toolTip = d3
  //     .select('.map')
  //     .append('text')
  //     .attr('class', 'tip')
  //     .attr('font-size', '20px')
  //     .attr('fill', '#f3dc71')
  //     .attr('x', '400')
  //     .attr('y', '350');
  // }

  ngAfterViewInit() {
    console.log('init');
    this.width = document.body.clientWidth;
    this.height = document.body.clientHeight;
    this.centerPoint = { x: this.width / 2, y: this.height / 2 };
    this.renderMap();
    this.#store.vm$
      .pipe(
        tap(({ mapData }) => {
          console.log('mapData', mapData);
          if (!mapData.county) return;
          const { county, town, village } = mapData;
          // @ts-ignore
          this.countyData = feature(county, county.objects.counties);
          // @ts-ignore
          this.townData = feature(town, town.objects.town);
          // @ts-ignore
          this.villageData = feature(village, village.objects.village);

          this.createCounty();
        }),
        takeUntilDestroyed(this.#destroyRef)
      )
      .subscribe();
  }

  renderMap() {
    this.map = d3
      .select('.map')
      .attr('width', this.width)
      .attr('height', this.height);
    this.g = this.map?.append('g');
  }

  async sleep(sec: number) {
    return new Promise<void>((resolve) => {
      return setTimeout(() => resolve(), sec);
    });
  }

  getDataType(num: number) {
    if (num === 5) {
      return 'county';
    }
    if (num === 8) {
      return 'town';
    }

    return 'village';
  }

  goBackArea() {
    let scale = 0;
    let x = 0;
    let y = 0;
    if (this.translateRecord.length > 1) {
      this.clearArea('village');
      const tempScale = this.scaleRecord.pop();
      const tempTranslate = this.translateRecord.pop();
      if (tempScale && tempTranslate) {
        scale = tempScale;
        x = tempTranslate.x;
        y = tempTranslate.y;
      }
      this.clearBoundary('village');
    } else {
      this.clearArea('town');
      const [targetScale] = this.scaleRecord;
      const [targetTranslate] = this.translateRecord;
      scale = targetScale;
      x = targetTranslate.x;
      y = targetTranslate.y;
      this.isPrevShow = false;
      this.clearBoundary('town');
    }
    this.g
      .transition()
      .duration(500)
      .attr('transform', `translate(${x},${y})scale(${scale})`);
  }

  switchArea(data: MapGeometryData) {
    const type = this.getDataType(data.id?.length);
    console.log('type', type);
    switch (type) {
      case 'county': {
        this.toTown(data);
        const bounds = this.path.bounds(data as d3.GeoPermissibleObjects);
        this.zoom(bounds);
        break;
      }
      case 'town': {
        this.toVillage(data as TownGeometry);
        const bounds = this.path.bounds(data as d3.GeoPermissibleObjects);
        this.zoom(bounds);
        break;
      }
      default:
        break;
    }
  }

  toTown(data: CountyGeometry) {
    const { townPaths } = this.createTown(data);
    this.showAreaLine(townPaths as unknown as D3Selection);
  }

  toVillage(data: TownGeometry) {
    const { villagePaths } = this.createVillage(data);
    this.showAreaLine(villagePaths as unknown as D3Selection);
  }

  showAreaLine(toPath: D3Selection) {
    this.isPrevShow = true;
    toPath
      .style('opacity', 0)
      .transition()
      .delay(100)
      .duration(500)
      .style('opacity', 1);
  }

  calcDistance(bounds: MapBounds) {
    const dx = bounds[1][0] - bounds[0][0];
    const dy = bounds[1][1] - bounds[0][1];
    const x = (bounds[0][0] + bounds[1][0]) / 2;
    const y = (bounds[0][1] + bounds[1][1]) / 2;
    return { dx, dy, x, y };
  }

  zoom(bounds: MapBounds) {
    const { dx, dy, x: rx, y: ry } = this.calcDistance(bounds);
    const x = rx;
    const y = ry;
    const scale = 0.7 / Math.max(dx / this.width, dy / this.height);
    const translate = {
      x: this.width / 2 - scale * x,
      y: this.height / 2 - scale * y,
    };
    this.g
      .transition()
      .duration(500)
      .attr(
        'transform',
        `translate(${translate.x},${translate.y})scale(${scale})`
      );
    if (this.translateRecord.length < 2) {
      this.translateRecord.push(translate);
      this.scaleRecord.push(scale);
    }
  }
}
