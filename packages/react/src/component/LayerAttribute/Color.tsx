import { ILayer, StyleAttrField } from '@cgcs2000/l7';
import * as React from 'react';
import { IAttributeOptions } from './';

const { useEffect } = React;
interface ILayerProps {
  layer: ILayer;
  color: Partial<IAttributeOptions>;
}
export default React.memo(function Chart(props: ILayerProps) {
  const { layer, color } = props;
  useEffect(() => {
    color.field
      ? layer.color(color.field as StyleAttrField, color.values)
      : layer.color(color.values as StyleAttrField);
  }, [color.field, color.scale, JSON.stringify(color.values), JSON.stringify(color.options)]);

  return null;
});
