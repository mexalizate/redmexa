import { getGenderedWord } from "@agir/lib/utils/display";

export const MEMBERSHIP_TYPES = {
  FOLLOWER: 5,
  MEMBER: 10,
  MANAGER: 50,
  REFERENT: 100,
};

export const MEMBERSHIP_TYPE_ICON = {
  [MEMBERSHIP_TYPES.FOLLOWER]: "rss",
  [MEMBERSHIP_TYPES.MEMBER]: "user",
  [MEMBERSHIP_TYPES.MANAGER]: "settings",
  [MEMBERSHIP_TYPES.REFERENT]: "lock",
};

export const MEMBERSHIP_TYPE_LABEL = {
  [MEMBERSHIP_TYPES.FOLLOWER]: "Seguidor(a) del grupo",
  [MEMBERSHIP_TYPES.MEMBER]: "Miembro activo",
  [MEMBERSHIP_TYPES.MANAGER]: "Gestor(a)",
  [MEMBERSHIP_TYPES.REFERENT]: ["Facilitador(a)", "Facilitadora", "Facilitador"],
};

export const getGenderedMembershipType = (membershipType, gender) => {
  const label = MEMBERSHIP_TYPE_LABEL[String(membershipType)];
  if (!label) {
    return "";
  }
  if (Array.isArray(label)) {
    return getGenderedWord(gender, ...label);
  }
  return label;
};
