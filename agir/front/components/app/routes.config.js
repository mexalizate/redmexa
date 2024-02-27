import _ from "gettext";
import pathToRegexp from "path-to-regexp-es";
import style from "@agir/front/genericComponents/_variables.scss";
import logger from "@agir/lib/utils/logger";

import { AUTHENTICATION } from "@agir/front/authentication/common";
import { relativeToAbsoluteURL } from "@agir/lib/utils/url";
import externalRoutes from "@agir/front/globalContext/nonReactRoutes.config";

import RouteComponents from "./routes.components";
export const BASE_PATH = "/";

const log = logger(__filename);

export class RouteConfig {
  constructor(props) {
    Object.keys(props).forEach((key) => (this[key] = props[key]));

    this.__keys__ = [];
    const path = Array.isArray(this.path) ? this.path[0] : this.path;
    this.__re__ = pathToRegexp(this.path, this.__keys__, {
      end: this.exact === false ? false : true,
    });
    this.__toPath__ = pathToRegexp.compile(path);

    this.match = this.match.bind(this);
    this.getLink = this.getLink.bind(this);
  }

  /**
   * Method to match a pathname string against the RouteConfig path
   * @param  {string} pathname The pathname to match against the RouteConfig path
   * @return {boolean} True if the argument path matches, false otherwise
   */
  match(pathname) {
    return !!pathname && !!this.__re__.exec(pathname);
  }

  /**
   * Method to build a link to the RouteConfig pathname with optional URL parameters
   * @param  {object} params An object mapping the path parameters value
   * @param  {absolute} absolute Whether to return an absolute or relative link
   * @return {string} The link path string
   */
  getLink(params, absolute = false) {
    try {
      params = {
        ...(this.params || {}),
        ...(params || {}),
      };
      const link = this.__toPath__(params);
      return absolute ? relativeToAbsoluteURL(link) : link;
    } catch (e) {
      log.error("Failed to generate path", e);
      return Array.isArray(this.path) ? this.path[0] : this.path;
    }
  }
}

const notificationSettingRoute = new RouteConfig({
  id: "notificationSettings",
  path: "/:root*/parametres/",
  exact: true,
  neededAuthentication: AUTHENTICATION.HARD,
  label: _("Paramètres de notification"),
  params: { root: "activite" },
  isPartial: true,
});

