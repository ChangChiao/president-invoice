import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  WritableSignal,
  signal,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { LetDirective } from '@ngrx/component';
import * as d3 from 'd3';
import type { FeatureCollection, Geometry } from 'geojson';
import { feature } from 'topojson-client';
import {
  blueList,
  greenList,
  orangeList,
} from '../../../../shared/domain/configs';
import {
  AreaPropertiesItem,
  AreaType,
  CountyProperties,
  D3GSelection,
  D3SVGSelection,
  D3Selection,
  MapBounds,
  MapGeometryData,
  MapState,
  TownProperties,
  VillageProperties,
} from '../../../../shared/domain/models';

@Component({
  selector: 'invoice-map',
  standalone: true,
  imports: [CommonModule, LetDirective, MatIconModule],
  template: `
    <div class="map-box">
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
      @if (areaPoint()) {
      <mat-icon
        fontIcon="arrow_back"
        (click)="goBackArea()"
        class="map-back"
      ></mat-icon>
      }
    </div>
  `,
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent implements AfterViewInit {
  @Input() mapData!: MapState;
  selectedData = signal({});

  countyData: FeatureCollection<Geometry, CountyProperties> | null = null;
  townData: FeatureCollection<Geometry, TownProperties> | null = null;
  villageData: FeatureCollection<Geometry, VillageProperties> | null = null;

  switchAreaFlag = false;

  centerPoint = { x: 0, y: 0 };
  width = 700;
  height = 800;
  initialScale = 11000;
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
  translateRecordList = {
    county: { x: 0, y: 0, scale: 1 },
    town: { x: 30, y: 200, scale: 1 },
    village: { x: 30, y: 200, scale: 1 },
  };
  areaPoint: WritableSignal<AreaType | null> = signal(null);

  translateRecord = [{ x: 30, y: 200 }];

  isPrevShow = false;

  isMobile = false;
  map!: D3Selection;
  g!: D3GSelection;
  // toolTip = null;
  colorScale = null;
  currentTarget: D3SVGSelection | null = null;
  prevTarget: D3SVGSelection | null = null;

  normalLineColor = 'white';
  activeLineWidth = 0.3;
  normalLineWidth = 0.1;

  projection = d3.geoMercator().center([121.5, 24.3]).scale(this.initialScale);
  path = d3.geoPath().projection(this.projection);

  get prevChildType() {
    return this.prevTarget?.attr('data-child') as AreaType;
  }

  get prevType() {
    return this.prevTarget?.attr('data-type') as AreaType;
  }

  get currentChildType() {
    return this.currentTarget?.attr('data-child') as AreaType;
  }

  get currentType() {
    return this.currentTarget?.attr('data-type') as AreaType;
  }

  get isSameLevel() {
    return (
      this.prevTarget?.attr('data-type') ===
      this.currentTarget?.attr('data-type')
    );
  }

  ngAfterViewInit() {
    this.width = document.querySelector('.map-container')?.clientWidth ?? 1000;
    this.height = document.querySelector('.map-container')?.clientHeight ?? 800;
    this.centerPoint = { x: this.width / 2, y: this.height / 2 };
    this.renderMap();

    const { county, town, village } = this.mapData;
    // @ts-ignore
    this.countyData = feature(county, county.objects.counties);
    // @ts-ignore
    this.townData = feature(town, town.objects.town);
    // @ts-ignore
    this.villageData = feature(village, village.objects.village);
    if (this.countyData?.features) {
      this.createMapArea('county', this.countyData?.features);
    }
  }
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
    let lineWidth = 0.1;
    if (type === 'county') lineWidth = 0.1;
    if (type === 'town') lineWidth = 0.1;
    if (type === 'village') lineWidth = 0.05;
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

  getChildType(type: AreaType | null) {
    if (type === 'county') return 'town';
    if (type === 'town') return 'village';
    return null;
  }

  getParentType(type: AreaType | null) {
    if (type === 'town') return 'county';
    if (type === 'village') return 'town';
    return null;
  }

  getIds(element: AreaPropertiesItem) {
    let id = '';
    if ('villageId' in element) {
      id = 'villageId';
    }
    if ('townId' in element) {
      id = 'townId';
    }
    id = 'countyId';
    return element[id as keyof AreaPropertiesItem];
  }

  createMapArea(areaType: AreaType, mapData: MapGeometryData[]) {
    const self = this;
    if (!areaType || !mapData) return;
    console.log('createMapArea---', areaType);
    const arr = document.getElementsByClassName(areaType);
    console.log('arr', arr.length);
    const childType = this.getChildType(areaType);
    this.g
      .selectAll(`.${areaType}`)
      .data(mapData)
      .enter()
      .append('path')
      .classed(areaType, true)
      .attr('d', this.path)
      .attr('data-type', areaType)
      .attr('data-child', childType)
      .attr('data-id', (d) => this.getIds(d.properties))
      .style('stroke-width', childType ? this.setLineWidth(childType) : 0.05)
      .style('stroke', this.normalLineColor)
      .style('fill', function (d) {
        const { winnerRate, winner } = d.properties;
        return self.genColor(winnerRate, winner);
      })
      .on('click', function (event, d) {
        if (self.switchAreaFlag) return;
        self.prevTarget = self.currentTarget;
        console.log('d.propertie', d.properties);
        self.currentTarget = d3.select(this);
        if (areaType !== 'village') {
          self.areaPoint.set(areaType);
          console.warn('switchArea---------areaPoint', self.areaPoint());
          self.clearBoundary();
          self.drawBoundary();
          self.switchArea(d);
        }
      })
      .on('mouseover', function (event, d) {
        d3.select(this).attr('opacity', 0.8);
        // console.log('d.propertie', d.properties);
        // self.showInfo(d);
      })
      .on('mouseout', function () {
        d3.select(this).attr('opacity', 1);
      });
  }

  drawBoundary() {
    if (!this.currentTarget) return;
    const type = this.currentType;
    this.currentTarget.style('stroke-width', this.setLineWidth(type, true));
    this.currentTarget.raise();
    // console.warn('raise', this.currentType);
  }

  clearBoundary(isBack: boolean = false) {
    const target: D3SVGSelection | null = isBack
      ? this.currentTarget
      : this.prevTarget;
    if (!target) return;
    const type = this.prevType;
    target.style('stroke-width', this.setLineWidth(type));
    target.lower();
    // console.warn('lower', target.attr('data-type'));
  }

  async clearArea(type: AreaType | null) {
    if (!type) return;
    return new Promise((resolve) => {
      const totalLength = document.getElementsByClassName(type)?.length;
      console.log('totalLength', totalLength);
      if (totalLength === 0) resolve(true);
      let count = 0;
      this.g
        .selectAll(`.${type}`)
        .data([])
        .exit()
        .transition()
        .on('end', function () {
          count += 1;
          console.log('count', count);
          if (count === totalLength) {
            resolve(true);
            console.warn('resolve');
          }
        })
        .remove();
    });
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

  renderMap() {
    this.map = d3
      .select('.map')
      .attr('width', this.width)
      .attr('height', this.height);
    this.g = this.map?.append('g');
  }

  async goBackArea() {
    console.warn('goBackArea');
    console.log('currentType', this.currentType);
    console.log('child', this.getChildType(this.areaPoint()));
    console.warn('this.areaPoint---goBackArea-before', this.areaPoint());
    if (this.areaPoint) {
      console.info('inner~~~~~~~~');
      const { x, y, scale } =
        this.translateRecordList[this.areaPoint() as AreaType];
      this.transformSVGgElement({ x, y, scale });
      await this.clearArea(this.getChildType(this.areaPoint()));
      const parentType = this.getParentType(this.areaPoint());
      this.clearBoundary(true);
      this.areaPoint.set(parentType);
      console.warn('this.areaPoint---goBackArea=after', this.areaPoint());
      this.switchAreaFlag = false;
      if (parentType === null) {
        this.currentTarget = null;
        this.prevTarget = null;
      }
    }

    // if (this.translateRecord.length > 1) {
    //   this.clearArea('village');
    //   const tempScale = this.scaleRecord.pop();
    //   const tempTranslate = this.translateRecord.pop();
    //   if (tempScale && tempTranslate) {
    //     scale = tempScale;
    //     x = tempTranslate.x;
    //     y = tempTranslate.y;
    //   }
    //   this.clearBoundary();
    // } else {
    //   this.clearArea('town');
    //   const [targetScale] = this.scaleRecord;
    //   const [targetTranslate] = this.translateRecord;
    //   scale = targetScale;
    //   x = targetTranslate.x;
    //   y = targetTranslate.y;
    //   // this.isPrevShow = false;
    //   this.clearBoundary();
    // }
    // this.transformSVGgElement({ x, y, scale });
  }

  async switchArea(data: MapGeometryData) {
    console.log('switchAreaFlag', this.switchAreaFlag);
    this.switchAreaFlag = true;
    console.warn('prevType', this.prevType);
    console.warn('prevChildType', this.prevChildType);
    await this.clearArea(this.prevChildType);
    const areaType = this.currentTarget?.attr('data-type');
    switch (areaType) {
      case 'county': {
        this.toTown(data);
        this.zoom(this.currentChildType, data);
        break;
      }
      case 'town': {
        this.toVillage(data);
        this.zoom(this.currentChildType, data);
        break;
      }
      default:
        break;
    }
  }

  toTown(data: MapGeometryData) {
    const townList =
      this.townData?.features.filter(
        (item) => item?.properties?.['countyId'] == data.id
      ) || [];
    console.log('townList', townList);
    this.createMapArea('town', townList);
  }

  toVillage(data: MapGeometryData) {
    const villages =
      this.villageData?.features.filter(
        (i) => i.properties.townId == data.id
      ) || [];
    console.log('villages', villages);
    this.createMapArea('village', villages);
  }

  calcDistance(bounds: MapBounds) {
    const dx = bounds[1][0] - bounds[0][0];
    const dy = bounds[1][1] - bounds[0][1];
    const x = (bounds[0][0] + bounds[1][0]) / 2;
    const y = (bounds[0][1] + bounds[1][1]) / 2;
    return { dx, dy, x, y };
  }

  zoom(areaType: AreaType, data: d3.GeoPermissibleObjects) {
    const bounds = this.path.bounds(data as d3.GeoPermissibleObjects);
    const { dx, dy, x: rx, y: ry } = this.calcDistance(bounds);
    const x = rx;
    const y = ry;
    const scale = 0.8 / Math.max(dx / this.width, dy / this.height);
    const translateObj = {
      x: this.width / 2 - scale * x,
      y: this.height / 2 - scale * y,
      scale,
    };
    this.translateRecordList[areaType] = translateObj;
    this.transformSVGgElement(
      { x: translateObj.x, y: translateObj.y, scale },
      () => {
        this.switchAreaFlag = false;
      }
    );

    // if (this.translateRecord.length < 2) {
    //   this.translateRecord.push(translate);
    //   this.scaleRecord.push(scale);
    // }
  }

  transformSVGgElement(
    { x, y, scale }: Record<string, number>,
    callback?: () => void
  ) {
    console.log('transformSVGgElement', x, y, scale);
    this.g
      .transition()
      .duration(500)
      .attr('transform', `translate(${x},${y})scale(${scale})`)
      .on('end', () => {
        callback && callback();
      });
  }
}
