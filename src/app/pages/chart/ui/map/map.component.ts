import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LetDirective } from '@ngrx/component';
import * as d3 from 'd3';
import type { FeatureCollection, Geometry } from 'geojson';
import { debounceTime, distinctUntilChanged, fromEvent, map } from 'rxjs';
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
  getParentIds,
  handleInfoName,
  setLineWidth,
  wait,
} from '../../../../shared/domain/utils';
import { SpinnerComponent } from '../../../../shared/ui/spinner/spinner.component';
import { PantoneComponent } from '../pantone/pantone.component';
import { webBreakpoint } from './../../../../shared/domain/configs/breakPoint';

@Component({
  selector: 'invoice-map',
  standalone: true,
  imports: [
    CommonModule,
    PantoneComponent,
    SpinnerComponent,
    LetDirective,
    MatIconModule,
    MatButtonModule,
  ],
  template: `
    <div class="map-box">
      <invoice-pantone></invoice-pantone>
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
      <invoice-spinner *ngIf="isLoading()"></invoice-spinner>
    </div>
  `,
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() mapData!: MapState;
  @Input() selectedAreaObj!: SelectedOptionState;
  @Output() resetSelect: EventEmitter<void> = new EventEmitter();
  #store = inject(AppComponentStore);
  #breakpointObserver = inject(BreakpointObserver);

  countyData: FeatureCollection<Geometry, CountyProperties> | null = null;
  townData: FeatureCollection<Geometry, TownProperties> | null = null;
  villageData: FeatureCollection<Geometry, VillageProperties> | null = null;

  switchAreaFlag = false;
  map!: D3Selection;
  g!: D3GSelection;
  toolTip: D3DivSelection | null = null;
  currentTarget: D3SVGSelection | null = null;
  prevTarget: D3SVGSelection | null = null;
  isLoading: WritableSignal<boolean> = signal(false);
  isDesktopDevice = false;
  areaPoint: WritableSignal<AreaType | null> = signal(null);

  infoSelected = signal({
    countyName: '',
    townName: '',
    villageName: '',
    fullName: '',
    ddp: 0,
    kmt: 0,
    pfp: 0,
  });

  translateRecordList = {
    county: { x: 0, y: 0, scale: 1 },
    town: { x: 30, y: 200, scale: 1 },
    village: { x: 30, y: 200, scale: 1 },
  };

  normalLineColor = 'white';
  activeLineWidth = 0.3;
  normalLineWidth = 0.1;

  initWidth = 700;
  initHeight = 800;
  width = 700;
  height = 800;

  initialScale = 10000;
  initialLongitude = 121.5;
  initialLatitude = 24.3;

  scale = this.initialScale;
  longitude = this.initialLongitude;
  latitude = this.initialLatitude;

  projection: d3.GeoProjection | null = null;
  path: d3.GeoPath<any, d3.GeoPermissibleObjects> | null = null;

  resizeObservable = fromEvent(window, 'resize').pipe(
    takeUntilDestroyed(),
    debounceTime(250),
    map(() => window.innerWidth),
    distinctUntilChanged()
  );

  get prevChildType() {
    return this.prevTarget?.attr('data-child-type') as AreaType;
  }

  get prevType() {
    return this.prevTarget?.attr('data-type') as AreaType;
  }

  get currentChildType() {
    return this.currentTarget?.attr('data-child-type') as AreaType;
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

  constructor() {
    this.#breakpointObserver.observe([webBreakpoint]).subscribe((result) => {
      this.isDesktopDevice = result.matches;
    });
  }

  ngAfterViewInit() {
    this.initMap();
    this.setToolTip();
    this.createCounty();
    this.resizeObservable.subscribe(() => {
      this.rerenderMap();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const selectedOption = changes['selectedAreaObj']?.currentValue;
    const isFirstChange = changes['selectedAreaObj']?.isFirstChange();
    const mapData = changes['mapData']?.currentValue;

    if (mapData) {
      this.convertTopology();
    }

    if (!isFirstChange) {
      const isSameData = this.checkSameData(changes);
      !isSameData && this.handleSelectChange(selectedOption);
    }
  }

  ngOnDestroy(): void {
    this.destroyMap();
  }

  convertTopology() {
    const { county, town, village } = this.mapData;
    // @ts-ignore
    this.countyData = feature(county, county.objects.counties);
    // @ts-ignore
    this.townData = feature(town, town.objects.town);
    // @ts-ignore
    this.villageData = feature(village, village.objects.village);
  }

  initMap() {
    this.getContainerSize();
    this.calcScale();
    this.calcLongitude();
    this.setProjection();
    this.renderMap();
  }

  getContainerSize() {
    this.width = document.querySelector('.map-box')?.clientWidth ?? 700;
    this.height = document.querySelector('.map-box')?.clientHeight ?? 800;
    console.log('width', this.width);
    console.log('height', this.height);
  }

  calcScale() {
    const magnification = this.isDesktopDevice ? 1 : 1;
    this.scale =
      this.initialScale * (this.width / this.initWidth) * magnification;
    console.log('scale', this.scale);
  }

  calcLongitude() {
    const magnification = this.isDesktopDevice ? 1 : this.width / this.scale;
    const distance =
      (this.width / this.initWidth / this.initialLongitude) * magnification;
    // console.warn('distance', distance);
    console.log('isDesktopDevice', this.isDesktopDevice);
    this.longitude = this.initialLongitude - distance;
    console.log('longitude', this.longitude);
  }

  setProjection() {
    this.projection = d3
      .geoMercator()
      .center([this.longitude, this.latitude])
      .scale(this.scale);
    this.path = d3.geoPath().projection(this.projection);
  }

  destroyMap() {
    this.g && this.g.remove();
  }

  async rerenderMap() {
    this.resetSelect.emit();
    this.resetProperty();
    this.destroyMap();
    this.initMap();
    this.createCounty();
    this.isLoading.set(true);
    await wait(1000);
    this.isLoading.set(false);
  }

  resetProperty() {
    this.switchAreaFlag = false;
    this.currentTarget = null;
    this.prevTarget = null;
    this.areaPoint.set(null);
    this.updateSelectOption('county', null);
    this.updateSelectOption('town', null);
  }

  checkSameData(changes: SimpleChanges) {
    const selectedAreaNewObj = changes['selectedAreaObj']?.currentValue;
    const selectedAreaOldObj = changes['selectedAreaObj']?.previousValue;
    const { county: countyNew, town: townNew } = selectedAreaNewObj;
    const { county: countyOld, town: townOld } = selectedAreaOldObj;
    if (countyNew !== countyOld) {
      return false;
    }
    if (townNew !== townOld) {
      return false;
    }
    return true;
  }

  async handleSelectChange(selectedOption: SelectedOptionState) {
    const { county, town } = selectedOption;
    let target = null;
    if (county) {
      target = this.getSVGPath(county);
    }
    if (town) {
      target = this.getSVGPath(town);
      if (this.currentType === 'town') {
        this.goBackArea();
        await wait(1000);
        target = this.getSVGPath(town);
      }
    }
    this.dispatchEvent(target);
    if (!county && !town) {
      this.handleToOverview();
    }
  }

  async handleToOverview() {
    this.goBackArea();
    if (this.currentType === 'county') {
      await wait(1000);
      this.goBackArea();
    }
  }

  getSVGPath(id: string) {
    return document.querySelector<SVGPathElement>(`[data-id="${id}"]`);
  }

  dispatchEvent(target: SVGPathElement | null) {
    target?.dispatchEvent(new Event('click'));
  }

  setToolTip() {
    this.toolTip = d3.select('.map-info');
  }

  renderToolTip(data: AreaPropertiesItem) {
    if (!this.isDesktopDevice) return;
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
    const childType = getChildType(areaType);
    this.g
      .selectAll(`.${areaType}`)
      .data(mapData)
      .enter()
      .append('path')
      .classed(areaType, true)
      .attr('d', this.path)
      .attr('data-type', areaType)
      .attr('data-child-type', childType)
      .attr('data-parent-id', (d) => getParentIds(d.properties))
      .attr('data-id', (d) => getAreaIds(d.properties))
      .style('stroke-width', childType ? setLineWidth(childType) : 0.05)
      .style('stroke', this.normalLineColor)
      .style('fill', function (d) {
        const { winnerRate, winner } = d.properties;
        return genColor(winnerRate, winner);
      })
      .on('click', function (event, d) {
        if (self.switchAreaFlag) return;
        if (areaType !== 'village') {
          self.prevTarget = self.currentTarget;
          self.currentTarget = d3.select(this);
          self.areaPoint.set(areaType);
          self.updateSelectOption(areaType, getAreaIds(d.properties));
          areaType == 'county' && self.updateSelectOption(childType, null);
          self.switchArea(d);
        }
      })
      .on('mouseover', function (event, d) {
        self.renderToolTip(d.properties);
      })
      .on('mousemove', function (event) {
        d3.select(this).attr('opacity', 0.8);
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

  removeBoundary(isBack: boolean = false) {
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

  async goBackArea() {
    console.warn('goBackArea');
    let targetId = null;
    const areaPoint = this.areaPoint();
    if (areaPoint) {
      targetId = this.currentTarget?.attr('data-parent-id') ?? '';
      const target = this.getSVGPath(targetId);
      this.dispatchEvent(target);
      if (areaPoint === 'county') {
        this.goBackOverview();
      }
    }
  }

  async goBackOverview() {
    const areaPoint = this.areaPoint();
    const { x, y, scale } = this.translateRecordList[areaPoint as AreaType];
    this.switchAreaFlag = true;
    this.removeBoundary(true);
    await this.clearArea(getChildType(areaPoint));
    this.transformSVGgElement({ x, y, scale });
    this.resetProperty();
  }

  updateSelectOption(type: AreaType | null, id: string | null) {
    if (!type) return;
    this.#store.setSelectedOption({ key: type, value: id });
  }

  async switchArea(data: MapGeometryData) {
    this.switchAreaFlag = true;
    this.removeBoundary();
    await this.clearArea(this.prevChildType);
    this.drawBoundary();
    switch (this.currentType) {
      case 'county': {
        this.createTown(data);
        this.zoom(this.currentChildType, data);
        !this.isSameLevel && this.updateSelectOption(this.prevType, null);
        break;
      }
      case 'town': {
        this.createVillage(data);
        this.zoom(this.currentChildType, data);
        break;
      }
      default:
        break;
    }
  }

  createCounty() {
    if (this.countyData?.features) {
      this.createMapArea('county', this.countyData?.features);
    }
  }

  createTown(data: MapGeometryData) {
    const townList =
      this.townData?.features.filter(
        (item) => item?.properties?.['countyId'] == data.id
      ) || [];
    this.createMapArea('town', townList);
  }

  createVillage(data: MapGeometryData) {
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
    const bounds = this.path!.bounds(data as d3.GeoPermissibleObjects);
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
