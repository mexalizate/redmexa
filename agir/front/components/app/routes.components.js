import { lazy } from "./utils";

const Routes = {
  HomePage: lazy(() =>
    import(
      /* webpackChunkName: "r-homepage" */ "@agir/front/app/Homepage/Home"
    ),
  ),
  AgendaPage: lazy(() =>
    import(
      /* webpackChunkName: "r-agendapage" */ "@agir/events/agendaPage/Agenda"
    ),
  ),
  EventMap: lazy(() =>
    import(
      /* webpackChunkName: "r-eventmap" */ "@agir/carte/page__eventMap/EventMap"
    ),
  ),
  EventPage: lazy(() =>
    import(
      /* webpackChunkName: "r-eventpage" */ "@agir/events/eventPage/EventPage"
    ),
  ),
  CreateEvent: lazy(() =>
    import(
      /* webpackChunkName: "r-createevent" */ "@agir/events/createEventPage/CreateEvent"
    ),
  ),
  GroupsPage: lazy(() =>
    import(
      /* webpackChunkName: "r-groupspage" */ "@agir/groups/groupsPage/GroupsPage"
    ),
  ),
  FullGroupPage: lazy(() =>
    import(
      /* webpackChunkName: "r-fullgrouppage" */ "@agir/groups/fullGroupPage/FullGroupPage"
    ),
  ),
  GroupPage: lazy(() =>
    import(
      /* webpackChunkName: "r-grouppage" */ "@agir/groups/groupPage/GroupPage"
    ),
  ),
  GroupMessagePage: lazy(() =>
    import(
      /* webpackChunkName: "r-groupmessagepage" */ "@agir/groups/groupPage/GroupMessagePage"
    ),
  ),
  GroupMap: lazy(() =>
    import(
      /* webpackChunkName: "r-groupmap" */ "@agir/carte/page__groupMap/GroupMap"
    ),
  ),
  ActivityPage: lazy(() =>
    import(
      /* webpackChunkName: "r-activitypage" */ "@agir/activity/ActivityPage/ActivityPage"
    ),
  ),
  NavigationPage: lazy(() =>
    import(
      /* webpackChunkName: "r-navigationpage" */ "@agir/front/navigationPage/NavigationPage"
    ),
  ),
  SignupPage: lazy(() =>
    import(
      /* webpackChunkName: "r-signuppage" */ "@agir/front/authentication/Connexion/SignupPage"
    ),
  ),
  LoginPage: lazy(() =>
    import(
      /* webpackChunkName: "r-loginpage" */ "@agir/front/authentication/Connexion/LoginPage"
    ),
  ),
  CodeLoginPage: lazy(() =>
    import(
      /* webpackChunkName: "r-codeloginpage" */ "@agir/front/authentication/Connexion/Code/CodeLogin"
    ),
  ),
  CodeSignupPage: lazy(() =>
    import(
      /* webpackChunkName: "r-codesignuppage" */ "@agir/front/authentication/Connexion/Code/CodeSignup"
    ),
  ),
  TellMorePage: lazy(() =>
    import(
      /* webpackChunkName: "r-tellmorepage" */ "@agir/front/authentication/Connexion/TellMore/TellMorePage"
    ),
  ),
  LogoutPage: lazy(() =>
    import(
      /* webpackChunkName: "r-logoutpage" */ "@agir/front/authentication/Connexion/Logout"
    ),
  ),
  MessagePage: lazy(() =>
    import(
      /* webpackChunkName: "r-messagepage" */ "@agir/msgs/MessagePage/MessagePage"
    ),
  ),
  CreateContactPage: lazy(() =>
    import(
      /* webpackChunkName: "r-createcontactpage" */ "@agir/people/contacts/CreateContactPage"
    ),
  ),
  ActionToolsPage: lazy(() =>
    import(
      /* webpackChunkName: "r-actiontoolspage" */ "@agir/front/ActionToolsPage/ActionToolsPage"
    ),
  ),
  SearchPage: lazy(() =>
    import(
      /* webpackChunkName: "r-searchpage" */ "@agir/front/SearchPage/SearchPage"
    ),
  ),
  SearchGroupPage: lazy(() =>
    import(
      /* webpackChunkName: "r-searchgrouppage" */ "@agir/front/SearchPage/SearchGroupPage"
    ),
  ),
  SearchEventPage: lazy(() =>
    import(
      /* webpackChunkName: "r-searcheventpage" */ "@agir/front/SearchPage/SearchEventPage"
    ),
  ),
  TestErrorPage: lazy(() =>
    import(
      /* webpackChunkName: "r-testerrorpage" */ "@agir/front/errorPage/TestErrorPage"
    ),
  ),
  FaIcons: lazy(() =>
    import(
      /* webpackChunkName: "r-faicons" */ "@agir/front/genericComponents/FaIcons"
    ),
  ),
};

export default Routes;
