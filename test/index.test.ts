import { test, expect, describe } from "@jest/globals";
import axios from "axios";
import steamUser from "../src";

const testJson = {
  userInfo:{
    name:"A",
    nickname:"Azgın Sinek",
    avatar:"https://avatars.akamai.steamstatic.com/a691782e9df50a0a5052ba0edb8df5b1789906a0_full.jpg",
    country:"Istanbul, Istanbul, Turkey",
    description:"aq adası  You go down just like Holy MaryMary on a, Mary on a crossYour beauty never ever scared meMary on a, Mary on a cross    Lisansım  [nick-name.ru]",
    badges:["https://community.akamai.steamstatic.com/public/images/badges/13_gamecollector/50_54.png?v=4","https://cdn.akamai.steamstatic.com/steamcommunity/public/images/items/657200/8d88fa57ce54184f4facadb9b1596931b516a4dc.png","https://community.akamai.steamstatic.com/public/images/badges/generic/YIR2023_54.png","https://cdn.akamai.steamstatic.com/steamcommunity/public/images/items/362680/03449c0e8bbfd7a9b1fca6a8ecfd9a1da4f6e43c.png"],
    mainBadge:{
        name:"Fransformation.",
        iconLink:"https://cdn.akamai.steamstatic.com/steamcommunity/public/images/items/362680/03449c0e8bbfd7a9b1fca6a8ecfd9a1da4f6e43c.png",
        xp:"100 XP"
    },
    level:24
  },
  basicUserInfo:{
    status:{
        statusType:"Offline",
        statusGame:null,
        statusText:"Currently Offline"
    },
    userInfo:{
        nickname:"Azgin Sinek",
        avatar:"https://avatars.akamai.steamstatic.com/a691782e9df50a0a5052ba0edb8df5b1789906a0_full.jpg",
        mainBadge:{
            name:"Fransformation.",
            iconLink:"https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/items/362680/03449c0e8bbfd7a9b1fca6a8ecfd9a1da4f6e43c.png",
            xp:"100 XP"
        },
        level:24
    }
  },
  User:{
    status:{
        statusType:"Offline",
        statusGame:null,
        statusText:"Currently Offline"
    },
    userInfo:{
      name:"A",
      nickname:"Azgin Sinek",
      avatar:"https://avatars.akamai.steamstatic.com/a691782e9df50a0a5052ba0edb8df5b1789906a0_full.jpg",
      country:"Istanbul, Istanbul, Turkey",
      description:"aq adası You go downjust like Holy MaryMary on a,Mary on a crossYour beauty never ever scared meMary on a, Mary on a cross Lisansım [nick-name.ru]",
      badges:["https://community.cloudflare.steamstatic.com/public/images/badges/13_gamecollector/50_54.png?v=4","https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/items/657200/8d88fa57ce54184f4facadb9b1596931b516a4dc.png","https://community.cloudflare.steamstatic.com/public/images/badges/generic/YIR2023_54.png","https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/items/362680/03449c0e8bbfd7a9b1fca6a8ecfd9a1da4f6e43c.png"],
      mainBadge:{
          name:"Fransformation.",
          iconLink:"https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/items/362680/03449c0e8bbfd7a9b1fca6a8ecfd9a1da4f6e43c.png",
          xp:"100 XP"
      },
      level:24
    },
    recentGames:[
        {
            name:"Counter-Strike 2",
            appid:730,
            iconLink:"https://cdn.akamai.steamstatic.com/steam/apps/730/capsule_184x69.jpg?t=1698860631",
            playtime_forever:"1,168 hrs on record",
            last_play:"last played on 4 Jan",
            badge:null,
            achievements:"1 of 1"
        },
        {
            name:"Super Hexagon",
            appid:221640,
            iconLink:"https://cdn.akamai.steamstatic.com/steam/apps/221640/capsule_184x69.jpg?t=1653925774",
            playtime_forever:"16 hrs on record",
            last_play:"last played on 3 Jan",
            badge:{
                "name":"Hexagon",
                "iconLink":"https://cdn.akamai.steamstatic.com/steamcommunity/public/images/items/221640/58d721e7a48e188c2dc48edf27e59c68c2d3a150.png",
                "xp":"100 XP"
            },
            achievements:"4 of 6"
        },
        {
            name:"Left 4 Dead 2",
            appid:550,
            iconLink:"https://cdn.akamai.steamstatic.com/steam/apps/550/capsule_184x69.jpg?t=1675801903",
            playtime_forever:"31 hrs on record",
            last_play:"last played on 25 Dec, 2023",
            badge:null,
            achievements:"27 of 101"
        }
    ]
  },
  CostumeComponent:{
    UserComponents:{
        status:{
            statusType:"Offline",
            statusGame:null,
            statusText:"Currently Offline"
        }
    },
    ShowCaseComponents:{
        favoriteGame:{
            name:"Fran Bow",
            appid:362680,
            iconLink:"https://cdn.akamai.steamstatic.com/steam/apps/362680/capsule_184x69.jpg?t=1693287362",
            playtime_forever:"12.9 Hours played",
            last_play:null,
            badge:{
                name:"Fransformation.",
                iconLink:"https://cdn.akamai.steamstatic.com/steamcommunity/public/images/items/362680/03449c0e8bbfd7a9b1fca6a8ecfd9a1da4f6e43c.png",
                xp:"100 XP"
            },
            achievements:"18 of 18"
        }
    }
  },
  basicProfile:{
    status:{
      statusType:"Offline",
      statusGame:null,
      statusText:"Currently Offline"
    },
    userInfo:{
      nickname:"Azgın Sinek",
      avatar:"https://avatars.akamai.steamstatic.com/a691782e9df50a0a5052ba0edb8df5b1789906a0_full.jpg",
      level:24,
      mainBadge:{
        name:"Fransformation.",
        iconLink:"https://cdn.akamai.steamstatic.com/steamcommunity/public/images/items/362680/03449c0e8bbfd7a9b1fca6a8ecfd9a1da4f6e43c.png",
        xp:"100 XP"
      }
    }
  }
}

