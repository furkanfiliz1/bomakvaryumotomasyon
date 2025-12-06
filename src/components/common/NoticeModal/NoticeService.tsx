/* eslint-disable react/no-children-prop */
import { useState, FC, createContext, useContext, useRef, useCallback } from 'react';
import { NoticeModal, NoticeOptions } from '.';

const NoticeServiceContext = createContext<(options: NoticeOptions) => Promise<void>>(Promise.reject);

export const useNotice = () => useContext(NoticeServiceContext);
interface AuxProps {
  children: JSX.Element[] | JSX.Element;
}

export const NoticeServiceProvider: FC<AuxProps> = ({ children }) => {
  const [noticeModalVisibleState, setNoticeModalVisibleState] = useState<NoticeOptions | null>(null);

  const awaitingPromiseRef = useRef<{
    resolve: () => void;
    reject: () => void;
  }>();

  const openConfirmation = useCallback((options: NoticeOptions) => {
    setNoticeModalVisibleState(options);
    return new Promise<void>((resolve, reject) => {
      awaitingPromiseRef.current = { resolve, reject };
    });
  }, []);

  const handleClose = () => {
    if (noticeModalVisibleState?.catchOnCancel && awaitingPromiseRef.current) {
      awaitingPromiseRef.current.reject();
    }
    setNoticeModalVisibleState(null);
  };

  const handleSubmit = () => {
    if (awaitingPromiseRef.current) {
      awaitingPromiseRef.current.resolve();
    }
    setNoticeModalVisibleState(null);

    noticeModalVisibleState?.onClick && noticeModalVisibleState?.onClick();
  };

  return (
    <>
      <NoticeServiceContext.Provider value={openConfirmation} children={children} />

      <NoticeModal
        open={Boolean(noticeModalVisibleState)}
        onClose={handleClose}
        {...noticeModalVisibleState}
        onClick={handleSubmit}
      />
    </>
  );
};
