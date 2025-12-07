import { cloneDeep } from 'lodash';
import { matchPath } from 'react-router-dom';

import navConfig from 'src/nav-config';
import { initialBcState } from 'src/store/slices/breadcrumbs';

export const getActiveNavItemThroughPath = (pathname: string) => {
  const homeRoute = navConfig.find((item) => isActive(item.path, '/'))!;

  const result = cloneDeep(initialBcState);

  if (pathname === '/') {
    result.activeCrumb = homeRoute;
    result.stack = [homeRoute];
  }

  const mainRoute = navConfig.find((item) => isActive(item.path, pathname))!;

  result.activeCrumb = mainRoute;
  result.stack = [homeRoute, mainRoute];

  navConfig.forEach((routerItem) => {
    if (routerItem.children) {
      const childRoute = routerItem.children.find((item) => isActive(item.path, pathname));
      if (childRoute) {
        result.activeCrumb = childRoute;
        result.stack = [homeRoute, mainRoute, childRoute];
      }
    }
  });

  return result;
};

export const isActive = (path: string, pathname: string) => {
  if (path === '/') {
    return path ? !!matchPath({ path }, pathname) : false;
  }
  return path ? !!matchPath({ path, end: false }, pathname) : false;
};
