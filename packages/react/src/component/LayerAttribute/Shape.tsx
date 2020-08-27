import { ILayer, StyleAttrField } from '@cgcs2000/l7';
import * as React from 'react';
import { IAttributeOptions } from './';

const { useEffect } = React;
interface ILayerProps {
  layer: ILayer;
  shape: Partial<IAttributeOptions>;
}
export default React.memo(function Chart(props: ILayerProps) {
  const { layer, shape } = props;
  useEffect(() => {
    shape.field
      ? layer.shape(shape.field, shape.values)
      : layer.shape(shape.values as StyleAttrField);
  }, [shape.field, JSON.stringify(shape.values), JSON.stringify(shape.options)]);
  return null;
});
