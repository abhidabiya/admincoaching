import { APP_PREFIX_PATH } from "config/constant";

const config = {
  // basename: only set at build time. Do not add '/' at the end of BASENAME for breadcrumbs.
  // Also, do not use only '/'; use blank ('') instead, like '/berry-material-react/react/default'.
  basename: "/",
  defaultPath: APP_PREFIX_PATH + "/dashboard",
  fontFamily: `'Poppins', sans-serif`,
  borderRadius: 12,
};

export default config;
