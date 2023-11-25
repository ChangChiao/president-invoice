import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LetDirective } from '@ngrx/component';
import * as d3 from 'd3';
import type { FeatureCollection, Geometry } from 'geojson';
import { feature } from 'topojson-client';
import {
  AreaPropertiesItem,
  AreaType,
  CountyProperties,
  D3DivSelection,
  D3GSelection,
  D3SVGSelection,
  D3Selection,
  MapBounds,
  MapGeometryData,
  MapState,
  SelectedOptionState,
  TownProperties,
  VillageProperties,
} from '../../../../shared/domain/models';
import { AppComponentStore } from '../../../../shared/domain/store';
import {
  genColor,
  getAreaIds,
  getChildType,
  getParentType,
  handleInfoName,
  setLineWidth,
  wait,
} from '../../../../shared/domain/utils';

@Component({
  selector: 'invoice-map',
  standalone: true,
  imports: [CommonModule, LetDirective, MatIconModule, MatButtonModule],
  template: `
    <div class="map-box">
      <svg class="map"></svg>
      <div class="map-info">
        <h3 class="map-info-title">{{ infoSelected().fullName }}</h3>
        <ul class="map-info-list">
          <li>蔡英文： {{ infoSelected().ddp }}%</li>
          <li>韓國瑜： {{ infoSelected().kmt }}%</li>
          <li>宋楚瑜： {{ infoSelected().pfp }}%</li>
        </ul>
      </div>
      <div id="collapse-content"></div>
      @if (areaPoint()) {
      <button (click)="goBackArea()" class="map-back" mat-icon-button>
        <mat-icon fontIcon="arrow_back"></mat-icon>
      </button>
      }
    </div>
  `,
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent implements AfterViewInit, OnChanges {
  @Input() mapData!: MapState;
  @Input() selectedOption!: SelectedOptionState;
  @Output() areaClickEvent = new EventEmitter<Record<AreaType, string>>();
  #store = inject(AppComponentStore);
  selectedData = signal({});

  countyData: FeatureCollection<Geometry, CountyProperties> | null = null;
  townData: FeatureCollection<Geometry, TownProperties> | null = null;
  villageData: FeatureCollection<Geometry, VillageProperties> | null = null;

  switchAreaFlag = false;
  isMobile = false;
  map!: D3Selection;
  g!: D3GSelection;
  toolTip: D3DivSelection | null = null;
  colorScale = null;
  currentTarget: D3SVGSelection | null = null;
  prevTarget: D3SVGSelection | null = null;

  centerPoint = { x: 0, y: 0 };
  width = 700;
  height = 800;
  initialScale = 11000;
  isDesktopDevice = false;

  infoSelected = signal({
    countyName: '',
    townName: '',
    villageName: '',
    fullName: '',
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
    this.setToolTip();

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

  ngOnChanges(changes: SimpleChanges): void {
    const selectedOption = changes['selectedOption']?.currentValue;
    const isFirstChange = changes['selectedOption']?.isFirstChange();

    if (!isFirstChange) {
      this.handleSelectChange(selectedOption);
    }
  }

  async handleSelectChange(selectedOption: SelectedOptionState) {
    const { county, town } = selectedOption;
    let target = null;
    if (county) {
      target = document.querySelector<SVGPathElement>(`[data-id="${county}"]`);
    }
    if (town) {
      target = document.querySelector<SVGPathElement>(`[data-id="${town}"]`);
      if (this.currentType === 'town') {
        this.goBackArea(true);
        await wait(1000);
        target = document.querySelector<SVGPathElement>(`[data-id="${town}"]`);
      }
    }
    this.dispatchEvent(target);
    if (!county && !town) {
      this.handleToOverview();
    }
  }

  async handleToOverview() {
    console.error('this.currentType', this.currentType);
    this.goBackArea();
    if (this.currentType === 'town') {
      await wait(1000);
      this.goBackArea();
    }
  }

  dispatchEvent(target: SVGPathElement | null) {
    target?.dispatchEvent(new Event('click'));
  }

  setToolTip() {
    this.toolTip = d3.select('.map-info');
    // .style('position', 'absolute')
    // .style('z-index', '10')
    // .style('visibility', 'hidden');
  }

  renderToolTip(data: AreaPropertiesItem) {
    console.warn('tooltip', this.toolTip);
    const { kmt, ddp, pfp } = data;
    const fullName = handleInfoName(data);
    this.infoSelected.update((value) => ({
      ...value,
      kmt,
      ddp,
      pfp,
      fullName,
    }));
    this.toolTip?.style('visibility', 'visible');
  }

  createMapArea(areaType: AreaType, mapData: MapGeometryData[]) {
    const self = this;
    if (!areaType || !mapData) return;
    const childType = getChildType(areaType);
    this.g
      .selectAll(`.${areaType}`)
      .data(mapData)
      .enter()
      .append('path')
      .classed(areaType, true)
      .attr('d', this.path)
      .attr('data-type', areaType)
      .attr('data-child', childType)
      .attr('data-id', (d) => getAreaIds(d.properties))
      .style('stroke-width', childType ? setLineWidth(childType) : 0.05)
      .style('stroke', this.normalLineColor)
      .style('fill', function (d) {
        const { winnerRate, winner } = d.properties;
        return genColor(winnerRate, winner);
      })
      .on('click', function (event, d) {
        if (self.switchAreaFlag) return;
        self.prevTarget = self.currentTarget;
        self.currentTarget = d3.select(this);

        if (areaType !== 'village') {
          self.areaPoint.set(areaType);
          self.emitAreaId(areaType, getAreaIds(d.properties));
          self.switchArea(d);
        }
      })
      .on('mouseover', function (event, d) {
        self.renderToolTip(d.properties);
      })
      .on('mousemove', function (event) {
        d3.select(this).attr('opacity', 0.8);
        console.log('pageY', event.pageY);
        console.log('pageX', event.pageX);
        self.toolTip
          ?.style('top', event.pageY - 170 + 'px')
          .style('left', event.pageX + 100 - self.width + 'px');
      })
      .on('mouseout', function () {
        d3.select(this).attr('opacity', 1);
      })
      .on('mouseleave', function () {
        self.toolTip?.style('visibility', 'hidden');
      });
  }

  drawBoundary() {
    if (!this.currentTarget) return;
    const type = this.currentType;
    this.currentTarget.style('stroke-width', setLineWidth(type, true));
    this.currentTarget.raise();
  }

  clearBoundary(isBack: boolean = false) {
    const target: D3SVGSelection | null = isBack
      ? this.currentTarget
      : this.prevTarget;
    if (!target) return;
    const type = this.prevType;
    target.style('stroke-width', setLineWidth(type));
    target.lower();
  }

  async clearArea(type: AreaType | null) {
    if (!type) return;
    return new Promise((resolve) => {
      const totalLength = document.getElementsByClassName(type)?.length;
      if (totalLength === 0) resolve(true);
      let count = 0;
      this.g
        .selectAll(`.${type}`)
        .data([])
        .exit()
        .transition()
        .on('end', function () {
          count += 1;
          if (count === totalLength) {
            resolve(true);
            console.warn('resolve');
          }
        })
        .remove();
    });
  }

  renderMap() {
    this.map = d3
      .select('.map')
      .attr('width', this.width)
      .attr('height', this.height);
    this.g = this.map?.append('g');
  }

  async goBackArea(forZoomOut = false) {
    console.warn('goBackArea');
    console.log('child', getChildType(this.areaPoint()));
    this.switchAreaFlag = true;
    const areaPoint = this.areaPoint();
    if (areaPoint) {
      if (forZoomOut) {
        console.log('back~~~~~~~~');
        this.handleTownBack();
        await wait(500);
        this.handleReset(areaPoint);
        return;
      }
      const parentType = getParentType(areaPoint);
      const { x, y, scale } = this.translateRecordList[areaPoint as AreaType];
      this.transformSVGgElement({ x, y, scale });
      console.log('parentType', parentType);
      this.clearBoundary(true);
      await this.clearArea(getChildType(areaPoint));
      this.emitAreaId(areaPoint, null);
      this.areaPoint.set(parentType);
      this.handleReset(areaPoint);
    }
  }

  handleTownBack() {
    const townId = this.prevTarget?.attr('data-id');
    const target = document.querySelector<SVGPathElement>(
      `[data-id="${townId}"]`
    );
    target?.dispatchEvent(new Event('click'));
  }

  handleReset(areaPoint: AreaType) {
    const parentType = getParentType(areaPoint);
    this.switchAreaFlag = false;
    if (parentType === null) {
      this.currentTarget = null;
      this.prevTarget = null;
    }
  }

  emitAreaId(type: AreaType | null, id: string | null) {
    if (!type) return;
    this.#store.setSelectedOption({ key: type, value: id });
  }

  async switchArea(data: MapGeometryData) {
    console.log('switchAreaFlag', this.switchAreaFlag);
    this.switchAreaFlag = true;
    this.clearBoundary();
    this.drawBoundary();
    console.warn('prevType', this.prevType);
    console.warn('currentType', this.currentType);
    await this.clearArea(this.prevChildType);
    switch (this.currentType) {
      case 'county': {
        this.toTown(data);
        this.zoom(this.currentChildType, data);
        !this.isSameLevel && this.emitAreaId(this.prevType, null);
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
    this.createMapArea('town', townList);
  }

  toVillage(data: MapGeometryData) {
    const villages =
      this.villageData?.features.filter(
        (i) => i.properties.townId == data.id
      ) || [];
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
  }

  transformSVGgElement(
    { x, y, scale }: Record<string, number>,
    callback?: () => void
  ) {
    this.g
      .transition()
      .duration(500)
      .attr('transform', `translate(${x},${y})scale(${scale})`)
      .on('end', () => {
        callback && callback();
      });
  }
}
