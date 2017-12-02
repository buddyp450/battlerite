# Battlerite.js

This is a Javascript API client wrapper for [Battlerite](http://battlerite.com). If you run into problems or find bugs, [file an issue](https://github.com/buddyp450/battlerite/issues).

## Installation

```
$ yarn add battlerite
# or npm install battlerite
```

To initalize the library

```javascript
import Battlerite from 'battlerite';
const battlerite = new Battlerite('api-key');
```

<a name="options" />

## Options

Base options can be modified by passing an object during initalization.

__Properties__
- `host` [*String*] - HTTP Url to call
- `title` [*String*] - X-TITLE-ID modifier
- `region` [*String*] - (NOT USED - only for Vainglory - all Battlerite Game Data Service data is on the "global" region shard) Region of which game data to request (`na`, `eu`, `sa`, `ea`, `sg`) [Reference](https://developer.vainglorygame.com/docs#regions)

```javascript
import Battlerite from 'battlerite';

// Defaults
const options = {
  host: 'https://api.dc01.gamelockerapp.com/shards/',
  region: 'global', // only valid region currently
  title: 'semc-vainglory', // not required <?> TODO: fix defaults
};

const battlerite = new Battlerite('api-key', options);
```

<a name="documentation" />

## Documentation

### Reference (previously for Vainglory, updating for Battlerite SOON, all docs here are for Vainglory - there may be overlap)

All methods are named references from the [Official API Reference](http://battlerite-docs.readthedocs.io/en/master/). All methods will return a promise.

* [`Errors`](#errors)
* [`RateLimits`](#rateLimits)
* [`Telemetry`](#telemetry)
* [`status`](#apiStatus)
* [`region`](#apiRegion)
* [`setRegion`](#apiSetRegion)
* [`models`](#apiModels)

<a name="matchesTOC" />

### Matches

* [`collection`](#matchesCollection)
* [`single`](#matchesSingle)

<a name="playersTOC" />

### Players

* [`getById`](#playersId)
* [`getByName`](#playersName)

<a name="tournamentTOC" />

### Tournament

* [`region`](#tournament)

<a name="errors" />

### Errors

You can check on the property `.errors` to determine if a response has errored and the [subsequent message that follows](https://developer.vainglorygame.com/docs#errors). `.debug` will provide request and header information.

__Example__

```
{ errors: true,
  messages: 'The specified object could not be found.',
  region: 'na',
  debug:
   { url: 'https://api.dc01.gamelockerapp.com/shards/na/matches?page[offset]=0&page[limit]=50&sort=createdAt&filter[createdAt-start]=2017-03-02T00:28:32.721Z&filter[createdAt-end]=2017-03-02T03:28:32.721Z&filter[playerNames]=&filter[teamNames]=',
     status: 'https://api.dc01.gamelockerapp.com/status',
     headers:
      { 'Content-Encoding': 'gzip',
        'Content-Type': 'application/json',
        'User-Agent': 'js/vainglory',
        Accept: 'application/vnd.api+json',
        Authorization: 'Bearer aaa.bbb.ccc',
        'X-TITLE-ID': 'semc-vainglory'
      }
    }
  },
  rateLimit:
    { limit: '10',
      remaining: '9',
      reset: '6000000000',
      requestId: 'some-arbitrary-id' }
    }
```

<a name="rateLimits" />

### Rate Limits

Rate limit information is attached to every request. All models will return `.rateLimit`, see the [Reference](https://developer.vainglorygame.com/docs#rate-limits) for more information or if you need to increase your rate limit.

```
  rateLimit:
    { limit: '10',
      remaining: '9',
      reset: '6000000000',
      requestId: 'some-arbitrary-id' }
    }
```

<a name="telemetry" />

### Telemetry

Telemetry data can be retrieved from the `match` model under assets. Assets is an array of [asset](#assetModel).

__Example__

```javascript
const matchId = 'f5373c40-0aa9-11e7-bcff-0667892d829e';
vainglory.matches.single(matchId).then((match) => {
  console.log(match.assets) // array of asset
}).catch((err) => console.error(err));
```

### .resolve()

If you would like to resolve telemetry data, you can call `.resolve()` directly on the asset. Note that this currently returns the raw data that is associated with `.URL`.

```javascript
const matchId = 'f5373c40-0aa9-11e7-bcff-0667892d829e';
vainglory.matches.single(matchId).then(async (match) => {
  const telemetry = await match.assets[0].resolve();
  console.log(telemetry);
}).catch((err) => console.error(err));
```

---------------------------------------
<a name="apiStatus" />

## Status

`vainglory.status`

Returns API meta information.

```javascript
vainglory.status().then((info) => console.log(info));
```

__Example Response__

```
{
  id: 'gamelocker', // From server
  releasedAt: '2017-02-24T20:44:05Z', // From server
  version: 'gamelockerd-v4.0.2', // From server
  clientVersion: '0.8.1' // From VaingloryJS
}
```

<a name="apiRegion" />

## region

`vainglory.region`

Changes the region for the current request.

```javascript
vainglory.region('sg').matches... // will return data from `sg` region
vainglory.matches... // data from the region that was initialized (defaults to na)
vainglory.players... // data from the region that was initialized (defaults to na)
```

<a name="apiSetRegion" />

## setRegion

`vainglory.setRegion`

Sets the region for the instance.

```javascript
vainglory.setRegion('sg'); // Overwrites parent
vainglory.matches... // will return data from `sg` region
vainglory.players... // will return data from `sg` region
```

<a name="apiModels" />

## models

`vainglory.models`

Exposed data models. See mock data in tests to see how data should be referenced.

```javascript
const match = new vainglory.models.match({data: ...match});
const matches = new vainglory.models.matches({data: ...matches});
const player = new vainglory.models.player({data: ...player});
const participant = new vainglory.models.participant({data: ...participant});
const roster = new vainglory.models.roster({data: ...roster});
```

---------------------------------------
## Matches

`vainglory.matches`

<a name="matchesCollection" />

#### .collection({...options})

Retrieves all matches. [Reference](http://developer.vainglorygame.com/docs/#get-a-collection-of-matches)

__Arguments__
- `options` [*Object*] - Query paramaters

```javascript
const now = new Date();
const minus28days = new Date();

minus28Days.setDate(now.getDate() - 28);

/* defaults */
const options = {
  page: {
    offset: 0,
    limit: 50,
  },
  sort: 'createdAt', // -createdAt for reverse
  filter: {
    'createdAt-start': minus28days.toISOString(), // ISO Date
    'createdAt-end': now.toISOString(), // ISO Date
    playerNames: [],
    teamNames: [],
  },
};
```

__Returns__
- [Matches](#matchesModel)

__Example__
```javascript
vainglory.matches.collection(options).then((matches) => {
  if (matches.errors) {
    return console.log(matches);
  }
  console.log(matches);
}).catch((errors) => {
  console.log(errors);
});
```

<a name="matchesSingle" />

#### .single(matchId)

Retreives a single match by ID. [Reference](http://developer.vainglorygame.com/docs/#get-a-single-match)

__Arguments__
- `matchId` [*String*] - The ID of match to retrieve

__Returns__
- [Match](#matchModel)

__Example__
```javascript
const matchId = '0123b560-d74c-11e6-b845-0671096b3e30';

vainglory.matches.single(matchId).then((match) => {
  if (match.errors) return;
  console.log(match);
}).catch((errors) => {
  console.log(errors);
});
```

---------------------------------------

## Players

`vainglory.players`

<a name="playersId" />

#### getById(playerId)

Retreives a **single** player by playerId. [Reference](http://developer.vainglorygame.com/docs/#get-a-single-player)

__Arguments__
- `playerId` [*String*] - The ID of player to retrieve

__Returns__
- [Player](#playerModel)

__Example__
```javascript
const playerId = '6abb30de-7cb8-11e4-8bd3-06eb725f8a76';

vainglory.players.getById(playerId).then((player) => {
  if (player.errors) return;
  console.log(player);
}).catch((errors) => {
  console.log(errors);
});
```

<a name="playersName" />

#### getByName(playerNames)

Retreives players by playerName. [Reference](http://developer.vainglorygame.com/docs/#get-a-single-player)

__Arguments__
- `playerNames` [*Array*] - The name of players to retrieve. Max length of 6.

__Returns__
- [Players](#playersModel)

__Example__
```javascript
const playerNames = ['famous'];

vainglory.players.getByName(playerNames).then((players) => {
  if (players.errors || players.player) return;
  players.player.forEach(player => {
    console.log(player.id);
    console.log(player.stats);
  }
}).catch((errors) => {
  console.log(errors);
});
```

---------------------------------------

## Tournament

`vainglory.tournament`

<a name="tournament" />

#### region(region)

Tournament data is stored in seperate shards as they take place on a private client. After you call region, you can bind the same methods you would use to call matches or player data. [Reference](https://developer.vainglorygame.com/docs#content-negotiation)

__Arguments__
- `region` [*String*] - **Optional** - Region of which tournament data to request (`na`, `eu`, `sa`, `ea`, `sg`). Note if this is blank, it will request whichever region data that was specified from `setRegion` or `region` [Reference](https://developer.vainglorygame.com/docs#regions)

__Returns__
- [Match](#matchesTOC)
- [Player](#playerTOC)

__Example__
```javascript
// Referencing Mathces
vainglory.tournament.region('na').matches.collection().then((matches) => {
  console.log(matches);
}).catch((err) => console.log(err));

// Or referencing Players
const playerNames = ['SOMEONE','SOMEONE_ELSE'];

vainglory.tournament.region('na').players.getByName(playerNames).then((players) => {
  console.log(players);
}).catch((err) => console.log(err));
```

---------------------------------------
## Models

All results are wrapped with its respective data model.

- `.type` - Returns the type of data requested
- `.id` - Returns associated ID
- `.raw` - Returns raw data from server

#### Remapped items vs server names

For fields in `participant` such as `actor` or `itemGrants`, server will return `*1000_Item_HalcyonPotion*`. The client will return `Halcyon Potion` automatically based on field mappings. If you would like the original response, instead of calling `.stats` directly, use `._stats` or `._actor` instead of `.actor`.

<a name="matchesModel" />

### Matches

- [`.match`](#matchModel) - Array of Match

<a name="matchModel" />

### Match

[Ref](https://developer.vainglorygame.com/docs#matches)

- `.assets` - Array of [Asset](#assetModel)
- `.createdAt`
- `.duration`
- `.gameMode`
- `.patchVersion`
- `.shardId`
- `.stats`
- `.titleId`
- `.rosters` - Array of [Roster](#rosterModel)

<a name="assetModel" />

### Asset

[Ref](https://developer.vainglorygame.com/docs#telemetry)

- `.URL`
- `.contentType`
- `.createdAt`
- `.description`
- `.filename`
- `.name`
- `.resolve()` - Returns promise; resolves `.URL` data

<a name="rosterModel" />

### Roster

[Ref](https://developer.vainglorygame.com/docs#rosters)

- `.stats`
- `.participants` - Array of [Participant](#participantModel)

<a name="participantModel" />

### Participant

[Ref](https://developer.vainglorygame.com/docs#participants)

- `._actor`
- `.actor`
- `._stats`
- `.stats`
- `.player` - [Player](#playerModel)

<a name="playersModel" />

### Players

- `.player` - Array of [Player](#playerModel)

<a name="playerModel" />

### Player

- `.name`
- `.shardId`
- `.stats`
- `.titleId`
- `.skillTier`
- `.karmaLevel`
- `.createdAt`
