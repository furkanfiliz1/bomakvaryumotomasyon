import { Helmet } from 'react-helmet';

// const safeUrls = `
//     *.figopara.com
//     *.craftgate.com.tr
//     *.craftgate.com
//     *.epaykolay.com
//     *.clarity.ms
//     *.gstatic.com
//     *.googleapis.com
//     *.firebaseapp.com
//     *.appspot.com
//     *.bing.com
//     *.gtm.com
//     *.google.com
//     *.google.com.tr
//     *.googletagmanager.com
//     *.isbank.com.tr
//     *.isbank.com
//     *.w3.org
//     *.bkm.com.tr
//     *.taboola.com
//     *.facebook.net
//     *.facebook.com
//     *.licdn.com
//     *.tiktok.com
//     *.linkedin.com
//     *.doubleclick.net
//   `;

const Head = () => {
  return (
    <Helmet>
      {/* <meta
        httpEquiv="Content-Security-Policy"
        content={`
          default-src 'self' ws: ${safeUrls};
          script-src 'self' 'unsafe-eval' 'unsafe-inline' ws: ${safeUrls}; 
          connect-src data: 'self' ws: ${safeUrls}; 
          img-src data: 'self' ${safeUrls}; 
          style-src 'unsafe-inline' ${safeUrls};
          font-src 'self' ws: ${safeUrls};
          frame-src data: ${safeUrls};
        `}
      /> */}

      <meta httpEquiv="ScreenOrientation" content="autoRotate:disabled" />
    </Helmet>
  );
};

export default Head;
