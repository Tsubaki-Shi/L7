import { IInteractionTarget, ILngLat, Scene } from '@cgcs2000/l7';
import { Feature } from '@turf/helpers';
import { DrawEvent } from '../util/constant';
import { IDrawFeatureOption } from './draw_feature';
import DrawFeature, { IDrawOption } from './draw_mode';
export default class DrawEdit extends DrawFeature {
  private endPoint: ILngLat;
  // 绘制完成之后显示
  constructor(scene: Scene, options: Partial<IDrawFeatureOption> = {}) {
    super(scene, options);
  }

  public setEditFeature(feature: Feature) {
    this.currentFeature = feature;
  }

  protected onDragStart = (e: IInteractionTarget) => {
    // @ts-ignore
  };

  protected getDefaultOptions() {
    return {
      steps: 64,
      units: 'kilometres',
      cursor: 'move',
    };
  }

  protected onDragging = (e: IInteractionTarget) => {
    this.endPoint = e.lngLat;
    this.emit(DrawEvent.Edit, this.endPoint);
    return;
  };

  protected onDragEnd = () => {
    this.emit(DrawEvent.UPDATE, this.currentFeature);
    this.resetCursor();
    this.disable();
  };
  protected onClick = () => {
    return null;
  };
}
