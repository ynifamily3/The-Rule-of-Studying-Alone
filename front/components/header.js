import Head from "next/head";
import "../css/normalize.css";
/*import "semantic-ui-css/semantic.min.css";*/
export default () => (
  <div>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link
        rel="stylesheet"
        href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css"
      />
      <link
        href="https://fonts.googleapis.com/css?family=Noto+Sans+KR|Roboto&display=swap"
        rel="stylesheet"
      />
      <meta charSet="utf-8" />
    </Head>
    <style jsx global>{`
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }
      h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
        font-family: "Roboto", "Noto Sans KR", sans-serif;
      }
      body {
        font-family: "Roboto", "Noto Sans KR", sans-serif;
      }
    `}</style>
  </div>
);
