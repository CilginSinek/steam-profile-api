import { CheerioAPI, load } from "cheerio";
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
  backgroundObj,
} from "../types";
import axios from "axios";

/**
 * Class representing a Steam user.
 * @author [CilginSinek](https://github.com/CilginSinek)
 * @class steamUser
 * @param {string} x HTML or URL or id to the Steam user profile.
 * @property {Function} init {@link steamUserAsync.init} - Initializes the function by fetching the Steam profile HTML based on the provided ID, and sets the 'html' property with the fetched data.
 * @property {Function} setVars {@link steamUserAsync.setVarsAsync} - Set the new variables.
 * @property {Function} getStatus {@link steamUserAsync.getStatusAsync} - Retrieves the status information. gets status, status game information, and status text
 * @property {Function} getUserInfo {@link steamUserAsync.getUserInfoAsync} - Retrieves the user information from the Steam profile; returns {name, nickname, avatar, avatarFrame, country, description, badges, mainBadge, level}.
 * @property {Function} getRecentGames {@link steamUserAsync.getRecentGamesAsync} - Retrieves the recent games.returns [{name, appid, iconLink, playtime_forever, last_play, badge}]
 * @property {Function} getFavoriteGame {@link steamUserAsync.getFavoriteGameAsync} - Retrieves the favorite game.
 * @property {Function} getBasicProfile {@link steamUserAsync.getBasicProfileAsync} - Retrieves the basic profile. returns {status, userInfo:{nickname, avatar, avatarFrame, level, mainBadge}}
 * @property {Function} getMiniProfileId {@link steamUserAsync.getMiniProfileIdAsync} - Retrieves the mini profile id.
 * @property {Function} getProfile {@link steamUserAsync.getProfileAsync} - Retrieve the user profile without showcase components. returns status, userInfo:{name, nickname, avatar, country, description, badges, mainBadge, level}.
 * @property {Function} getCostumeUser {@link steamUserAsync.getCostumeUserAsync} - Retrieves the costume user.
 */
export class steamUserAsync {
  html?: string;
  id?: string | number;
  constructor(x?: string | number) {
    if (x) {
      if (typeof x == "string") {
        if (x.startsWith("https://steamcommunity.com")) {
          if (x.includes("id/")) {
            this.id = x.split("id/")[1];
          } else if (x.includes("profiles/")) {
            this.id = x.split("profiles/")[1];
          } else {
            this.id = x;
          }
        } else {
          this.html = x;
        }
      } else if (typeof x == "number") {
        this.id = x;
      } else {
        throw new Error("number of string expected");
      }
    }
  }

  /**
   * Initializes the function by fetching the Steam profile HTML based on the provided ID,
   * and sets the 'html' property with the fetched data.
   *
   * @return {Promise<void>} A Promise that resolves once the initialization is complete.
   */
  async init(): Promise<void> {
    const url =
      typeof this.id == "string"
        ? `https://steamcommunity.com/id/${this.id}`
        : `https://steamcommunity.com/profiles/${this.id}`;
    const response = await axios.get(url);
    if (response.status != 200) {
      throw new Error("Steam profile not found");
    }
    this.html = response.data;
  }

  /**
   * Sets the variables based on the input. Handles both string and number inputs
   * representing Steam URLs or Steam IDs. Retrieves HTML data using axios based
   * on the input and sets the class variables accordingly.
   *
   * @param {string|number} x - The input representing a Steam URL or Steam ID or Steam HTML
   * @return {Promise<void>} - A promise that resolves with no value
   */
  async setVarsAsync(x: string | number): Promise<void> {
    if (typeof x == "string") {
      if (x.startsWith("https://steamcommunity.com")) {
        if (x.includes("id/")) {
          this.id = x.split("id/")[1];
        } else if (x.includes("profiles/")) {
          this.id = x.split("profiles/")[1];
        } else {
          this.id = x;
        }
        try {
          await this.init();
        } catch (error) {
          throw error;
        }
      } else {
        this.html = x;
      }
    } else {
      this.id = x;
      try {
        await this.init();
      } catch (error) {
        throw error;
      }
    }
  }

