import { Helmet } from 'react-helmet';

const Head = () => {
  return (
    <Helmet>
      <meta httpEquiv="ScreenOrientation" content="autoRotate:disabled" />
    </Helmet>
  );
};

export default Head;
