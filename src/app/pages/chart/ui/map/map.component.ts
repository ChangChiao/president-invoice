import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Input,
  inject,
  signal,
} from '@angular/core';
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
  AreaType,
  CountyGeometry,
  CountyProperties,
  D3GSelection,
  D3SVGSelection,
  D3Selection,
  MapBounds,
  MapGeometryData,
  MapState,
  TownGeometry,
  TownProperties,
  VillageProperties,
} from '../../../../shared/domain/models';
import { AppComponentStore } from '../../../../shared/domain/store';

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
  translateRecord = [{ x: 30, y: 200 }];

  isPrevShow = false;

  isMobile = false;
  map!: D3Selection;
  g!: D3GSelection;
  // toolTip = null;
  colorScale = null;
  currentTarget!: D3SVGSelection;
  prevTarget!: D3SVGSelection;

  activeLineColor = 'black';
  normalLineColor = 'white';
  activeLineWidth = 0.3;
  normalLineWidth = 0.1;

  countyData: FeatureCollection<Geometry, CountyProperties> | null = null;
  townData: FeatureCollection<Geometry, TownProperties> | null = null;
  villageData: FeatureCollection<Geometry, VillageProperties> | null = null;

  projection = d3.geoMercator().center([121, 24.5]).scale(this.initialScale);
  path = d3.geoPath().projection(this.projection);

  ngAfterViewInit() {
    this.width = document.body.clientWidth;
    this.height = document.body.clientHeight;
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
      // this.createCounty();
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
      .style('fill', function (i) {
        const { winnerRate, winner } = i.properties;
        return self.genColor(winnerRate, winner);
      })
      .on('click', function (event, d) {
        self.clearBoundary();
        self.currentTarget = d3.select(this);
        self.drawBoundary();
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
        (item) => item?.properties?.['countyId'] == data.id
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
      .style('fill', function (i) {
        const { winnerRate, winner } = i.properties;
        return self.genColor(winnerRate, winner);
      })
      .on('click', function (event, d) {
        self.clearBoundary();
        self.currentTarget = d3.select(this);
        self.drawBoundary();
        self.switchArea(d);
      })
      .on('mouseover', function (event, d) {
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
      .style('fill', function (i) {
        const { winnerRate, winner } = i.properties;
        return self.genColor(winnerRate, winner);
      })
      .on('mouseover', function (event, d) {
        d3.select(this).attr('opacity', 0.8);
        // self.showInfo(d);
      })
      .on('mouseout', function () {
        d3.select(this).attr('opacity', 1);
      });
    return { villagePaths };
  }

  getChildType(type: AreaType) {
    if (type === 'county') return 'town';
    if (type === 'town') return 'village';
    return 'village';
  }

  createMapArea(areaType: AreaType, mapData: MapGeometryData[]) {
    const self = this;
    if (!areaType || !mapData) return;
    console.log('createMapArea---', areaType);
    const arr = document.getElementsByClassName(areaType);
    console.log('arr', arr.length);
    this.g
      .selectAll(`.${areaType}`)
      .data(mapData)
      .enter()
      .append('path')
      .classed(areaType, true)
      .attr('d', this.path)
      .attr('data-type', areaType)
      .attr('data-child', this.getChildType(areaType))
      .style('stroke-width', this.setLineWidth(areaType))
      .style('stroke', this.normalLineColor)
      .style('fill', function (d) {
        const { winnerRate, winner } = d.properties;
        return self.genColor(winnerRate, winner);
      })
      .on('click', function (event, d) {
        self.prevTarget = self.currentTarget;
        self.clearBoundary();
        self.currentTarget = d3.select(this);
        self.drawBoundary();
        if (areaType !== 'village') {
          self.switchArea(d);
        }
      })
      .on('mouseover', function () {
        d3.select(this).attr('opacity', 0.8);
        // self.showInfo(d);
      })
      .on('mouseout', function () {
        d3.select(this).attr('opacity', 1);
      });
  }

  drawBoundary() {
    if (!this.currentTarget) return;
    const type = this.currentTarget.attr('data-type');
    this.currentTarget.style('stroke-width', this.setLineWidth(type, true));
    this.currentTarget.style('stroke', this.activeLineColor);
    this.currentTarget.raise();
  }

  clearBoundary() {
    if (!this.prevTarget) return;
    const type = this.prevTarget.attr('data-type');
    this.prevTarget.style('stroke-width', this.setLineWidth(type));
    this.prevTarget.style('stroke', this.normalLineColor);
    this.prevTarget.lower();
  }

  async clearArea(type: string) {
    return new Promise((resolve) => {
      const totalLength = document.getElementsByClassName(type)?.length;
      let count = 0;
      this.g
        .selectAll(`.${type}`)
        .data([])
        .exit()
        .transition()
        .on('end', function () {
          // 在過渡結束後執行的 callback
          // 在這裡執行下一個 function
          count += 1;
          if (count === totalLength) {
            resolve(true);
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

  getDataType(id: string | number | undefined) {
    if (!id) return 'village';
    if (typeof id === 'number') id = id.toString();
    const length = id.length;
    if (length === 5) {
      return 'county';
    }
    if (length === 8) {
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
      this.clearBoundary();
    } else {
      this.clearArea('town');
      const [targetScale] = this.scaleRecord;
      const [targetTranslate] = this.translateRecord;
      scale = targetScale;
      x = targetTranslate.x;
      y = targetTranslate.y;
      this.isPrevShow = false;
      this.clearBoundary();
    }
    this.g
      .transition()
      .duration(500)
      .attr('transform', `translate(${x},${y})scale(${scale})`);
  }

  async switchArea(data: MapGeometryData) {
    const currentType = this.currentTarget?.attr('data-child');
    const prevType = this.prevTarget?.attr('data-child');
    if (currentType === prevType) {
      console.warn('same');
      console.log('prevType', prevType);
      await this.clearArea(prevType);
    }
    const type = this.getDataType(data.id);
    console.log('switchArea--type', type);
    console.log('switchArea--data', data);
    switch (type) {
      case 'county': {
        this.toTown(data);
        this.zoom(data);
        break;
      }
      case 'town': {
        this.toVillage(data);
        this.zoom(data);
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

  zoom(data: d3.GeoPermissibleObjects) {
    const bounds = this.path.bounds(data as d3.GeoPermissibleObjects);
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
