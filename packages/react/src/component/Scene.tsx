import { IMapWrapper, Scene } from '@cgcs2000/l7';
import React, { createElement, createRef, useEffect, useState } from 'react';
import { SceneContext } from './SceneContext';
interface IMapSceneConig {
  style?: Partial<React.CSSProperties>;
  className?: string;
  map: IMapWrapper;
  children?: React.ReactNode;
}
export default React.memo((props: IMapSceneConig) => {
  const { style, className, map } = props;
  const container = createRef();
  const [scene, setScene] = useState<Scene>();
  useEffect(() => {
    const sceneInstance = new Scene({
      id: container.current as HTMLDivElement,
      map,
    });
    sceneInstance.on('loaded', () => {
      setScene(sceneInstance);
    });
    return () => {
      sceneInstance.destroy();
    };
  }, []);

  return (
    <SceneContext.Provider value={scene}>
      {createElement(
        'div',
        {
          ref: container,
          style,
          className,
        },
        scene && props.children,
      )}
    </SceneContext.Provider>
  );
});
