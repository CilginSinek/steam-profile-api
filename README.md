# Steam Profile Api
Get Steam profile data with cheerio


## Using
```JavaScript
import SteamProfile from 'SteamProfile';

const steamHtml = await fetch("https://steamcommunity.com/id/"+steamid).then(res=>res.body.json())

const profile = new SteamProfile(steamHtml);
const StatusData = profile.getStatus();
console.log(StatusData);
// return status, status game information, status text
```
or
```JavaScript
import {getStatus} from 'SteamProfile';

const steamHtml = await fetch("https://steamcommunity.com/id/"+steamid).then(res=>res.body.json())

const StatusData = getStatus(steamHtml);
console.log(StatusData);
// return status, status game information, status text
```

### getCostumeUser Flags
- selectUser:
  - status
  - userInfo
  - recentGames
- showcaseSelect
  - favoriteGame

#### Example:
```JavaScript
import {getCostumeUser} from 'SteamProfile';

const userDataWithPlus = getCostumeUser("+status","favoriteGame","steamHtml");
console.log(userDataWithPlus)
// return UserComponents:status, ShowCaseComponents:favoriteGame

const userDataWithouPlus = getCostumeUser("-userInfo, recentGames","favoriteGame","steamHtml");
console.log(userDataWithouPlus) 
// return UserComponents:status, ShowCaseComponents:favoriteGame
```



## TO Do 
- [x] write test file
- [ ] write miniprofile functions
- [ ] add other special components
