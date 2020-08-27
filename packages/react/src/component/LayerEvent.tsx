import { ILayer } from '@cgcs2000/l7';
import * as React from 'react';
import { useLayerValue } from './LayerContext';

const { useEffect } = React;
interface ILayerProps {
  type: string;
  handler: (...args: any[]) => void;
}
export const LayerEvent = React.memo((props: ILayerProps) => {
  const { type, handler } = props;
  const layer = (useLayerValue() as unknown) as ILayer;

  useEffect(() => {
    layer.off(type, handler);
    layer.on(type, handler);
    return () => {
      layer.off(type, handler);
    };
  }, [type, handler]);
  return null;
});
