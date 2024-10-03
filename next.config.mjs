// next.config.mjs
export default {
  async redirects() {
    return [
      {
        source: "/board",
        destination: "/",
        permanent: true, // true일 경우 308 Permanent Redirect, false일 경우 307 Temporary Redirect
      },
    ];
  },
};
