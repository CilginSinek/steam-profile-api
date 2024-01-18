import { test, expect, describe } from "@jest/globals";
import axios from "axios";
import {
  getBasicProfile,
  getCostumeUser,
  getFavoriteGame,
  getProfile,
  getRecentGames,
  getUserInfo,
  getStatus,
} from "../../src";
import testJson from "../testJson";

describe("Steam API tests", () => {
  test("Steam API availability", async () => {
    const response = await axios.get(
      "https://steamcommunity.com/id/CilginSinek"
    );
    expect(response.status).toBe(200);
    if (response.status === 200) {
      const status = getStatus(response.data);
      const userInfo = getUserInfo(response.data);
      const recentGames = getRecentGames(response.data);
      const favoriteGame = getFavoriteGame(response.data);
      const basicProfile = getBasicProfile(response.data);
      const profile = getProfile(response.data);
      const costumeProfilePlus = getCostumeUser(
        "-userInfo, -recentGames",
        "favoriteGame",
        response.data
      );
      const costumeProfile = getCostumeUser(
        "+status",
        "favoriteGame",
        response.data
      );

      expect(status).not.toBeUndefined();
      expect(status).toStrictEqual(testJson.User.status);
      expect(status).toMatchObject(testJson.User.status);
      expect(JSON.stringify(status)).toEqual(
        JSON.stringify(testJson.User.status)
      );

      expect(userInfo).not.toBeUndefined();
      expect(userInfo).toStrictEqual(testJson.userInfo);
      expect(userInfo).toMatchObject(testJson.userInfo);
      expect(JSON.stringify(userInfo)).toEqual(
        JSON.stringify(testJson.userInfo)
      );

      // expect(recentGames).not.toBeNull();
      // expect(recentGames).toStrictEqual(testJson.User.recentGames);
      // expect(recentGames).toMatchObject(testJson.User.recentGames);
      // expect(JSON.stringify(recentGames)).toEqual(
      //   JSON.stringify(testJson.User.recentGames)
      // );

      expect(favoriteGame).not.toBeNull();
      expect(favoriteGame).toStrictEqual(
        testJson.CostumeComponent.ShowCaseComponents.favoriteGame
      );
      expect(favoriteGame).toMatchObject(
        testJson.CostumeComponent.ShowCaseComponents.favoriteGame
      );
      expect(JSON.stringify(favoriteGame)).toEqual(
        JSON.stringify(
          testJson.CostumeComponent.ShowCaseComponents.favoriteGame
        )
      );

      expect(basicProfile).not.toBeNull();
      expect(basicProfile).toStrictEqual(testJson.basicProfile);
      expect(basicProfile).toMatchObject(testJson.basicProfile);
      expect(JSON.stringify(basicProfile)).toEqual(
        JSON.stringify(testJson.basicProfile)
      );

      expect(profile).not.toBeNull();
      expect(profile).toStrictEqual(testJson.User);
      expect(profile).toMatchObject(testJson.User);
      expect(JSON.stringify(profile)).toEqual(JSON.stringify(testJson.User));

      expect(costumeProfilePlus).not.toBeNull();
      expect(costumeProfilePlus).toStrictEqual(testJson.CostumeComponent);
      expect(costumeProfilePlus).toMatchObject(testJson.CostumeComponent);
      expect(JSON.stringify(costumeProfilePlus)).toEqual(
        JSON.stringify(testJson.CostumeComponent)
      );

      expect(costumeProfile).not.toBeNull();
      expect(costumeProfile).toStrictEqual(testJson.CostumeComponent);
      expect(costumeProfile).toMatchObject(testJson.CostumeComponent);
      expect(JSON.stringify(costumeProfile)).toEqual(
        JSON.stringify(testJson.CostumeComponent)
      );

      expect(costumeProfile).toStrictEqual(costumeProfilePlus);
      expect(JSON.stringify(costumeProfile)).toEqual(
        JSON.stringify(costumeProfilePlus)
      );
    } else {
      throw new Error("Data not found");
    }
  });
});
