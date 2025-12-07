import type { AppDispatch, RootState } from '@store';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
const useAppDispatch: () => AppDispatch = useDispatch;
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export { useAppDispatch, useAppSelector };

export { useFilterFormWithUrlSync } from './useFilterFormWithUrlSync';
export { useFormSearchParams } from './useFormSearchParams';
export { default as useMaxWidthChecker } from './useMaxWidthChecker';
export { default as useResponsive } from './useResponsive';
export { default as useScrollPosition } from './useScrollPosition';
export { default as useWindowSize } from './useWindowSize';
