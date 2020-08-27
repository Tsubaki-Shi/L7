import { Scene } from '@cgcs2000/l7';
import { createContext, useContext } from 'react';

// tslint:disable-next-line: no-object-literal-type-assertion
export const SceneContext = createContext<Scene | undefined>({} as Scene);
export function useSceneValue(): Scene {
  return (useContext(SceneContext) as unknown) as Scene;
}
