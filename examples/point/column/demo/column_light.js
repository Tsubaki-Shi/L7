import { Scene, PointLayer, Popup } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    pitch: 48.62562,
    style: 'light',
    center: [ 104.026043, 31.847 ],
    rotation: -0.76,
    zoom: 4.48
  })
});
scene.on('loaded', () => {
  fetch('https://gw.alipayobjects.com/os/rmsportal/oVTMqfzuuRFKiDwhPSFL.json')
    .then(res => res.json())
    .then(data => {
      const pointLayer = new PointLayer({})
        .source(data.list, {
          parser: {
            type: 'json',
            x: 'j',
            y: 'w'
          }
        })
        .shape('cylinder')
        .size('t', function(level) {
          return [ 1, 2, level * 2 + 20 ];
        })
        .active(true)
        .color('#006CFF')
        .style({
          opacity: 1.0
        });
      pointLayer.on('mousemove', e => {
        const popup = new Popup({
          offsets: [ 0, 0 ],
          closeButton: false
        })
          .setLnglat(e.lngLat)
          .setHTML(`<span>${e.feature.s}: ${e.feature.t}℃</span>`);
        scene.addPopup(popup);
      });
      scene.addLayer(pointLayer);
    });
});
