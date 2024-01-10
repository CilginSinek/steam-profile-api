import { load } from "cheerio";
import {
  gameInfo,
  badge,
  statusType,
  userInfo,
  basicUserInfo,
  ShowCaseObj,
  ShowCaseComponents,
  UserComponents,
  UserObj,
  CostumeComponent,
  User,
} from "./types";

/**
 * Class representing a Steam user.
 * @author [CilginSinek](https://github.com/CilginSinek)
 * @class steamUser
 * @param {string} res The HTML response from the Steam user profile.
 * @property {Function} setSteamHtml {@link steamUser.setSteamHtml} - Set the 'res' property and initialize the '$'(cheerio load) property.
 * @property {Function} getStatus {@link steamUser.getStatus} - Retrieves the status information. gets status, status game information, and status text
 * @property {Function} getUserInfo {@link steamUser.getUserInfo} - Retrieves the user information from the Steam profile; returns {name, nickname, avatar, country, description, badges, mainBadge, level}.
 * @property {Function} getRecentGames {@link steamUser.getRecentGames} - Retrieves the recent games.returns [{name, appid, iconLink, playtime_forever, last_play, badge}]
 * @property {Function} getFavoriteGame {@link steamUser.getFavoriteGame} - Retrieves the favorite game.
 * @property {Function} getBasicProfile {@link steamUser.getBasicProfile} - Retrieves the basic profile. returns {status, userInfo:{nickname, avatar, level, mainBadge}}
 * @property {Function} getProfile {@link steamUser.getProfile} - Retrieve the user profile without showcase components. returns status, userInfo:{name, nickname, avatar, country, description, badges, mainBadge, level}.
 * @property {Function} getCostumeUser {@link steamUser.getCostumeUser} - Retrieves the costume user.
 */
class steamUser {
  res?: string;
  $: any;
  constructor(res?: string) {
    if (res) {
      this.res = res;
      this.$ = load(this.res);
    }
  }

  /**
   * Set the 'res' property and initialize the '$'(cheerio load) property.
   * @param {string} res - The string to set as the 'steamHtml' property.
   */
  set setSteamHtml(res: string) {
    this.res = res;
    this.$ = load(this.res);
  }

