import { ILayer } from '@cgcs2000/l7';
import * as React from 'react';
import { ISourceOptions } from './';

const { useEffect } = React;
interface ISourceProps {
  layer: ILayer;
  source: Partial<ISourceOptions>;
}
export default React.memo(function Chart(props: ISourceProps) {
  const { layer, source } = props;
  const { data, ...sourceOption } = source;

  useEffect(() => {
    if (!layer.inited) {
      layer.source(data, sourceOption);
    } else {
      layer.setData(data, sourceOption);
    }
    if (sourceOption.autoFit) {
      layer.fitBounds(sourceOption && sourceOption.fitBoundsOptions);
    }
  }, [data, JSON.stringify(sourceOption)]);
  return null;
});
