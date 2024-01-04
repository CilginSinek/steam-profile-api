# Steam Profile Api
Get Steam profile data with cheerio

## Using
```JavaScript
import SteamProfile from 'SteamProfile';

const profile = new SteamProfile("SteamUrl");
const StatusData = profile.getStatus();
console.log(StatusData);
// return status, status game information, status text
```
or
```JavaScript
import {getStatus} from 'SteamProfile';
const StatusData = getStatus("SteamUrl");
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

const userDataWithPlus = getCostumeUser("+status","favoriteGame","SteamUrl");
console.log(userDataWithPlus)
// return UserComponents:status, ShowCaseComponents:favoriteGame

const userDataWithouPlus = getCostumeUser("-userInfo, recentGames","favoriteGame","SteamUrl");
console.log(userDataWithouPlus) 
// return UserComponents:status, ShowCaseComponents:favoriteGame
```



## TO Do 
- [ ] write test file
- [ ] add other special components