  /**
   * Retrieves the status information. Gets status, game information, and status text
   * @method getStatus
   * @param {string} x - (optional) The string to set as the URL or ID or HTML property.(if use without class)
   * @return {statusType} The status information, including the status type, the game information, and the status text.
   */
  async getStatusAsync(x?: string): Promise<statusType> {
    try {
      const $def = async (): Promise<CheerioAPI> => {
        if (x) {
          if (this !== undefined) {
            this.setVarsAsync(x);
            if (this.html) {
              return load(this.html);
            } else {
              throw new Error("Steam profile not found");
            }
          } else {
            if (typeof x == "string") {
              if (x.startsWith("https://steamcommunity.com")) {
                if (x.includes("id/")) {
                  return load(
                    await axios
                      .get(`https://steamcommunity.com/id/${x.split("id/")[1]}`)
                      .then((res) => res.data)
                  );
                } else if (x.includes("profiles/")) {
                  return load(
                    await axios
                      .get(
                        `https://steamcommunity.com/profiles/${
                          x.split("profiles/")[1]
                        }`
                      )
                      .then((res) => res.data)
                  );
                } else {
                  throw new Error("Entered string is not a valid Steam URL");
                }
              } else {
                const response = await axios.get(
                  "https://steamcommunity.com/id/" + x
                );
                if (response.status != 200) {
                  throw new Error("Steam profile not found");
                }
                return load(response.data);
              }
            } else if (typeof x == "number") {
              return load(
                await axios
                  .get(`https://steamcommunity.com/profiles/${x}`)
                  .then((res) => res.data)
              );
            } else {
              throw new Error("Number or String expected");
            }
          }
        } else {
          if (this !== undefined) {
            if (this.html) {
              return load(this.html);
            } else {
              if (!this.id) {
                throw new Error("Set Steam ID or HTML");
              }
              try {
                await this.init();
              } catch (e) {
                throw e;
              }
              if (this.html) {
                return load(this.html);
              } else {
                throw new Error("Steam profile not found");
              }
            }
          } else {
            throw new Error("Set Steam ID or HTML");
          }
        }
      };
      const $ = await $def();

      const statusDiv = $(".responsive_status_info").children();
      const statusText: string = $(".profile_in_game_header").text();

      const typeDef = () => {
        if (statusDiv.attr("class")?.includes("in-game")) {
          return "In-Game";
        } else if (statusDiv.attr("class")?.includes("online")) {
          return "Online";
        } else if (statusDiv.attr("class")?.includes("offline")) {
          return "Offline";
        } else {
          return "Offline";
        }
      };
      const gameDef = (): gameInfo | gameInfo["name"] | null => {
        //* if user is in-game
        if (statusDiv.attr("class")?.includes("in-game")) {
          //* if user has recent games
          if ($(".recent_games")) {
            //* first child of .recent_games
            const recentGame = $(".recent_games").children().first().children();

            //* class="game_info"
            const staticDiv = recentGame.children().first();

            const name: string = staticDiv
              .children(".game_name")
              .children()
              .text();

            const appid: number =
              parseInt(
                staticDiv?.["children"](".game_name")
                  ?.["children"]()
                  ?.["attr"]("href")
                  ?.split("/")
                  .at(-1) ?? "0"
              ) ?? 0;

            const iconLink: string =
              staticDiv.children().first().children().children().attr("src") ??
              "undefined";

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

                  const badgeIconLink: string =
                    badgeDiv
                      .children()
                      .first()
                      .children()
                      .children()
                      .attr("src") ?? "undefined";

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
              appid: appid,
              iconLink: iconLink,
              playtime_forever: playtime_forever,
              last_play: last_play,
              badge: badge,
              achievements: achievements,
            };
          } else {
            const gameName: string = $(".profile_in_game_name").text().trim();
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
   * Retrieves the user information from the Steam profile; returns {name, nickname, avatar, avatarFrame, country, description, badges, mainBadge, level}.
   * @method getUserInfo
   * @param {string} x - (optional) The string to set as the URL or ID or HTML property.(if use without class)
   * @return {userInfo} The user information object.
   */
  async getUserInfoAsync(
    x?: string,
    miniProfileHtml?: string
  ): Promise<userInfo> {
    try {
      const $def = async (): Promise<CheerioAPI> => {
        if (x) {
          if (this !== undefined) {
            this.setVarsAsync(x);
            if (this.html) {
              return load(this.html);
            } else {
              throw new Error("Steam profile not found");
            }
          } else {
            if (typeof x == "string") {
              if (x.startsWith("https://steamcommunity.com")) {
                if (x.includes("id/")) {
                  return load(
                    await axios
                      .get(`https://steamcommunity.com/id/${x.split("id/")[1]}`)
                      .then((res) => res.data)
                  );
                } else if (x.includes("profiles/")) {
                  return load(
                    await axios
                      .get(
                        `https://steamcommunity.com/profiles/${
                          x.split("profiles/")[1]
                        }`
                      )
                      .then((res) => res.data)
                  );
                } else {
                  throw new Error("Entered string is not a valid Steam URL");
                }
              } else {
                const response = await axios.get(
                  "https://steamcommunity.com/id/" + x
                );
                if (response.status != 200) {
                  throw new Error("Steam profile not found");
                }
                return load(response.data);
              }
            } else if (typeof x == "number") {
              return load(
                await axios
                  .get(`https://steamcommunity.com/profiles/${x}`)
                  .then((res) => res.data)
              );
            } else {
              throw new Error("Number or String expected");
            }
          }
        } else {
          if (this !== undefined) {
            if (this.html) {
              return load(this.html);
            } else {
              if (!this.id) {
                throw new Error("Set Steam ID or HTML");
              }
              try {
                await this.init();
              } catch (e) {
                throw e;
              }
              if (this.html) {
                return load(this.html);
              } else {
                throw new Error("Steam profile not found");
              }
            }
          } else {
            throw new Error("Set Steam ID or HTML");
          }
        }
      };
      const $ = await $def();

      if ($(".profile_private_info").length == 1) {
        throw new Error("Steam profile is private");
      }

      const name: string = $("bdi").first().text();
      const nickname: string = $(".actual_persona_name").first().text();
      const avatar: string =
        $(".playerAvatarAutoSizeInner").children("img").attr("src") ??
        "undefined";

      const avatarFrameDef = (): string | null => {
        const avatarFrame = $(".profile_avatar_frame");
        if (avatarFrame.length < 0) {
          return null;
        }
        return avatarFrame.children("img").attr("src") ?? "undefined";
      };

      const avatarFrame: string | null = avatarFrameDef();

      const backgroundDef = async (): Promise<backgroundObj | null> => {
        if (miniProfileHtml) {
          const mini$ = load(miniProfileHtml);
          const background = mini$("miniprofile_nameplatecontainer");
          if (background.length > 0) {
            const backgroundDiv = background.children("video").children();
            const backgroundObj: backgroundObj = {};
            backgroundDiv.each(function (this: any, _i: any, item: any) {
              const name =
                mini$(this).attr("type")?.split("/")[1] ?? "typeless" + _i;
              backgroundObj[name] = mini$(this).attr("src") ?? "undefined";
            });
            return backgroundObj;
          } else {
            return null;
          }
        } else {
          const backgroundId = parseInt(
            $(".playerAvatar").attr("data-miniprofile") ?? "0"
          );
          if (backgroundId) {
            const miniHtml = await axios.get(
              `https://steamcommunity.com/miniprofile/${backgroundId}`
            );
            if (miniHtml.status != 200) {
              throw new Error("Steam Mini Profile not found");
            }
            const mini$ = load(miniHtml.data);
            const background = mini$("miniprofile_nameplatecontainer");
            if (background.length > 0) {
              const backgroundDiv = background.children("video").children();
              const backgroundObj: backgroundObj = {};
              backgroundDiv.each(function (this: any, _i: any, item: any) {
                const name =
                  mini$(this).attr("type")?.split("/")[1] ?? "typeless" + _i;
                backgroundObj[name] = mini$(this).attr("src") ?? "undefined";
              });
              return backgroundObj;
            } else {
              return null;
            }
          } else {
            return null;
          }
        }
      };

      const background = await backgroundDef();

      const countryDef = (): string | null => {
        const nameAndCountry = $(".header_real_name.ellipsis");
        if (nameAndCountry.children().length > 1) {
          if (nameAndCountry.children("bdi").text().trim().length > 0) {
            return nameAndCountry
              .text()
              .trim()
              .split("\n")[3]
              .split("\t\t\t\t\t\t\t\t\t\t\t\t")[1];
          } else {
            return nameAndCountry.text().trim();
          }
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

          badgeDivs.each(function (this: any, _i: any, item: any) {
            const badgeIcon: string =
              $(this).children().children().attr("src") ??
              "undefined element " + _i;
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
          const badgeIcon: string =
            badgeDiv.children().first().children().attr("src") ?? "undefined";
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
        avatarFrame: avatarFrame,
        background: background,
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
   * @param {string} x - (optional) The string to set as the URL or ID or HTML property.(if use without class)
   * @return {Array<gameInfo> | null} An array of gameInfo objects representing the recent games, or null if no recent games found.
   */
  async getRecentGamesAsync(x?: string): Promise<gameInfo[] | null> {
    try {
      const $def = async (): Promise<CheerioAPI> => {
        if (x) {
          if (this !== undefined) {
            this.setVarsAsync(x);
            if (this.html) {
              return load(this.html);
            } else {
              throw new Error("Steam profile not found");
            }
          } else {
            if (typeof x == "string") {
              if (x.startsWith("https://steamcommunity.com")) {
                if (x.includes("id/")) {
                  return load(
                    await axios
                      .get(`https://steamcommunity.com/id/${x.split("id/")[1]}`)
                      .then((res) => res.data)
                  );
                } else if (x.includes("profiles/")) {
                  return load(
                    await axios
                      .get(
                        `https://steamcommunity.com/profiles/${
                          x.split("profiles/")[1]
                        }`
                      )
                      .then((res) => res.data)
                  );
                } else {
                  throw new Error("Entered string is not a valid Steam URL");
                }
              } else {
                const response = await axios.get(
                  "https://steamcommunity.com/id/" + x
                );
                if (response.status != 200) {
                  throw new Error("Steam profile not found");
                }
                return load(response.data);
              }
            } else if (typeof x == "number") {
              return load(
                await axios
                  .get(`https://steamcommunity.com/profiles/${x}`)
                  .then((res) => res.data)
              );
            } else {
              throw new Error("Number or String expected");
            }
          }
        } else {
          if (this !== undefined) {
            if (this.html) {
              return load(this.html);
            } else {
              if (!this.id) {
                throw new Error("Set Steam ID or HTML");
              }
              try {
                await this.init();
              } catch (e) {
                throw e;
              }
              if (this.html) {
                return load(this.html);
              } else {
                throw new Error("Steam profile not found");
              }
            }
          } else {
            throw new Error("Set Steam ID or HTML");
          }
        }
      };
      const $ = await $def();

      if ($(".profile_private_info").length == 1) {
        throw new Error("Steam profile is private");
      }

      if (
        $(".recent_games").length > 0 &&
        $(".recent_games").children().length > 0
      ) {
        const gameArray: Array<gameInfo> = [];

        const gameDivs = $(".recent_game_content");
        gameDivs.each(function (this: any, _i: any, item: any) {
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
              ?.split("/")
              .at(-1) ?? "0"
          );

          const iconLink: string =
            $(this)
              .children()
              .first()
              .children()
              .first()
              .children()
              .children()
              .attr("src") ?? "undefined";

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
                $(this)
                  .children(".game_info_stats")
                  .children()
                  .first()
                  .attr("class") == "game_info_achievements_badge";
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
                const badgeIconLink: string =
                  badgeDiv
                    .children()
                    .first()
                    .children()
                    .children()
                    .attr("src") ?? "undefined";
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
   * @param {string} x - (optional) The string to set as the URL or ID or HTML property.(if use without class)
   * @return {gameInfo | null} The favorite game information, or null if no favorite game is found.
   */
  async getFavoriteGameAsync(x?: string): Promise<gameInfo | null> {
    try {
      const $def = async (): Promise<CheerioAPI> => {
        if (x) {
          if (this !== undefined) {
            this.setVarsAsync(x);
            if (this.html) {
              return load(this.html);
            } else {
              throw new Error("Steam profile not found");
            }
          } else {
            if (typeof x == "string") {
              if (x.startsWith("https://steamcommunity.com")) {
                if (x.includes("id/")) {
                  return load(
                    await axios
                      .get(`https://steamcommunity.com/id/${x.split("id/")[1]}`)
                      .then((res) => res.data)
                  );
                } else if (x.includes("profiles/")) {
                  return load(
                    await axios
                      .get(
                        `https://steamcommunity.com/profiles/${
                          x.split("profiles/")[1]
                        }`
                      )
                      .then((res) => res.data)
                  );
                } else {
                  throw new Error("Entered string is not a valid Steam URL");
                }
              } else {
                const response = await axios.get(
                  "https://steamcommunity.com/id/" + x
                );
                if (response.status != 200) {
                  throw new Error("Steam profile not found");
                }
                return load(response.data);
              }
            } else if (typeof x == "number") {
              return load(
                await axios
                  .get(`https://steamcommunity.com/profiles/${x}`)
                  .then((res) => res.data)
              );
            } else {
              throw new Error("Number or String expected");
            }
          }
        } else {
          if (this !== undefined) {
            if (this.html) {
              return load(this.html);
            } else {
              if (!this.id) {
                throw new Error("Set Steam ID or HTML");
              }
              try {
                await this.init();
              } catch (e) {
                throw e;
              }
              if (this.html) {
                return load(this.html);
              } else {
                throw new Error("Steam profile not found");
              }
            }
          } else {
            throw new Error("Set Steam ID or HTML");
          }
        }
      };
      const $ = await $def();

      if ($(".profile_private_info").length == 1) {
        throw new Error("Steam profile is private");
      }

      const gameDiv = $(".favoritegame_showcase");
      if (gameDiv.length > 0) {
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
            ?.split("/")
            .at(-1) ?? "0"
        );

        const iconLink: string =
          gameDiv
            .children()
            .first()
            .children()
            .first()
            .children()
            .first()
            .children()
            .children()
            .attr("src") ?? "undefined";

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

            const badgeIconLink: string =
              badgeDiv
                .children()
                .first()
                .children()
                .first()
                .children()
                .children()
                .attr("src") ?? "undefined";

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
   * Get the basic profile object containing the user's status, nickname, avatar,avatarFrame, level, and main badge.
   * @method getBasicProfile
   * @param {string} x - (optional) The string to set as the URL or ID or HTML property.(if use without class)
   * @return {basicUserInfo} The basic profile object containing the user's status, nickname, avatar, level, and main badge.
   */
  async getBasicProfileAsync(x?: string): Promise<basicUserInfo> {
    try {
      if (!x && !this) {
        throw new Error("Steam html not found");
      }
      const steam = new steamUserAsync(x ? x : this.html ? this.html : this.id);
      await steam.init();
      const status = await steam.getStatusAsync();
      const { nickname, avatar, avatarFrame, level, mainBadge, background } =
        await steam.getUserInfoAsync();
      const basicProfile = {
        status,
        userInfo: {
          nickname,
          avatar,
          avatarFrame,
          level,
          mainBadge,
          background,
        },
      };
      return basicProfile;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Asynchronously gets the mini profile ID.
   *
   * @param {string} x - (optional) The string to set as the URL or ID or HTML property.(if use without class)
   * @return {Promise<number>} a Promise that resolves to the mini profile ID
   */
  async getMiniProfileIdAsync (x?: string): Promise<number> {
    try {
      const $def = async (): Promise<CheerioAPI> => {
        if (x) {
          if (this !== undefined) {
            this.setVarsAsync(x);
            if (this.html) {
              return load(this.html);
            } else {
              throw new Error("Steam profile not found");
            }
          } else {
            if (typeof x == "string") {
              if (x.startsWith("https://steamcommunity.com")) {
                if (x.includes("id/")) {
                  return load(
                    await axios
                      .get(`https://steamcommunity.com/id/${x.split("id/")[1]}`)
                      .then((res) => res.data)
                  );
                } else if (x.includes("profiles/")) {
                  return load(
                    await axios
                      .get(
                        `https://steamcommunity.com/profiles/${
                          x.split("profiles/")[1]
                        }`
                      )
                      .then((res) => res.data)
                  );
                } else {
                  throw new Error("Entered string is not a valid Steam URL");
                }
              } else {
                const response = await axios.get(
                  "https://steamcommunity.com/id/" + x
                );
                if (response.status != 200) {
                  throw new Error("Steam profile not found");
                }
                return load(response.data);
              }
            } else if (typeof x == "number") {
              return load(
                await axios
                  .get(`https://steamcommunity.com/profiles/${x}`)
                  .then((res) => res.data)
              );
            } else {
              throw new Error("Number or String expected");
            }
          }
        } else {
          if (this !== undefined) {
            if (this.html) {
              return load(this.html);
            } else {
              if (!this.id) {
                throw new Error("Set Steam ID or HTML");
              }
              try {
                await this.init();
              } catch (e) {
                throw e;
              }
              if (this.html) {
                return load(this.html);
              } else {
                throw new Error("Steam profile not found");
              }
            }
          } else {
            throw new Error("Set Steam ID or HTML");
          }
        }
      };
      const $ = await $def();

      const miniProfileId = parseInt(
        $(".playerAvatar").attr("data-miniprofile")??"0"
      );
      return miniProfileId;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieve the user profile without showcase components. returns status, userInfo:{name, nickname, avatar, country, description, badges, mainBadge, level}
   * @method getProfile
   * @param {string} x - (optional) The string to set as the URL or ID or HTML property.(if use without class)
   * @return {User} the user profile object
   */
  async getProfileAsync(x?: string): Promise<User> {
    try {
      if (!x && !this) {
        throw new Error("Steam html not found");
      }
      const steam = new steamUserAsync(x ? x : this.html ? this.html : this.id);
      await steam.init();
      const status = await steam.getStatusAsync();
      const userInfo = await steam.getUserInfoAsync();
      const recentGames = await steam.getRecentGamesAsync();
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
   * @param {string} x - (optional) The string to set as the URL or ID or HTML property.(if use without class)
   * @return {any} The components object containing ShowCaseComponents and UserComponents.
   */
  async getCostumeUserAsync(
    userSelect?: string,
    showcaseSelect?: string,
    x?: string
  ): Promise<CostumeComponent> {
    try {
      if (!x && !this) {
        throw new Error("Steam html not found");
      }
      const steam = new steamUserAsync(x ? x : this.html ? this.html : this.id);
      await steam.init();
      const funcObj: UserObj = {
        status: async () => await steam.getStatusAsync(),
        userInfo: async () => await steam.getUserInfoAsync(),
        recentGames: async () => await steam.getRecentGamesAsync(),
      };
      const showCaseObj: ShowCaseObj = {
        favoriteGame: async () => await steam.getFavoriteGameAsync(),
      };

      const showcaseDef = async (): Promise<ShowCaseComponents | null> => {
        if (showcaseSelect) {
          const selectArray = showcaseSelect
            .replace(/\+/g, "")
            .split(",")
            .map((item) => item.trim());
          if (selectArray.length > 2) {
            throw new Error("Invalid select option");
          }
          const showCaseComponents: ShowCaseComponents = {};
          selectArray.forEach(async (item) => {
            if (showCaseObj.hasOwnProperty(item)) {
              showCaseComponents[item] = await showCaseObj[item]();
            }
          });
          return showCaseComponents;
        } else {
          return null;
        }
      };

      const userSelectDef = async (): Promise<UserComponents> => {
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
                  userComponents[key] = await funcObj[key]();
                }
              }
              return userComponents;
            } else if (userSelect.includes("+")) {
              const selectArray = userSelect
                .replace(/\+/g, "")
                .split(",")
                .map((item) => item.trim());
              const userComponents: UserComponents = {};
              selectArray.forEach(async (item) => {
                if (funcObj.hasOwnProperty(item)) {
                  userComponents[item] = await funcObj[item]();
                }
              });
              return userComponents;
            } else {
              const userComponents: UserComponents = {};
              for (let key in funcObj) {
                if (funcObj.hasOwnProperty(key)) {
                  userComponents[key] = await funcObj[key]();
                }
              }
              return userComponents;
            }
          }
        } else {
          const userComponents: UserComponents = {};
          for (let key in funcObj) {
            if (funcObj.hasOwnProperty(key)) {
              userComponents[key] = await funcObj[key]();
            }
          }
          return userComponents;
        }
      };
      const components: CostumeComponent = {
        UserComponents: userSelectDef(),
        ShowCaseComponents: showcaseDef(),
      };

      return components;
    } catch (error) {
      throw error;
    }
  }
}

const mySteamUser = new steamUserAsync();
export const {
  getStatusAsync,
  getUserInfoAsync,
  getRecentGamesAsync,
  getFavoriteGameAsync,
  getBasicProfileAsync,
  getProfileAsync,
  getCostumeUserAsync,
} = mySteamUser;
