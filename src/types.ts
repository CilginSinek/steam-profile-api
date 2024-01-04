interface gameInfo {
  name: string;
  appid: number;
  iconLink: string;
  playtime_forever: string;
  last_play: string | null;
  badge: badge | null;
  achievemts: string | null;
}
interface badge {
  name: string;
  iconLink: string;
  xp: string;
}

interface statusType {
  statusType: "Online" | "Offline" | "In-Game";
  statusGame: gameInfo | gameInfo["name"] | null;
  statusText: string;
}

interface userInfo {
  name: string;
  nickname: string;
  avatar: string;
  country: string | null;
  description: string;
  badges: Array<badge["iconLink"]> | null;
  mainBadge: badge | null;
  level: number;
}
interface basicUserInfo {
  status: statusType;
  userInfo: {
    nickname: userInfo["nickname"];
    avatar: userInfo["avatar"];
    mainBadge: userInfo["mainBadge"];
    level: userInfo["level"];
  };
}
interface ShowCaseObj {
  [key: string]: Function;
}
interface UserObj {
  [key: string]: Function;
}
interface ShowCaseComponents {
  [key: string]: any;
}
interface UserComponents {
  [key: string]: any;
}
interface User {
  status: statusType;
  userInfo: userInfo;
}
interface CostumeComponent {
  UserComponents: UserComponents;
  ShowCaseComponents: ShowCaseComponents | null;
}

export type {
  gameInfo,
  badge,
  statusType,
  userInfo,
  basicUserInfo,
  ShowCaseObj,
  ShowCaseComponents,
  UserObj,
  User,
  UserComponents,
  CostumeComponent,
};
