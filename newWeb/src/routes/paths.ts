export const rootPaths = {
  homeRoot: '/',
  authRoot: 'authentication',
  errorRoot: 'error',
};

export default {
  home: `/${rootPaths.homeRoot}`,
  customers: `${rootPaths.homeRoot}customers`,
  managers: `${rootPaths.homeRoot}managers`,
  mechanics: `${rootPaths.homeRoot}mechanics`,
  tasks: `${rootPaths.homeRoot}tasks`,
  invoices: `${rootPaths.homeRoot}invoices`,
  cars: `${rootPaths.homeRoot}cars`,
  services: `${rootPaths.homeRoot}services`,
  reports: `${rootPaths.homeRoot}reports`,
  login: `/${rootPaths.authRoot}/login`,
  signup: `/${rootPaths.authRoot}/sign-up`,
  404: `/${rootPaths.errorRoot}/404`,
};
