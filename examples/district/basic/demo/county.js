import { Scene } from '@antv/l7';
import { CountyLayer } from '@antv/l7-district';
import { Mapbox } from '@antv/l7-maps';
const colors = [ '#B8E1FF', '#7DAAFF', '#3D76DD', '#0047A5', '#001D70' ];
const scene = new Scene({
  id: 'map',
  map: new Mapbox({
    center: [ 116.2825, 39.9 ],
    pitch: 0,
    style: 'blank',
    zoom: 3,
    minZoom: 3,
    maxZoom: 10
  })
});
scene.on('loaded', () => {
  new CountyLayer(scene, {
    data: [],
    adcode: [ '110101', '110102', '110106' ],
    depth: 3,
    label: {
      field: 'NAME_CHN'
    },
    fill: {
      color: {
        field: 'NAME_CHN',
        values: colors
      }
    },
    popup: {
      enable: true,
      Html: props => {
        return `<span>${props.NAME_CHN}</span>`;
      }
    }
  });
});
