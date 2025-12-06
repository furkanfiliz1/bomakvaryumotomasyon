import { useAppSelector, useUser } from '@hooks';
import { useEffect } from 'react';
import { tr } from 'yup-locales';
import yup from '@validation';
import { getUserType } from '@helpers';
const DocumentTitle = () => {
  const language = useAppSelector((state) => state.settings.language);
  const activeCrumb = useAppSelector((state) => state.breadcrumbs.activeCrumb);
  const user = useUser();

  let activeCrumbText = '';
  if (typeof activeCrumb?.title === 'function') {
    activeCrumbText = activeCrumb?.title(getUserType(user));
  } else {
    activeCrumbText = activeCrumb?.title;
  }

  useEffect(() => {
    document.getElementById('htmlTAG')!.lang = language;

    if (language !== 'en') {
      yup.setLocale(tr);
    }

    document.title = `Figopara ${activeCrumbText ? '|' : ''} ${activeCrumbText}`;
  }, [language, activeCrumb, user, activeCrumbText]);

  return null;
};

export default DocumentTitle;
