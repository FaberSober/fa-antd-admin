import { createContext } from 'react';

export interface BaseDrawerContextProps {
  closeDrawer: () => void;
}

export const BaseDrawerContext = createContext<BaseDrawerContextProps>({ closeDrawer: () => { } });