export const routeConfig = {
  events: new RouteConfig({
    id: "events",
    path: "/",
    exact: true,
    neededAuthentication: AUTHENTICATION.SOFT,
    label: "Lista de Eventos",
    Component: RouteComponents.AgendaPage,
    hasLayout: true,
    layoutProps: {
      $smallBackgroundColor: style.black25,
    },
    hideFeedbackButton: true,
    keepScroll: true,
    hideFooterBanner: true,
    AnonymousComponent: RouteComponents.HomePage,
    anonymousConfig: {
      hasLayout: false,
    },
  }),
  eventMap: new RouteConfig({
    id: "eventMap",
    path: "/evenements/carte/",
    exact: true,
    neededAuthentication: AUTHENTICATION.NONE,
    label: "Mapa de Eventos",
    Component: RouteComponents.EventMap,
    hideFooter: true,
    hideFeedbackButton: true,
  }),
  mapEventDetails: new RouteConfig({
    id: "mapEventDetails",
    path: "/evenements/carte/:eventPk/",
    exact: true,
    neededAuthentication: AUTHENTICATION.NONE,
    label: "Mapa de Eventos",
    redirectTo: (_, routeParams) => ({
      route: "eventDetails",
      routeParams,
      backLink: "eventMap",
      push: false,
    }),
  }),
  createEvent: new RouteConfig({
    id: "createEvent",
    path: "/evenements/creer/",
    exact: false,
    neededAuthentication: AUTHENTICATION.SOFT,
    label: "Nuevo Evento",
    hideFeedbackButton: true,
    Component: RouteComponents.CreateEvent,
    hideFooter: true,
  }),
  eventDetails: new RouteConfig({
    id: "eventDetails",
    path: "/evenements/:eventPk/",
    exact: true,
    neededAuthentication: AUTHENTICATION.NONE,
    label: "Página del Evento",
    Component: RouteComponents.EventPage,
  }),
  eventSettings: new RouteConfig({
    id: "eventSettings",
    path: "/evenements/:eventPk/gestion/:activePanel?/",
    params: { activePanel: null },
    exact: true,
    neededAuthentication: AUTHENTICATION.HARD,
    Component: RouteComponents.EventPage,
    hideFeedbackButton: true,
  }),
  groups: new RouteConfig({
    id: "groups",
    path: "/mes-groupes/",
    exact: true,
    neededAuthentication: AUTHENTICATION.SOFT,
    label: "Lista de Grupos",
    Component: RouteComponents.GroupsPage,
    hasLayout: true,
    layoutProps: {
      $smallBackgroundColor: style.black25,
    },
    keepScroll: true,
  }),
  groupMap: new RouteConfig({
    id: "groupMap",
    path: "/groupes/carte/",
    exact: true,
    neededAuthentication: AUTHENTICATION.NONE,
    label: _("Carte des groupes"),
    Component: RouteComponents.GroupMap,
    hideFooter: true,
    hideFeedbackButton: true,
  }),
  mapGroupDetails: new RouteConfig({
    id: "mapGroupDetails",
    path: "/groupes/carte/:groupPk/",
    exact: true,
    neededAuthentication: AUTHENTICATION.NONE,
    redirectTo: (_, routeParams) => ({
      route: "groupDetails",
      routeParams,
      backLink: "groupMap",
      push: false,
    }),
  }),
  fullGroup: new RouteConfig({
    id: "fullGroup",
    path: "/groupes/:groupPk/complet/",
    exact: true,
    neededAuthentication: AUTHENTICATION.NONE,
    label: _("Groupe complet"),
    Component: RouteComponents.FullGroupPage,
    hasLayout: false,
  }),
  groupSettings: new RouteConfig({
    id: "groupSettings",
    path: "/groupes/:groupPk/:activeTab?/gestion/:activePanel?/",
    params: { activeTab: null, activePanel: null },
    exact: true,
    neededAuthentication: AUTHENTICATION.HARD,
    Component: RouteComponents.GroupPage,
    isPartial: true,
  }),
  groupMessage: new RouteConfig({
    id: "groupMessage",
    path: "/groupes/:groupPk/message/:messagePk/",
    exact: true,
    neededAuthentication: AUTHENTICATION.SOFT,
    label: _("Message du groupe"),
    Component: RouteComponents.GroupMessagePage,
    hideFeedbackButton: true,
  }),
  redirectToCreateGroup: new RouteConfig({
    id: "redirectToCreateGroup",
    path: "/groupes/creer/",
    exact: true,
    neededAuthentication: AUTHENTICATION.SOFT,
    redirectTo: {
      href: externalRoutes.createGroup,
    },
  }),
  groupDetails: new RouteConfig({
    id: "groupDetails",
    path: "/groupes/:groupPk/:activeTab?/",
    exact: false,
    neededAuthentication: AUTHENTICATION.NONE,
    label: "Página del grupo",
    Component: RouteComponents.GroupPage,
    backLink: {
      route: "groups",
      isProtected: true,
    },
  }),
  activities: new RouteConfig({
    id: "activities",
    path: ["/activite/", "/activite/parametres/"],
    exact: true,
    neededAuthentication: AUTHENTICATION.SOFT,
    label: _("Notifications"),
    Component: RouteComponents.ActivityPage,
    hasLayout: true,
    layoutProps: {
      $smallBackgroundColor: style.black25,
    },
    topBarRightLink: {
      label: notificationSettingRoute.label,
      to: notificationSettingRoute.getLink({ root: "activite" }),
      protected: true,
    },
    keepScroll: true,
  }),
  actionTools: new RouteConfig({
    id: "actionTools",
    path: "/agir/",
    exact: true,
    neededAuthentication: AUTHENTICATION.SOFT,
    label: "REGRESAR AL INICIO",
    Component: RouteComponents.ActionToolsPage,
    hasLayout: false,
    hideFeedbackButton: true,
  }),
  notificationSettings: notificationSettingRoute,
  menu: new RouteConfig({
    id: "menu",
    path: "/navigation/",
    exact: true,
    neededAuthentication: AUTHENTICATION.SOFT,
    label: _("Menu"),
    Component: RouteComponents.NavigationPage,
    hasLayout: true,
    displayFooterOnMobileApp: true,
    layoutProps: {
      style: { paddingBottom: 0 },
    },
  }),
  login: new RouteConfig({
    id: "login",
    path: "/connexion/",
    exact: true,
    neededAuthentication: AUTHENTICATION.NONE,
    label: _("Connexion"),
    description: "Claudialízate", //_("Connectez-vous à Action Populaire"),
    Component: RouteComponents.LoginPage,
    hideTopBar: true,
    hideFeedbackButton: true,
    hideFooter: true,
  }),
  signup: new RouteConfig({
    id: "signup",
    path: "/inscription/",
    exact: true,
    neededAuthentication: AUTHENTICATION.NONE,
    label: "Registro",
    description: "Registrate a Claudialízate",
    Component: RouteComponents.SignupPage,
    hideTopBar: true,
    hideFeedbackButton: true,
    hideFooter: true,
  }),
  codeLogin: new RouteConfig({
    id: "codeLogin",
    path: "/connexion/code/",
    exact: true,
    neededAuthentication: AUTHENTICATION.NONE,
    label: "Conexión",
    description: "Ingresa a Claudialízate",
    Component: RouteComponents.CodeLoginPage,
    hideTopBar: true,
    hideFeedbackButton: true,
    hideFooter: true,
  }),
  codeSignup: new RouteConfig({
    id: "codeSignup",
    path: "/inscription/code/",
    exact: true,
    neededAuthentication: AUTHENTICATION.NONE,
    label: _("Inscription"),
    description: "Rejoignez Claudialízate",
    Component: RouteComponents.CodeSignupPage,
    hideTopBar: true,
    hideFeedbackButton: true,
    hideFooter: true,
  }),
  tellMore: new RouteConfig({
    id: "tellMore",
    path: "/bienvenue/",
    exact: true,
    neededAuthentication: AUTHENTICATION.NONE,
    label: _("J'en dis plus"),
    Component: RouteComponents.TellMorePage,
    hideTopBar: true,
    hideFeedbackButton: true,
    hidePushModal: true,
    hideFooter: true,
  }),
  logout: new RouteConfig({
    id: "logout",
    path: "/deconnexion/",
    exact: true,
    neededAuthentication: AUTHENTICATION.NONE,
    label: "Cerrar Sesión",
    Component: RouteComponents.LogoutPage,
  }),
  messages: new RouteConfig({
    id: "messages",
    path: ["/messages/:messagePk?/", "/messages/:messagePk/parametres/"],
    params: { messagePk: null },
    exact: true,
    neededAuthentication: AUTHENTICATION.HARD,
    label: _("Mensajes"),
    Component: RouteComponents.MessagePage,
    hasLayout: false,
    hideFeedbackButton: true,
    hideFooter: true,
    topBarRightLink: {
      messageSettings: true,
    },
  }),
  createContact: new RouteConfig({
    id: "createContact",
    path: "/contacts/creer/:step?/",
    params: { step: null },
    exact: true,
    neededAuthentication: AUTHENTICATION.SOFT,
    label: _("Nouveau contact"),
    Component: RouteComponents.CreateContactPage,
    hasLayout: false,
    hideFeedbackButton: true,
    hideFooter: true,
  }),
  search: new RouteConfig({
    id: "search",
    path: "/recherche/",
    exact: true,
    neededAuthentication: AUTHENTICATION.NONE,
    Component: RouteComponents.SearchPage,
    label: "Buscar",
    hasLayout: false,
    hideFeedbackButton: true,
  }),
  searchGroup: new RouteConfig({
    id: "searchGroup",
    path: "/recherche/groupes/",
    neededAuthentication: AUTHENTICATION.NONE,
    Component: RouteComponents.SearchGroupPage,
    label: _("Buscar un grupo"),
    hasLayout: false,
    hideFeedbackButton: true,
  }),
  searchEvent: new RouteConfig({
    id: "searchEvent",
    path: "/recherche/evenements/",
    neededAuthentication: AUTHENTICATION.NONE,
    Component: RouteComponents.SearchEventPage,
    label: _("Buscar una acción"),
    hasLayout: false,
    hideFeedbackButton: true,
  }),
  testErrorPage: new RouteConfig({
    id: "testErrorPage",
    path: "/500/",
    neededAuthentication: AUTHENTICATION.NONE,
    Component: RouteComponents.TestErrorPage,
    label: _("Une erreur est survenue"),
    hideFeedbackButton: true,
    hideFooter: true,
  }),
  faIcons: new RouteConfig({
    id: "faIcons",
    path: "/test/fontawesome/",
    exact: true,
    neededAuthentication: AUTHENTICATION.NONE,
    label: _("Icônes Font Awesome"),
    Component: RouteComponents.FaIcons,
    hideFeedbackButton: true,
  }),
};

export const getRouteByPathname = (pathname) => {
  return Object.values(routeConfig).find(
    (route) => route.path === pathname || route.match(pathname),
  );
};

const routes = Object.values(routeConfig).filter((route) => !route.isPartial);

export default routes;
