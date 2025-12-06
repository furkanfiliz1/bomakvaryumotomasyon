import { NonIndexRouteObject, useNavigate, useRoutes } from 'react-router-dom';
import { useUser } from '@hooks';
import { NotAuthorized } from '@pages';
import { useEffect } from 'react';
import { checkIfAuthenticatedRoute } from '@utils';
import { useDispatch } from 'react-redux';
import { authRedux } from '@store';
import { getFromParams } from '@helpers';
import router from './router';

interface RouteChildrenWithRoles extends NonIndexRouteObject {
  hidden?: boolean;
}

export interface IRouteObject extends NonIndexRouteObject {
  children?: RouteChildrenWithRoles[];
}

export default function Router() {
  const user = useUser();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const accessToken = getFromParams('accessToken');

  useEffect(() => {
    if (accessToken) {
      dispatch(authRedux.logout());
      dispatch(authRedux.setAccessToken(accessToken || ''));
      navigate('/renew-password', { state: { isCreateNewPassword: true } });
    }
  }, [accessToken, dispatch, navigate]);

  const filteredRoute = router.map((route) => {
    return {
      ...route,
      children: route.children?.map((route) => ({
        ...route,
        element: checkIfAuthenticatedRoute(user, route) ? route.element : <NotAuthorized />,
      })),
    };
  });

  const activeRoute = useRoutes(filteredRoute);

  return activeRoute;
}
