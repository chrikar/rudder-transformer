const path = require('path')
const RudderCDK = require('rudder-transformer-cdk')

const main = () => {
  try {
    const destName = 'variance'
    const basePath = path.resolve(__dirname, './destinations')
    const factory = new RudderCDK.ConfigFactory(basePath)
    console.log(factory)
    console.log(factory.getConfig(destName))
    console.log("Config map ", factory.configMap)
    const map = factory
      .getConfig(destName)
      .getTransformationUtilMap()
    // for (const key of map.keys()) {
    //   console.log(key, JSON.stringify(map.get(key)))
    // }
    
    const event = {
      "message": {
        "anonymousId": "c82cbdff-e5be-4009-ac78-cdeea09ab4b1",
        "context": {
          "device": {
            "id": "df16bffa-5c3d-4fbb-9bce-3bab098129a7R",
            "manufacturer": "Xiaomi",
            "model": "Redmi 6",
            "name": "xiaomi"
          },
          "network": {
            "carrier": "Banglalink"
          },
          "os": {
            "name": "android",
            "version": "8.1.0"
          },
          "traits": {
            "address": {
              "city": "Dhaka",
              "country": "Bangladesh"
            },
            "anonymousId": "c82cbdff-e5be-4009-ac78-cdeea09ab4b1"
          }
        },
        "event": "spin_result",
        "integrations": {
          "All": true
        },
        "message_id": "a80f82be-9bdc-4a9f-b2a5-15621ee41df8",
        "properties": {
          "additional_bet_index": 0,
          "battle_id": "N/A",
          "bet_amount": 9,
          "bet_level": 1,
          "bet_multiplier": 1,
          "coin_balance": 9466052,
          "current_module_name": "CasinoGameModule",
          "days_in_game": 0,
          "extra_param": "N/A",
          "fb_profile": "0",
          "featureGameType": "N/A",
          "game_fps": 30,
          "game_id": "fireEagleBase",
          "game_name": "FireEagleSlots",
          "gem_balance": 0,
          "graphicsQuality": "HD",
          "idfa": "2bf99787-33d2-4ae2-a76a-c49672f97252",
          "internetReachability": "ReachableViaLocalAreaNetwork",
          "isLowEndDevice": "False",
          "is_auto_spin": "False",
          "is_turbo": "False",
          "isf": "False",
          "ishighroller": "False",
          "jackpot_win_amount": 90,
          "jackpot_win_type": "Silver",
          "level": 6,
          "lifetime_gem_balance": 0,
          "no_of_spin": 1,
          "player_total_battles": 0,
          "player_total_shields": 0,
          "start_date": "2019-08-01",
          "total_payments": 0,
          "tournament_id": "T1561970819",
          "userId": "c82cbdff-e5be-4009-ac78-cdeea09ab4b1",
          "versionSessionCount": 2,
          "win_amount": 0
        },
        "timestamp": "2019-09-01T15:46:51.693229+05:30",
        "type": "track",
        "user_properties": {
          "coin_balance": 9466052,
          "current_module_name": "CasinoGameModule",
          "fb_profile": "0",
          "game_fps": 30,
          "game_name": "FireEagleSlots",
          "gem_balance": 0,
          "graphicsQuality": "HD",
          "idfa": "2bf99787-33d2-4ae2-a76a-c49672f97252",
          "internetReachability": "ReachableViaLocalAreaNetwork",
          "isLowEndDevice": false,
          "level": 6,
          "lifetime_gem_balance": 0,
          "player_total_battles": 0,
          "player_total_shields": 0,
          "start_date": "2019-08-01",
          "total_payments": 0,
          "userId": "c82cbdff-e5be-4009-ac78-cdeea09ab4b1",
          "versionSessionCount": 2
        }
      },
      "destination": {
        "Config": {
          "webhookUrl": "http://6b0e6a60.ngrok.io",
          "authHeader": "Basic MVA4dUtGOF="
        }
      }
    }

    const expected = {
      "timestamp": "2019-09-01T15:46:51.693229+05:30",
      "user_properties": {
        "total_payments": 0,
        "internetReachability": "ReachableViaLocalAreaNetwork",
        "level": 6,
        "userId": "c82cbdff-e5be-4009-ac78-cdeea09ab4b1",
        "coin_balance": 9466052,
        "player_total_shields": 0,
        "isLowEndDevice": false,
        "game_fps": 30,
        "idfa": "2bf99787-33d2-4ae2-a76a-c49672f97252",
        "graphicsQuality": "HD",
        "current_module_name": "CasinoGameModule",
        "player_total_battles": 0,
        "lifetime_gem_balance": 0,
        "gem_balance": 0,
        "fb_profile": "0",
        "start_date": "2019-08-01",
        "versionSessionCount": 2,
        "game_name": "FireEagleSlots"
      },
      "integrations": {
        "All": true
      },
      "event": "spin_result",
      "message_id": "a80f82be-9bdc-4a9f-b2a5-15621ee41df8",
      "anonymousId": "c82cbdff-e5be-4009-ac78-cdeea09ab4b1",
      "context": {
        "device": {
          "model": "Redmi 6",
          "manufacturer": "Xiaomi",
          "id": "df16bffa-5c3d-4fbb-9bce-3bab098129a7R",
          "name": "xiaomi"
        },
        "traits": {
          "anonymousId": "c82cbdff-e5be-4009-ac78-cdeea09ab4b1",
          "address": {
            "city": "Dhaka",
            "country": "Bangladesh"
          }
        },
        "os": {
          "version": "8.1.0",
          "name": "android"
        },
        "network": {
          "carrier": "Banglalink"
        }
      },
      "type": "track",
      "properties": {
        "userId": "c82cbdff-e5be-4009-ac78-cdeea09ab4b1",
        "jackpot_win_type": "Silver",
        "coin_balance": 9466052,
        "bet_level": 1,
        "ishighroller": "False",
        "tournament_id": "T1561970819",
        "battle_id": "N/A",
        "bet_amount": 9,
        "fb_profile": "0",
        "player_total_shields": 0,
        "is_turbo": "False",
        "player_total_battles": 0,
        "bet_multiplier": 1,
        "start_date": "2019-08-01",
        "versionSessionCount": 2,
        "graphicsQuality": "HD",
        "is_auto_spin": "False",
        "days_in_game": 0,
        "additional_bet_index": 0,
        "isLowEndDevice": "False",
        "game_fps": 30,
        "extra_param": "N/A",
        "idfa": "2bf99787-33d2-4ae2-a76a-c49672f97252",
        "current_module_name": "CasinoGameModule",
        "game_id": "fireEagleBase",
        "featureGameType": "N/A",
        "gem_balance": 0,
        "internetReachability": "ReachableViaLocalAreaNetwork",
        "total_payments": 0,
        "level": 6,
        "win_amount": 0,
        "no_of_spin": 1,
        "game_name": "FireEagleSlots",
        "jackpot_win_amount": 90,
        "lifetime_gem_balance": 0,
        "isf": "False"
      }
    }

    RudderCDK.Executor.executeStages(
      event,
      factory.getConfig(destName) 
    )

    // const identifyBlock = map.get('identify')
    // identifyBlock.postMapper('test args')

  } catch (err) {
    console.log('error in main: ', err)
  }
}

main()