describe("Steam API tests", () => {
  test("Steam API availability", async () => {
    const response = await axios.get("https://steamcommunity.com/id/CilginSinek");
    expect(response.status).toBe(200);
    if (response.status === 200) {
      const steam = new steamUser(response.data);
      
      const status = steam.getStatus();
      const userInfo = steam.getUserInfo();
      const recentGames = steam.getRecentGames();
      const favoriteGame = steam.getFavoriteGame();
      const basicProfile = steam.getBasicProfile();
      const costumeProfilePlus = steam.getCostumeUser("-userInfo, -recentGames","favoriteGame");
      const costumeProfile = steam.getCostumeUser("+status","favoriteGame");
      
      expect(status).not.toBeUndefined();
      expect(status).toStrictEqual(testJson.User.status)
      expect(status).toMatchObject(testJson.User.status)
      expect(JSON.stringify(status)).toEqual(JSON.stringify(testJson.User.status))
      
      expect(userInfo).not.toBeUndefined();
      expect(userInfo).toStrictEqual(testJson.userInfo)
      expect(userInfo).toMatchObject(testJson.userInfo)
      expect(JSON.stringify(userInfo)).toEqual(JSON.stringify(testJson.userInfo))
      
      expect(recentGames).not.toBeNull();
      expect(recentGames).toStrictEqual(testJson.User.recentGames)
      expect(recentGames).toMatchObject(testJson.User.recentGames)
      expect(JSON.stringify(recentGames)).toEqual(JSON.stringify(testJson.User.recentGames))
      
      expect(favoriteGame).not.toBeNull();
      expect(favoriteGame).toStrictEqual(testJson.CostumeComponent.ShowCaseComponents.favoriteGame)
      expect(favoriteGame).toMatchObject(testJson.CostumeComponent.ShowCaseComponents.favoriteGame)
      expect(JSON.stringify(favoriteGame)).toEqual(JSON.stringify(testJson.CostumeComponent.ShowCaseComponents.favoriteGame))

      expect(basicProfile).not.toBeNull();
      expect(basicProfile).toStrictEqual(testJson.basicProfile)
      expect(basicProfile).toMatchObject(testJson.basicProfile)
      expect(JSON.stringify(basicProfile)).toEqual(JSON.stringify(testJson.basicProfile))

      expect(costumeProfilePlus).not.toBeNull();
      expect(costumeProfilePlus).toStrictEqual(testJson.CostumeComponent)
      expect(costumeProfilePlus).toMatchObject(testJson.CostumeComponent)
      expect(JSON.stringify(costumeProfilePlus)).toEqual(JSON.stringify(testJson.CostumeComponent))

      expect(costumeProfile).not.toBeNull();
      expect(costumeProfile).toStrictEqual(testJson.CostumeComponent)
      expect(costumeProfile).toMatchObject(testJson.CostumeComponent)
      expect(JSON.stringify(costumeProfile)).toEqual(JSON.stringify(testJson.CostumeComponent))

      expect(costumeProfile).toStrictEqual(costumeProfilePlus);
      expect(JSON.stringify(costumeProfile)).toEqual(JSON.stringify(costumeProfilePlus));

    } else {
      throw new Error("Data not found");
    }
  });
});

