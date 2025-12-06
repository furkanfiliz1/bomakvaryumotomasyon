import { Box, CircularProgress } from '@mui/material';
import { authRedux } from '@store';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(authRedux.logout());
    navigate({
      pathname: '/login',
      search: location.search,
    });
  }, [dispatch, navigate]);

  return (
    <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <CircularProgress />
    </Box>
  );
};

export default Logout;
