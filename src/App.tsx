import { store } from '@store';
import Router from './router';
import { Provider } from 'react-redux';
import ThemeProvider from './theme';
import { SnackbarProvider } from 'notistack';
import { NoticeServiceProvider } from './components/common/NoticeModal/NoticeService';
import DocumentTitle from './components/DocumentTitle';
import ErrorBoundary from './ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <DocumentTitle />
        <SnackbarProvider
          autoHideDuration={3500}
          maxSnack={3}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}>
          <ThemeProvider>
            <NoticeServiceProvider>
              <Router />
            </NoticeServiceProvider>
          </ThemeProvider>
        </SnackbarProvider>
      </Provider>
    </ErrorBoundary>
  );
}

export default App;