  /**
   * Retrieves the status information. Gets status, game information, and status text
   * @method getStatus
   * @param {string} x - (optional) The string to set as the 'steamHtml' property.(if use without class)
   * @return {statusType} The status information, including the status type, the game information, and the status text.
   */
  getStatus(x?: string): statusType {
    try {
      const $def = () =>{
        if(x){
          if(this !== undefined){
            this.res = x;
            this.$ = load(this.res);
            return this.$;
          }else{
            return load(x);
          }
        }else if (this.$) {
          return this.$;
        } else {
          throw new Error("Steam html not found");
        }
      }
      const $ = $def();


      const statusDiv = $(".responsive_status_info").children();
      const statusText: string = $(".profile_in_game_header").text();

      const typeDef = () => {
        if (statusDiv.attr("class").includes("in-game")) {
          return "In-Game";
        } else if (statusDiv.attr("class").includes("online")) {
          return "Online";
        } else if (statusDiv.attr("class").includes("offline")) {
          return "Offline";
        } else {
          return "Offline";
        }
      };
      const gameDef = () => {
        //* if user is in-game
        if (statusDiv.attr("class").includes("in-game")) {
          //* if user has recent games
          if ($(".recent_games")) {
            //* first child of .recent_games
            const recentGame = $(".recent_games")
              .children()
              .first()
              .children();

            //* class="game_info"
            const staticDiv = recentGame.children().first();

            const name: string = staticDiv
              .children(".game_name")
              .children()
              .text();

            const appid: string = staticDiv
              .children(".game_name")
              .children()
              .attr("href")
              .split("/")
              .at(-1);

            const iconLink: string = staticDiv
              .children()
              .first()
              .children()
              .children()
              .attr("src");

            const details: Array<string> = staticDiv
              .children(".game_info_details")
              .text()
              .trim()
              .split(
                "\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t"
              );

            const playtime_forever: string = details[0];

            const last_play: string = details[1];

            const badgeDef = (): badge | null => {
              const statsDiv = recentGame.children(".game_info_stats");

              //* any badge div is exist
              if (statsDiv) {
                //* if have any badge
                const badgeExist =
                  recentGame
                    .children(".game_info_stats")
                    .children()
                    .first()
                    .children().length == 3;

                if (badgeExist) {
                  //* class="game_info_badge"
                  const badgeDiv = recentGame
                    .children(".game_info_stats")
                    .children()
                    .children()
                    .first()
                    .children()
                    .first();

                  const badgeName: string = badgeDiv
                    .children(".game_info_badge_description")
                    .children()
                    .first()
                    .text();

                  const badgeIconLink: string = badgeDiv
                    .children()
                    .first()
                    .children()
                    .children()
                    .attr("src");

                  const badgeXp: string = badgeDiv
                    .children(".game_info_badge_description")
                    .children(".xp")
                    .text();

                  return {
                    name: badgeName,
                    iconLink: badgeIconLink,
                    xp: badgeXp,
                  };
                } else {
                  return null;
                }
              } else {
                return null;
              }
            };

            const achievemtsDef = () => {
              const statsDiv = recentGame.children(".game_info_stats");

              if (statsDiv) {
                //* get stats first div for check any achievements
                const achievemtsDiv = statsDiv.children().first();

                switch (achievemtsDiv.attr("class")) {
                  case "game_info_achievements_only_ctn":
                    const achievements: string = achievemtsDiv
                      .children(".game_info_achievements")
                      .children(".game_info_achievements_summary_area")
                      .children("span")
                      .children("span")
                      .text()
                      .trim();
                    return achievements;
                  case "game_info_achievements_badge":
                    const achievement: string = achievemtsDiv
                      .children(".game_info_achievements")
                      .children(".game_info_achievements_summary_area")
                      .children("span")
                      .children("span")
                      .text()
                      .trim();
                    return achievement;
                  default:
                    return null;
                }
              } else {
                return null;
              }
            };

            const achievements: string | null = achievemtsDef();

            const badge: badge | null = badgeDef();

            return {
              name: name,
              appid: parseInt(appid),
              iconLink: iconLink,
              playtime_forever: playtime_forever,
              last_play: last_play,
              badge: badge,
              achievements: achievements,
            };
          } else {
            const gameName: string = $(".profile_in_game_name")
              .text()
              .trim();
            return gameName;
          }
        } else {
          return null;
        }
      };

      const statusType: "Online" | "Offline" | "In-Game" = typeDef();
      const statusGame: gameInfo | gameInfo["name"] | null = gameDef();

      return {
        statusType: statusType,
        statusGame: statusGame,
        statusText: statusText,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves the user information from the Steam profile; returns {name, nickname, avatar, country, description, badges, mainBadge, level}.
   * @method getUserInfo
   * @param {string} x - (optional) The string to set as the 'steamHtml' property.(if use without class)
   * @return {userInfo} The user information object.
   */
  getUserInfo(x?: string): userInfo {
    try {
      const $def = () =>{
        if(x){
          if(this !== undefined){
            this.res = x;
            this.$ = load(this.res);
            return this.$;
          }else{
            return load(x);
          }
        }else if (this.$) {
          return this.$;
        } else {
          throw new Error("Steam html not found");
        }
      }
      const $ = $def();

      const name: string = $("bdi").first().text();
      const nickname: string = $(".actual_persona_name").first().text();
      const avatar: string = $(".playerAvatarAutoSizeInner")
        .children()
        .attr("src");
      const countryDef = () => {
        const countryString: string = $(".header_real_name.ellipsis")
          .text()
          .trim()
          .split("\n")[3]
          .split("\t\t\t\t\t\t\t\t\t\t\t\t")[1]
        if (countryString) {
          return countryString;
        } else {
          return null;
        }
      };

      const country: string | null = countryDef();

      const description: string = $(".profile_summary").text().trim();

      const badgesDef = () => {
        const badgeDivs = $(".profile_badges_badge");
        if (badgeDivs.length > 0) {
          const badgeArray: Array<badge["iconLink"]> = [];

          badgeDivs.each(function(_i: any,item: any) {
            const badgeIcon: string = $(this).children().children().attr("src");
            badgeArray.push(badgeIcon);
          });
          return badgeArray;
        } else {
          return null;
        }
      };
      const badges: Array<badge["iconLink"]> | null = badgesDef();

      const mainBadgeDef = () => {
        const badgeDiv = $(".favorite_badge");
        if (badgeDiv) {
          const badgeIcon: string = badgeDiv
            .children()
            .first()
            .children()
            .attr("src");
          const badgeName: string = badgeDiv
            .children(".favorite_badge_description")
            .children()
            .first()
            .text();
          const badgeXp: string = badgeDiv
            .children(".favorite_badge_description")
            .children(".xp")
            .text();

          return {
            name: badgeName,
            iconLink: badgeIcon,
            xp: badgeXp,
          };
        } else {
          return null;
        }
      };

      const mainBadge: badge | null = mainBadgeDef();

      const level: number = parseInt(
        $(".persona_level").children().first().text().trim()
      );

      const userInfo: userInfo = {
        name: name,
        nickname: nickname,
        avatar: avatar,
        country: country,
        description: description,
        badges: badges,
        mainBadge: mainBadge,
        level: level,
      };
      return userInfo;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves the recent games and their information.
   * @method getRecentGames
   * @param {string} x - (optional) The string to set as the 'steamHtml' property.(if use without class)
   * @return {Array<gameInfo> | null} An array of gameInfo objects representing the recent games, or null if no recent games found.
   */
  getRecentGames(x?: string): Array<gameInfo> | null {
    try {
      const $def = () =>{
        if(x){
          if(this !== undefined){
            this.res = x;
            this.$ = load(this.res);
            return this.$;
          }else{
            return load(x);
          }
        }else if (this.$) {
          return this.$;
        } else {
          throw new Error("Steam html not found");
        }
      }
      const $ = $def();

      if ($(".recent_game_content")) {
        const gameArray: Array<gameInfo> = [];

        const gameDivs = $(".recent_game_content");
        gameDivs.each(function(_i:any,item: any){
          const name: string = $(this)
            .children()
            .first()
            .children(".game_name")
            .text()
            .trim();

          const appid: number = parseInt(
            $(this)
              .children()
              .first()
              .children(".game_name")
              .children()
              .attr("href")
              .split("/")
              .at(-1)
          );

          const iconLink: string = $(this)
            .children()
            .first()
            .children()
            .first()
            .children()
            .children()
            .attr("src");

          const details: Array<string> = $(this)
            .children()
            .first()
            .children(".game_info_details")
            .text()
            .trim()
            .split(
              "\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t"
            );

          const playtime_forever: string = details[0];
          const last_play: string = details[1];

          const badgeDef = () => {
            if ($(this).children(".game_info_stats")) {
              const badgeExist =
              $(this).children(".game_info_stats").children().first().attr("class") == "game_info_achievements_badge";
              if (badgeExist) {
                //* class="game_info_badge"
                const badgeDiv = $(this)
                  .children(".game_info_stats")
                  .children()
                  .first()
                  .children()
                  .first()
                  .children();

                const badgeName: string = badgeDiv
                  .children(".game_info_badge_description")
                  .children()
                  .first()
                  .text()
                  .trim();
                const badgeIconLink: string = badgeDiv
                  .children()
                  .first()
                  .children()
                  .children()
                  .attr("src");
                const badgeXp: string = badgeDiv
                  .children(".game_info_badge_description")
                  .children(".xp")
                  .text()
                  .trim();

                const badge: badge = {
                  name: badgeName,
                  iconLink: badgeIconLink,
                  xp: badgeXp,
                };
                return badge;
              } else {
                return null;
              }
            } else {
              return null;
            }
          };

          const achievemtsDef = () => {
            const statsDiv = $(this).children(".game_info_stats");

            if (statsDiv) {
              //* get stats first div for check any achievements
              const achievemtsDiv = statsDiv.children().first();

              switch (achievemtsDiv.attr("class")) {
                case "game_info_achievements_only_ctn":
                  const achievements: string = achievemtsDiv
                    .children(".game_info_achievements")
                    .children(".game_info_achievements_summary_area")
                    .children("span")
                    .children("span")
                    .text()
                    .trim();
                  return achievements;
                case "game_info_achievements_badge":
                  const achievement: string = achievemtsDiv
                    .children(".game_info_achievements")
                    .children(".game_info_achievements_summary_area")
                    .children("span")
                    .children("span")
                    .text()
                    .trim();
                  return achievement;
                default:
                  return null;
              }
            } else {
              return null;
            }
          };

          const achievements: string | null = achievemtsDef();

          const badge: badge | null = badgeDef();

          const gameInfo: gameInfo = {
            name: name,
            appid: appid,
            iconLink: iconLink,
            playtime_forever: playtime_forever,
            last_play: last_play,
            badge: badge,
            achievements: achievements,
          };

          gameArray.push(gameInfo);
        });

        return gameArray;
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves the favorite game information.
   * @method getFavoriteGame
   * @param {string} x - (optional) The string to set as the 'steamHtml' property.(if use without class)
   * @return {gameInfo | null} The favorite game information, or null if no favorite game is found.
   */
  getFavoriteGame(x?: string): gameInfo | null {
    try {
      const $def = () =>{
        if(x){
          if(this !== undefined){
            this.res = x;
            this.$ = load(this.res);
            return this.$;
          }else{
            return load(x);
          }
        }else if (this.$) {
          return this.$;
        } else {
          throw new Error("Steam html not found");
        }
      }
      const $ = $def();

      const gameDiv = $(".favoritegame_showcase");
      if (gameDiv) {
        const name: string = gameDiv
          .children()
          .first()
          .children()
          .first()
          .children(".showcase_item_detail_title")
          .text()
          .trim();

        const appid: number = parseInt(
          gameDiv
            .children()
            .first()
            .children()
            .first()
            .children(".showcase_item_detail_title")
            .children()
            .attr("href")
            .split("/")
            .at(-1)
        );

        const iconLink: string = gameDiv
          .children()
          .first()
          .children()
          .first()
          .children()
          .first()
          .children()
          .children()
          .attr("src");

        const playtime_forever = gameDiv
          .children()
          .first()
          .children(".showcase_stats_row")
          .children()
          .first()
          .text()
          .trim()
          .split("\n\t\t\t\t\t\t\t\t")
          .join(" ");

        const last_play = null;

        const badgeDef = (): badge | null => {
          const badgeDiv = gameDiv
            .children(".game_info_stats")
            .children()
            .first()
            .children(".game_info_badge_border");

          if (badgeDiv) {
            const badgeName: string = badgeDiv
              .children()
              .children(".game_info_badge_description")
              .children(".name")
              .text()
              .trim();

            const badgeIconLink: string = badgeDiv
              .children()
              .first()
              .children()
              .first()
              .children()
              .children()
              .attr("src");

            const badgeXp: string = badgeDiv
            .children()
            .children(".game_info_badge_description")
            .children(".xp")
            .text()
            .trim();

            return {
              name: badgeName,
              iconLink: badgeIconLink,
              xp: badgeXp,
            };
          } else {
            return null;
          }
        };

        const achievemtsDef = () => {
          const statsDiv = $(".favoritegame_showcase").children(
            ".game_info_stats"
          );

          if (statsDiv) {
            //* get stats first div for check any achievements
            const achievemtsDiv = statsDiv.children().first();

            switch (achievemtsDiv.attr("class")) {
              case "game_info_achievements_only_ctn":
                const achievements: string = achievemtsDiv
                  .children(".game_info_achievements")
                  .children(".game_info_achievements_summary_area")
                  .children("span")
                  .children("span")
                  .text()
                  .trim();
                return achievements;
              case "game_info_achievements_badge":
                const achievement: string = achievemtsDiv
                  .children(".game_info_achievements")
                  .children(".game_info_achievements_summary_area")
                  .children("span")
                  .children("span")
                  .text()
                  .trim();
                return achievement;
              default:
                return null;
            }
          } else {
            return null;
          }
        };

        const achievements: string | null = achievemtsDef();

        const badge: badge | null = badgeDef();

        const gameInfo: gameInfo = {
          name: name,
          appid: appid,
          iconLink: iconLink,
          playtime_forever: playtime_forever,
          last_play: last_play,
          badge: badge,
          achievements: achievements,
        };
        return gameInfo;
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get the basic profile object containing the user's status, nickname, avatar, level, and main badge.
   * @method getBasicProfile
   * @param {string} x - (optional) The string to set as the 'steamHtml' property.(if use without class)
   * @return {basicUserInfo} The basic profile object containing the user's status, nickname, avatar, level, and main badge.
   */
  getBasicProfile(x?: string): basicUserInfo {
    try {
      if(!x&&!this){
        throw new Error("Steam html not found");
      }
      const steam = new steamUser(x?x:this.res);
      const status = steam.getStatus();
      const { nickname, avatar, level, mainBadge } = steam.getUserInfo();
      const basicProfile = {
        status,
        userInfo: { nickname, avatar, level, mainBadge },
      };
      return basicProfile;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieve the user profile without showcase components. returns status, userInfo:{name, nickname, avatar, country, description, badges, mainBadge, level}
   * @method getProfile
   * @param {string} x - an optional parameter to specify the profile endpoint
   * @return {User} the user profile object
   */
  getProfile(x?: string): User {
    try {
      if(!x&&!this){
        throw new Error("Steam html not found");
      }
      const steam = new steamUser(x?x:this.res);
      const status = steam.getStatus();
      const userInfo = steam.getUserInfo();
      const recentGames = steam.getRecentGames();
      const profile = {
        status,
        userInfo,
        recentGames,
      };
      return profile;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves user information with optional parameters.
   * @method getCostumeUser
   * @param {string} userSelect - The user select parameter(optional). "-status" or "+userInfo, +recentGames"
   * @param {string} showcaseSelect - The showcase select parameter (optional). "-favoriteGame". max 2 parameters
   * @param {string} x - an optional parameter for specifying the profile endpoint without class method.
   * @return {any} The components object containing ShowCaseComponents and UserComponents.
   */
  getCostumeUser(
    userSelect?: string,
    showcaseSelect?: string,
    x?: string
  ): CostumeComponent {
    try {
      if(!x&&!this){
        throw new Error("Steam html not found");
      }
      const steam = new steamUser(x?x:this.res);
      const funcObj: UserObj = {
        status: () => steam.getStatus(),
        userInfo: () => steam.getUserInfo(),
        recentGames: () => steam.getRecentGames(),
      };
      const showCaseObj: ShowCaseObj = {
        favoriteGame: () => steam.getFavoriteGame(),
      };

      const showcaseDef = (): ShowCaseComponents | null => {
        if (showcaseSelect) {
          const selectArray = showcaseSelect
            .replace(/\+/g, "")
            .split(",")
            .map((item) => item.trim());
          if (selectArray.length > 2) {
            throw new Error("Invalid select option");
          }
          const showCaseComponents: ShowCaseComponents = {};
          selectArray.forEach((item) => {
            if (showCaseObj.hasOwnProperty(item)) {
              showCaseComponents[item] = showCaseObj[item]();
            }
          });
          return showCaseComponents;
        } else {
          return null;
        }
      };

      const userSelectDef = (): UserComponents => {
        if (userSelect) {
          if (userSelect.includes("+") && userSelect.includes("-")) {
            throw new Error("Invalid select option");
          } else {
            if (userSelect.includes("-")) {
              const selectArray = userSelect
                .replace(/\-/g, "")
                .split(",")
                .map((item) => item.trim());
              selectArray.forEach((item) => {
                if (funcObj.hasOwnProperty(item)) {
                  delete funcObj[item];
                }
              });
              const userComponents: UserComponents = {};
              for (let key in funcObj) {
                if (funcObj.hasOwnProperty(key)) {
                  userComponents[key] = funcObj[key]();
                }
              }
              return userComponents;
            } else if (userSelect.includes("+")) {
              const selectArray = userSelect
                .replace(/\+/g, "")
                .split(",")
                .map((item) => item.trim());
              const userComponents: UserComponents = {};
              selectArray.forEach((item) => {
                if (funcObj.hasOwnProperty(item)) {
                  userComponents[item] = funcObj[item]();
                }
              });
              return userComponents;
            } else {
              const userComponents: UserComponents = {};
              for (let key in funcObj) {
                if (funcObj.hasOwnProperty(key)) {
                  userComponents[key] = funcObj[key]();
                }
              }
              return userComponents;
            }
          }
        } else {
          const userComponents: UserComponents = {};
          for (let key in funcObj) {
            if (funcObj.hasOwnProperty(key)) {
              userComponents[key] = funcObj[key]();
            }
          }
          return userComponents;
        }
      };
      const components: CostumeComponent = {
        UserComponents: userSelectDef(),
        ShowCaseComponents: showcaseDef()
      };

      return components;
    } catch (error) {
      throw error;
    }
  }
}

const mySteamUser = new steamUser();
export const {
  getStatus,
  getUserInfo,
  getRecentGames,
  getFavoriteGame,
  getBasicProfile,
  getProfile,
  getCostumeUser,
} = mySteamUser;
export default steamUser;
