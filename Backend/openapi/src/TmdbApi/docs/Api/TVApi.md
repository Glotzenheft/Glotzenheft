# App\TmdbApi\TVApi



All URIs are relative to https://api.themoviedb.org, except if the operation defines another base path.

| Method | HTTP request | Description |
| ------------- | ------------- | ------------- |
| [**changesTvList()**](TVApi.md#changesTvList) | **GET** /3/tv/changes | TV List |
| [**listsCopy()**](TVApi.md#listsCopy) | **GET** /3/tv/{series_id}/lists | Lists |
| [**tvEpisodeAccountStates()**](TVApi.md#tvEpisodeAccountStates) | **GET** /3/tv/{series_id}/season/{season_number}/episode/{episode_number}/account_states | Account States |
| [**tvEpisodeAddRating()**](TVApi.md#tvEpisodeAddRating) | **POST** /3/tv/{series_id}/season/{season_number}/episode/{episode_number}/rating | Add Rating |
| [**tvEpisodeChangesById()**](TVApi.md#tvEpisodeChangesById) | **GET** /3/tv/episode/{episode_id}/changes | Changes |
| [**tvEpisodeCredits()**](TVApi.md#tvEpisodeCredits) | **GET** /3/tv/{series_id}/season/{season_number}/episode/{episode_number}/credits | Credits |
| [**tvEpisodeDeleteRating()**](TVApi.md#tvEpisodeDeleteRating) | **DELETE** /3/tv/{series_id}/season/{season_number}/episode/{episode_number}/rating | Delete Rating |
| [**tvEpisodeDetails()**](TVApi.md#tvEpisodeDetails) | **GET** /3/tv/{series_id}/season/{season_number}/episode/{episode_number} | Details |
| [**tvEpisodeExternalIds()**](TVApi.md#tvEpisodeExternalIds) | **GET** /3/tv/{series_id}/season/{season_number}/episode/{episode_number}/external_ids | External IDs |
| [**tvEpisodeGroupDetails()**](TVApi.md#tvEpisodeGroupDetails) | **GET** /3/tv/episode_group/{tv_episode_group_id} | Details |
| [**tvEpisodeImages()**](TVApi.md#tvEpisodeImages) | **GET** /3/tv/{series_id}/season/{season_number}/episode/{episode_number}/images | Images |
| [**tvEpisodeTranslations()**](TVApi.md#tvEpisodeTranslations) | **GET** /3/tv/{series_id}/season/{season_number}/episode/{episode_number}/translations | Translations |
| [**tvEpisodeVideos()**](TVApi.md#tvEpisodeVideos) | **GET** /3/tv/{series_id}/season/{season_number}/episode/{episode_number}/videos | Videos |
| [**tvSeasonAccountStates()**](TVApi.md#tvSeasonAccountStates) | **GET** /3/tv/{series_id}/season/{season_number}/account_states | Account States |
| [**tvSeasonAggregateCredits()**](TVApi.md#tvSeasonAggregateCredits) | **GET** /3/tv/{series_id}/season/{season_number}/aggregate_credits | Aggregate Credits |
| [**tvSeasonChangesById()**](TVApi.md#tvSeasonChangesById) | **GET** /3/tv/season/{season_id}/changes | Changes |
| [**tvSeasonCredits()**](TVApi.md#tvSeasonCredits) | **GET** /3/tv/{series_id}/season/{season_number}/credits | Credits |
| [**tvSeasonDetails()**](TVApi.md#tvSeasonDetails) | **GET** /3/tv/{series_id}/season/{season_number} | Details |
| [**tvSeasonExternalIds()**](TVApi.md#tvSeasonExternalIds) | **GET** /3/tv/{series_id}/season/{season_number}/external_ids | External IDs |
| [**tvSeasonImages()**](TVApi.md#tvSeasonImages) | **GET** /3/tv/{series_id}/season/{season_number}/images | Images |
| [**tvSeasonTranslations()**](TVApi.md#tvSeasonTranslations) | **GET** /3/tv/{series_id}/season/{season_number}/translations | Translations |
| [**tvSeasonVideos()**](TVApi.md#tvSeasonVideos) | **GET** /3/tv/{series_id}/season/{season_number}/videos | Videos |
| [**tvSeasonWatchProviders()**](TVApi.md#tvSeasonWatchProviders) | **GET** /3/tv/{series_id}/season/{season_number}/watch/providers | Watch Providers |
| [**tvSeriesAccountStates()**](TVApi.md#tvSeriesAccountStates) | **GET** /3/tv/{series_id}/account_states | Account States |
| [**tvSeriesAddRating()**](TVApi.md#tvSeriesAddRating) | **POST** /3/tv/{series_id}/rating | Add Rating |
| [**tvSeriesAggregateCredits()**](TVApi.md#tvSeriesAggregateCredits) | **GET** /3/tv/{series_id}/aggregate_credits | Aggregate Credits |
| [**tvSeriesAiringTodayList()**](TVApi.md#tvSeriesAiringTodayList) | **GET** /3/tv/airing_today | Airing Today |
| [**tvSeriesAlternativeTitles()**](TVApi.md#tvSeriesAlternativeTitles) | **GET** /3/tv/{series_id}/alternative_titles | Alternative Titles |
| [**tvSeriesChanges()**](TVApi.md#tvSeriesChanges) | **GET** /3/tv/{series_id}/changes | Changes |
| [**tvSeriesContentRatings()**](TVApi.md#tvSeriesContentRatings) | **GET** /3/tv/{series_id}/content_ratings | Content Ratings |
| [**tvSeriesCredits()**](TVApi.md#tvSeriesCredits) | **GET** /3/tv/{series_id}/credits | Credits |
| [**tvSeriesDeleteRating()**](TVApi.md#tvSeriesDeleteRating) | **DELETE** /3/tv/{series_id}/rating | Delete Rating |
| [**tvSeriesDetails()**](TVApi.md#tvSeriesDetails) | **GET** /3/tv/{series_id} | Details |
| [**tvSeriesEpisodeGroups()**](TVApi.md#tvSeriesEpisodeGroups) | **GET** /3/tv/{series_id}/episode_groups | Episode Groups |
| [**tvSeriesExternalIds()**](TVApi.md#tvSeriesExternalIds) | **GET** /3/tv/{series_id}/external_ids | External IDs |
| [**tvSeriesImages()**](TVApi.md#tvSeriesImages) | **GET** /3/tv/{series_id}/images | Images |
| [**tvSeriesKeywords()**](TVApi.md#tvSeriesKeywords) | **GET** /3/tv/{series_id}/keywords | Keywords |
| [**tvSeriesLatestId()**](TVApi.md#tvSeriesLatestId) | **GET** /3/tv/latest | Latest |
| [**tvSeriesOnTheAirList()**](TVApi.md#tvSeriesOnTheAirList) | **GET** /3/tv/on_the_air | On The Air |
| [**tvSeriesPopularList()**](TVApi.md#tvSeriesPopularList) | **GET** /3/tv/popular | Popular |
| [**tvSeriesRecommendations()**](TVApi.md#tvSeriesRecommendations) | **GET** /3/tv/{series_id}/recommendations | Recommendations |
| [**tvSeriesReviews()**](TVApi.md#tvSeriesReviews) | **GET** /3/tv/{series_id}/reviews | Reviews |
| [**tvSeriesScreenedTheatrically()**](TVApi.md#tvSeriesScreenedTheatrically) | **GET** /3/tv/{series_id}/screened_theatrically | Screened Theatrically |
| [**tvSeriesSimilar()**](TVApi.md#tvSeriesSimilar) | **GET** /3/tv/{series_id}/similar | Similar |
| [**tvSeriesTopRatedList()**](TVApi.md#tvSeriesTopRatedList) | **GET** /3/tv/top_rated | Top Rated |
| [**tvSeriesTranslations()**](TVApi.md#tvSeriesTranslations) | **GET** /3/tv/{series_id}/translations | Translations |
| [**tvSeriesVideos()**](TVApi.md#tvSeriesVideos) | **GET** /3/tv/{series_id}/videos | Videos |
| [**tvSeriesWatchProviders()**](TVApi.md#tvSeriesWatchProviders) | **GET** /3/tv/{series_id}/watch/providers | Watch Providers |


## `changesTvList()`

```php
changesTvList($end_date, $page, $start_date): \App\TmdbApi\Model\ChangesTvList200Response
```

TV List



### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\TVApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$end_date = new \DateTime('2013-10-20T19:20:30+01:00'); // \DateTime
$page = 1; // int
$start_date = new \DateTime('2013-10-20T19:20:30+01:00'); // \DateTime

try {
    $result = $apiInstance->changesTvList($end_date, $page, $start_date);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling TVApi->changesTvList: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **end_date** | **\DateTime**|  | [optional] |
| **page** | **int**|  | [optional] [default to 1] |
| **start_date** | **\DateTime**|  | [optional] |

### Return type

[**\App\TmdbApi\Model\ChangesTvList200Response**](../Model/ChangesTvList200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `listsCopy()`

```php
listsCopy($series_id, $language, $page): \App\TmdbApi\Model\ListsCopy200Response
```

Lists

Get the lists that a TV series has been added to.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\TVApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$series_id = 56; // int
$language = 'en-US'; // string
$page = 1; // int

try {
    $result = $apiInstance->listsCopy($series_id, $language, $page);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling TVApi->listsCopy: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **series_id** | **int**|  | |
| **language** | **string**|  | [optional] [default to &#39;en-US&#39;] |
| **page** | **int**|  | [optional] [default to 1] |

### Return type

[**\App\TmdbApi\Model\ListsCopy200Response**](../Model/ListsCopy200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `tvEpisodeAccountStates()`

```php
tvEpisodeAccountStates($series_id, $season_number, $episode_number, $session_id, $guest_session_id): \App\TmdbApi\Model\MovieAccountStates200Response
```

Account States

Get the rating, watchlist and favourite status.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\TVApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$series_id = 56; // int
$season_number = 56; // int
$episode_number = 56; // int
$session_id = 'session_id_example'; // string
$guest_session_id = 'guest_session_id_example'; // string

try {
    $result = $apiInstance->tvEpisodeAccountStates($series_id, $season_number, $episode_number, $session_id, $guest_session_id);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling TVApi->tvEpisodeAccountStates: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **series_id** | **int**|  | |
| **season_number** | **int**|  | |
| **episode_number** | **int**|  | |
| **session_id** | **string**|  | [optional] |
| **guest_session_id** | **string**|  | [optional] |

### Return type

[**\App\TmdbApi\Model\MovieAccountStates200Response**](../Model/MovieAccountStates200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `tvEpisodeAddRating()`

```php
tvEpisodeAddRating($series_id, $content_type, $season_number, $episode_number, $guest_session_id, $session_id, $account_add_favorite_request): \App\TmdbApi\Model\AccountAddFavorite200Response
```

Add Rating

Rate a TV episode and save it to your rated list.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\TVApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$series_id = 56; // int
$content_type = 'application/json;charset=utf-8'; // string
$season_number = 56; // int
$episode_number = 56; // int
$guest_session_id = 'guest_session_id_example'; // string
$session_id = 'session_id_example'; // string
$account_add_favorite_request = {value=8.5}; // \App\TmdbApi\Model\AccountAddFavoriteRequest

try {
    $result = $apiInstance->tvEpisodeAddRating($series_id, $content_type, $season_number, $episode_number, $guest_session_id, $session_id, $account_add_favorite_request);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling TVApi->tvEpisodeAddRating: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **series_id** | **int**|  | |
| **content_type** | **string**|  | [default to &#39;application/json;charset&#x3D;utf-8&#39;] |
| **season_number** | **int**|  | |
| **episode_number** | **int**|  | |
| **guest_session_id** | **string**|  | [optional] |
| **session_id** | **string**|  | [optional] |
| **account_add_favorite_request** | [**\App\TmdbApi\Model\AccountAddFavoriteRequest**](../Model/AccountAddFavoriteRequest.md)|  | [optional] |

### Return type

[**\App\TmdbApi\Model\AccountAddFavorite200Response**](../Model/AccountAddFavorite200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `tvEpisodeChangesById()`

```php
tvEpisodeChangesById($episode_id): \App\TmdbApi\Model\TvEpisodeChangesById200Response
```

Changes

Get the recent changes for a TV episode.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\TVApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$episode_id = 56; // int

try {
    $result = $apiInstance->tvEpisodeChangesById($episode_id);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling TVApi->tvEpisodeChangesById: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **episode_id** | **int**|  | |

### Return type

[**\App\TmdbApi\Model\TvEpisodeChangesById200Response**](../Model/TvEpisodeChangesById200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `tvEpisodeCredits()`

```php
tvEpisodeCredits($series_id, $season_number, $episode_number, $language): \App\TmdbApi\Model\TvEpisodeCredits200Response
```

Credits



### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\TVApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$series_id = 56; // int
$season_number = 56; // int
$episode_number = 56; // int
$language = 'en-US'; // string

try {
    $result = $apiInstance->tvEpisodeCredits($series_id, $season_number, $episode_number, $language);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling TVApi->tvEpisodeCredits: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **series_id** | **int**|  | |
| **season_number** | **int**|  | |
| **episode_number** | **int**|  | |
| **language** | **string**|  | [optional] [default to &#39;en-US&#39;] |

### Return type

[**\App\TmdbApi\Model\TvEpisodeCredits200Response**](../Model/TvEpisodeCredits200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `tvEpisodeDeleteRating()`

```php
tvEpisodeDeleteRating($series_id, $season_number, $episode_number, $content_type, $guest_session_id, $session_id): \App\TmdbApi\Model\ListRemoveMovie200Response
```

Delete Rating

Delete your rating on a TV episode.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\TVApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$series_id = 56; // int
$season_number = 56; // int
$episode_number = 56; // int
$content_type = 'application/json;charset=utf-8'; // string
$guest_session_id = 'guest_session_id_example'; // string
$session_id = 'session_id_example'; // string

try {
    $result = $apiInstance->tvEpisodeDeleteRating($series_id, $season_number, $episode_number, $content_type, $guest_session_id, $session_id);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling TVApi->tvEpisodeDeleteRating: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **series_id** | **int**|  | |
| **season_number** | **int**|  | |
| **episode_number** | **int**|  | |
| **content_type** | **string**|  | [optional] [default to &#39;application/json;charset&#x3D;utf-8&#39;] |
| **guest_session_id** | **string**|  | [optional] |
| **session_id** | **string**|  | [optional] |

### Return type

[**\App\TmdbApi\Model\ListRemoveMovie200Response**](../Model/ListRemoveMovie200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `tvEpisodeDetails()`

```php
tvEpisodeDetails($series_id, $season_number, $episode_number, $append_to_response, $language): \App\TmdbApi\Model\TvEpisodeDetails200Response
```

Details

Query the details of a TV episode.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\TVApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$series_id = 56; // int
$season_number = 56; // int
$episode_number = 56; // int
$append_to_response = 'append_to_response_example'; // string | comma separated list of endpoints within this namespace, 20 items max
$language = 'en-US'; // string

try {
    $result = $apiInstance->tvEpisodeDetails($series_id, $season_number, $episode_number, $append_to_response, $language);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling TVApi->tvEpisodeDetails: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **series_id** | **int**|  | |
| **season_number** | **int**|  | |
| **episode_number** | **int**|  | |
| **append_to_response** | **string**| comma separated list of endpoints within this namespace, 20 items max | [optional] |
| **language** | **string**|  | [optional] [default to &#39;en-US&#39;] |

### Return type

[**\App\TmdbApi\Model\TvEpisodeDetails200Response**](../Model/TvEpisodeDetails200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `tvEpisodeExternalIds()`

```php
tvEpisodeExternalIds($series_id, $season_number, $episode_number): \App\TmdbApi\Model\TvEpisodeExternalIds200Response
```

External IDs

Get a list of external IDs that have been added to a TV episode.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\TVApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$series_id = 56; // int
$season_number = 56; // int
$episode_number = 'episode_number_example'; // string

try {
    $result = $apiInstance->tvEpisodeExternalIds($series_id, $season_number, $episode_number);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling TVApi->tvEpisodeExternalIds: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **series_id** | **int**|  | |
| **season_number** | **int**|  | |
| **episode_number** | **string**|  | |

### Return type

[**\App\TmdbApi\Model\TvEpisodeExternalIds200Response**](../Model/TvEpisodeExternalIds200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `tvEpisodeGroupDetails()`

```php
tvEpisodeGroupDetails($tv_episode_group_id): \App\TmdbApi\Model\TvEpisodeGroupDetails200Response
```

Details

Get the details of a TV episode group.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\TVApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$tv_episode_group_id = 'tv_episode_group_id_example'; // string

try {
    $result = $apiInstance->tvEpisodeGroupDetails($tv_episode_group_id);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling TVApi->tvEpisodeGroupDetails: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **tv_episode_group_id** | **string**|  | |

### Return type

[**\App\TmdbApi\Model\TvEpisodeGroupDetails200Response**](../Model/TvEpisodeGroupDetails200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `tvEpisodeImages()`

```php
tvEpisodeImages($series_id, $season_number, $episode_number, $include_image_language, $language): \App\TmdbApi\Model\TvEpisodeImages200Response
```

Images

Get the images that belong to a TV episode.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\TVApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$series_id = 56; // int
$season_number = 56; // int
$episode_number = 56; // int
$include_image_language = 'include_image_language_example'; // string | specify a comma separated list of ISO-639-1 values to query, for example: `en-US,null`
$language = 'language_example'; // string

try {
    $result = $apiInstance->tvEpisodeImages($series_id, $season_number, $episode_number, $include_image_language, $language);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling TVApi->tvEpisodeImages: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **series_id** | **int**|  | |
| **season_number** | **int**|  | |
| **episode_number** | **int**|  | |
| **include_image_language** | **string**| specify a comma separated list of ISO-639-1 values to query, for example: &#x60;en-US,null&#x60; | [optional] |
| **language** | **string**|  | [optional] |

### Return type

[**\App\TmdbApi\Model\TvEpisodeImages200Response**](../Model/TvEpisodeImages200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `tvEpisodeTranslations()`

```php
tvEpisodeTranslations($series_id, $season_number, $episode_number): \App\TmdbApi\Model\TvEpisodeTranslations200Response
```

Translations

Get the translations that have been added to a TV episode.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\TVApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$series_id = 56; // int
$season_number = 56; // int
$episode_number = 56; // int

try {
    $result = $apiInstance->tvEpisodeTranslations($series_id, $season_number, $episode_number);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling TVApi->tvEpisodeTranslations: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **series_id** | **int**|  | |
| **season_number** | **int**|  | |
| **episode_number** | **int**|  | |

### Return type

[**\App\TmdbApi\Model\TvEpisodeTranslations200Response**](../Model/TvEpisodeTranslations200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `tvEpisodeVideos()`

```php
tvEpisodeVideos($series_id, $season_number, $episode_number, $include_video_language, $language): \App\TmdbApi\Model\TvSeasonVideos200Response
```

Videos

Get the videos that belong to a TV episode.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\TVApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$series_id = 56; // int
$season_number = 56; // int
$episode_number = 56; // int
$include_video_language = 'include_video_language_example'; // string | filter the list results by language, supports more than one value by using a comma
$language = 'en-US'; // string

try {
    $result = $apiInstance->tvEpisodeVideos($series_id, $season_number, $episode_number, $include_video_language, $language);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling TVApi->tvEpisodeVideos: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **series_id** | **int**|  | |
| **season_number** | **int**|  | |
| **episode_number** | **int**|  | |
| **include_video_language** | **string**| filter the list results by language, supports more than one value by using a comma | [optional] |
| **language** | **string**|  | [optional] [default to &#39;en-US&#39;] |

### Return type

[**\App\TmdbApi\Model\TvSeasonVideos200Response**](../Model/TvSeasonVideos200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `tvSeasonAccountStates()`

```php
tvSeasonAccountStates($series_id, $season_number, $session_id, $guest_session_id): \App\TmdbApi\Model\TvSeasonAccountStates200Response
```

Account States

Get the rating, watchlist and favourite status.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\TVApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$series_id = 56; // int
$season_number = 56; // int
$session_id = 'session_id_example'; // string
$guest_session_id = 'guest_session_id_example'; // string

try {
    $result = $apiInstance->tvSeasonAccountStates($series_id, $season_number, $session_id, $guest_session_id);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling TVApi->tvSeasonAccountStates: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **series_id** | **int**|  | |
| **season_number** | **int**|  | |
| **session_id** | **string**|  | [optional] |
| **guest_session_id** | **string**|  | [optional] |

### Return type

[**\App\TmdbApi\Model\TvSeasonAccountStates200Response**](../Model/TvSeasonAccountStates200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `tvSeasonAggregateCredits()`

```php
tvSeasonAggregateCredits($series_id, $season_number, $language): \App\TmdbApi\Model\TvSeasonAggregateCredits200Response
```

Aggregate Credits

Get the aggregate credits (cast and crew) that have been added to a TV season.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\TVApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$series_id = 56; // int
$season_number = 56; // int
$language = 'en-US'; // string

try {
    $result = $apiInstance->tvSeasonAggregateCredits($series_id, $season_number, $language);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling TVApi->tvSeasonAggregateCredits: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **series_id** | **int**|  | |
| **season_number** | **int**|  | |
| **language** | **string**|  | [optional] [default to &#39;en-US&#39;] |

### Return type

[**\App\TmdbApi\Model\TvSeasonAggregateCredits200Response**](../Model/TvSeasonAggregateCredits200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `tvSeasonChangesById()`

```php
tvSeasonChangesById($season_id, $end_date, $page, $start_date): \App\TmdbApi\Model\TvSeasonChangesById200Response
```

Changes

Get the recent changes for a TV season.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\TVApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$season_id = 56; // int
$end_date = 'end_date_example'; // string
$page = 1; // int
$start_date = 'start_date_example'; // string

try {
    $result = $apiInstance->tvSeasonChangesById($season_id, $end_date, $page, $start_date);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling TVApi->tvSeasonChangesById: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **season_id** | **int**|  | |
| **end_date** | **string**|  | [optional] |
| **page** | **int**|  | [optional] [default to 1] |
| **start_date** | **string**|  | [optional] |

### Return type

[**\App\TmdbApi\Model\TvSeasonChangesById200Response**](../Model/TvSeasonChangesById200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `tvSeasonCredits()`

```php
tvSeasonCredits($series_id, $season_number, $language): \App\TmdbApi\Model\TvSeasonCredits200Response
```

Credits



### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\TVApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$series_id = 56; // int
$season_number = 56; // int
$language = 'en-US'; // string

try {
    $result = $apiInstance->tvSeasonCredits($series_id, $season_number, $language);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling TVApi->tvSeasonCredits: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **series_id** | **int**|  | |
| **season_number** | **int**|  | |
| **language** | **string**|  | [optional] [default to &#39;en-US&#39;] |

### Return type

[**\App\TmdbApi\Model\TvSeasonCredits200Response**](../Model/TvSeasonCredits200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `tvSeasonDetails()`

```php
tvSeasonDetails($series_id, $season_number, $append_to_response, $language): \App\TmdbApi\Model\TvSeasonDetails200Response
```

Details

Query the details of a TV season.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\TVApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$series_id = 56; // int
$season_number = 56; // int
$append_to_response = 'append_to_response_example'; // string | comma separated list of endpoints within this namespace, 20 items max
$language = 'en-US'; // string

try {
    $result = $apiInstance->tvSeasonDetails($series_id, $season_number, $append_to_response, $language);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling TVApi->tvSeasonDetails: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **series_id** | **int**|  | |
| **season_number** | **int**|  | |
| **append_to_response** | **string**| comma separated list of endpoints within this namespace, 20 items max | [optional] |
| **language** | **string**|  | [optional] [default to &#39;en-US&#39;] |

### Return type

[**\App\TmdbApi\Model\TvSeasonDetails200Response**](../Model/TvSeasonDetails200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `tvSeasonExternalIds()`

```php
tvSeasonExternalIds($series_id, $season_number): \App\TmdbApi\Model\TvSeasonExternalIds200Response
```

External IDs

Get a list of external IDs that have been added to a TV season.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\TVApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$series_id = 56; // int
$season_number = 56; // int

try {
    $result = $apiInstance->tvSeasonExternalIds($series_id, $season_number);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling TVApi->tvSeasonExternalIds: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **series_id** | **int**|  | |
| **season_number** | **int**|  | |

### Return type

[**\App\TmdbApi\Model\TvSeasonExternalIds200Response**](../Model/TvSeasonExternalIds200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `tvSeasonImages()`

```php
tvSeasonImages($series_id, $season_number, $include_image_language, $language): \App\TmdbApi\Model\TvSeasonImages200Response
```

Images

Get the images that belong to a TV season.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\TVApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$series_id = 56; // int
$season_number = 56; // int
$include_image_language = 'include_image_language_example'; // string | specify a comma separated list of ISO-639-1 values to query, for example: `en-US,null`
$language = 'language_example'; // string

try {
    $result = $apiInstance->tvSeasonImages($series_id, $season_number, $include_image_language, $language);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling TVApi->tvSeasonImages: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **series_id** | **int**|  | |
| **season_number** | **int**|  | |
| **include_image_language** | **string**| specify a comma separated list of ISO-639-1 values to query, for example: &#x60;en-US,null&#x60; | [optional] |
| **language** | **string**|  | [optional] |

### Return type

[**\App\TmdbApi\Model\TvSeasonImages200Response**](../Model/TvSeasonImages200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `tvSeasonTranslations()`

```php
tvSeasonTranslations($series_id, $season_number): \App\TmdbApi\Model\TvSeasonTranslations200Response
```

Translations

Get the translations for a TV season.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\TVApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$series_id = 56; // int
$season_number = 56; // int

try {
    $result = $apiInstance->tvSeasonTranslations($series_id, $season_number);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling TVApi->tvSeasonTranslations: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **series_id** | **int**|  | |
| **season_number** | **int**|  | |

### Return type

[**\App\TmdbApi\Model\TvSeasonTranslations200Response**](../Model/TvSeasonTranslations200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `tvSeasonVideos()`

```php
tvSeasonVideos($series_id, $season_number, $include_video_language, $language): \App\TmdbApi\Model\TvSeasonVideos200Response
```

Videos

Get the videos that belong to a TV season.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\TVApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$series_id = 56; // int
$season_number = 56; // int
$include_video_language = 'include_video_language_example'; // string | filter the list results by language, supports more than one value by using a comma
$language = 'en-US'; // string

try {
    $result = $apiInstance->tvSeasonVideos($series_id, $season_number, $include_video_language, $language);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling TVApi->tvSeasonVideos: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **series_id** | **int**|  | |
| **season_number** | **int**|  | |
| **include_video_language** | **string**| filter the list results by language, supports more than one value by using a comma | [optional] |
| **language** | **string**|  | [optional] [default to &#39;en-US&#39;] |

### Return type

[**\App\TmdbApi\Model\TvSeasonVideos200Response**](../Model/TvSeasonVideos200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `tvSeasonWatchProviders()`

```php
tvSeasonWatchProviders($series_id, $season_number, $language): \App\TmdbApi\Model\TvSeasonWatchProviders200Response
```

Watch Providers

Get the list of streaming providers we have for a TV season.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\TVApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$series_id = 56; // int
$season_number = 56; // int
$language = 'en-US'; // string

try {
    $result = $apiInstance->tvSeasonWatchProviders($series_id, $season_number, $language);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling TVApi->tvSeasonWatchProviders: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **series_id** | **int**|  | |
| **season_number** | **int**|  | |
| **language** | **string**|  | [optional] [default to &#39;en-US&#39;] |

### Return type

[**\App\TmdbApi\Model\TvSeasonWatchProviders200Response**](../Model/TvSeasonWatchProviders200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `tvSeriesAccountStates()`

```php
tvSeriesAccountStates($series_id, $session_id, $guest_session_id): \App\TmdbApi\Model\MovieAccountStates200Response
```

Account States

Get the rating, watchlist and favourite status.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\TVApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$series_id = 56; // int
$session_id = 'session_id_example'; // string
$guest_session_id = 'guest_session_id_example'; // string

try {
    $result = $apiInstance->tvSeriesAccountStates($series_id, $session_id, $guest_session_id);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling TVApi->tvSeriesAccountStates: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **series_id** | **int**|  | |
| **session_id** | **string**|  | [optional] |
| **guest_session_id** | **string**|  | [optional] |

### Return type

[**\App\TmdbApi\Model\MovieAccountStates200Response**](../Model/MovieAccountStates200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `tvSeriesAddRating()`

```php
tvSeriesAddRating($series_id, $content_type, $guest_session_id, $session_id, $account_add_favorite_request): \App\TmdbApi\Model\AccountAddFavorite200Response
```

Add Rating

Rate a TV show and save it to your rated list.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\TVApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$series_id = 56; // int
$content_type = 'application/json;charset=utf-8'; // string
$guest_session_id = 'guest_session_id_example'; // string
$session_id = 'session_id_example'; // string
$account_add_favorite_request = {value=8.5}; // \App\TmdbApi\Model\AccountAddFavoriteRequest

try {
    $result = $apiInstance->tvSeriesAddRating($series_id, $content_type, $guest_session_id, $session_id, $account_add_favorite_request);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling TVApi->tvSeriesAddRating: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **series_id** | **int**|  | |
| **content_type** | **string**|  | [default to &#39;application/json;charset&#x3D;utf-8&#39;] |
| **guest_session_id** | **string**|  | [optional] |
| **session_id** | **string**|  | [optional] |
| **account_add_favorite_request** | [**\App\TmdbApi\Model\AccountAddFavoriteRequest**](../Model/AccountAddFavoriteRequest.md)|  | [optional] |

### Return type

[**\App\TmdbApi\Model\AccountAddFavorite200Response**](../Model/AccountAddFavorite200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `tvSeriesAggregateCredits()`

```php
tvSeriesAggregateCredits($series_id, $language): \App\TmdbApi\Model\TvSeriesAggregateCredits200Response
```

Aggregate Credits

Get the aggregate credits (cast and crew) that have been added to a TV show.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\TVApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$series_id = 56; // int
$language = 'en-US'; // string

try {
    $result = $apiInstance->tvSeriesAggregateCredits($series_id, $language);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling TVApi->tvSeriesAggregateCredits: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **series_id** | **int**|  | |
| **language** | **string**|  | [optional] [default to &#39;en-US&#39;] |

### Return type

[**\App\TmdbApi\Model\TvSeriesAggregateCredits200Response**](../Model/TvSeriesAggregateCredits200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `tvSeriesAiringTodayList()`

```php
tvSeriesAiringTodayList($language, $page, $timezone): \App\TmdbApi\Model\TvSeriesAiringTodayList200Response
```

Airing Today

Get a list of TV shows airing today.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\TVApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$language = 'en-US'; // string
$page = 1; // int
$timezone = 'timezone_example'; // string

try {
    $result = $apiInstance->tvSeriesAiringTodayList($language, $page, $timezone);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling TVApi->tvSeriesAiringTodayList: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **language** | **string**|  | [optional] [default to &#39;en-US&#39;] |
| **page** | **int**|  | [optional] [default to 1] |
| **timezone** | **string**|  | [optional] |

### Return type

[**\App\TmdbApi\Model\TvSeriesAiringTodayList200Response**](../Model/TvSeriesAiringTodayList200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `tvSeriesAlternativeTitles()`

```php
tvSeriesAlternativeTitles($series_id): \App\TmdbApi\Model\TvSeriesAlternativeTitles200Response
```

Alternative Titles

Get the alternative titles that have been added to a TV show.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\TVApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$series_id = 56; // int

try {
    $result = $apiInstance->tvSeriesAlternativeTitles($series_id);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling TVApi->tvSeriesAlternativeTitles: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **series_id** | **int**|  | |

### Return type

[**\App\TmdbApi\Model\TvSeriesAlternativeTitles200Response**](../Model/TvSeriesAlternativeTitles200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `tvSeriesChanges()`

```php
tvSeriesChanges($series_id, $end_date, $page, $start_date): \App\TmdbApi\Model\TvSeriesChanges200Response
```

Changes

Get the recent changes for a TV show.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\TVApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$series_id = 56; // int
$end_date = 'end_date_example'; // string
$page = 1; // int
$start_date = 'start_date_example'; // string

try {
    $result = $apiInstance->tvSeriesChanges($series_id, $end_date, $page, $start_date);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling TVApi->tvSeriesChanges: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **series_id** | **int**|  | |
| **end_date** | **string**|  | [optional] |
| **page** | **int**|  | [optional] [default to 1] |
| **start_date** | **string**|  | [optional] |

### Return type

[**\App\TmdbApi\Model\TvSeriesChanges200Response**](../Model/TvSeriesChanges200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `tvSeriesContentRatings()`

```php
tvSeriesContentRatings($series_id): \App\TmdbApi\Model\TvSeriesContentRatings200Response
```

Content Ratings

Get the content ratings that have been added to a TV show.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\TVApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$series_id = 56; // int

try {
    $result = $apiInstance->tvSeriesContentRatings($series_id);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling TVApi->tvSeriesContentRatings: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **series_id** | **int**|  | |

### Return type

[**\App\TmdbApi\Model\TvSeriesContentRatings200Response**](../Model/TvSeriesContentRatings200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `tvSeriesCredits()`

```php
tvSeriesCredits($series_id, $language): \App\TmdbApi\Model\TvSeriesCredits200Response
```

Credits

Get the latest season credits of a TV show.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\TVApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$series_id = 56; // int
$language = 'en-US'; // string

try {
    $result = $apiInstance->tvSeriesCredits($series_id, $language);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling TVApi->tvSeriesCredits: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **series_id** | **int**|  | |
| **language** | **string**|  | [optional] [default to &#39;en-US&#39;] |

### Return type

[**\App\TmdbApi\Model\TvSeriesCredits200Response**](../Model/TvSeriesCredits200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `tvSeriesDeleteRating()`

```php
tvSeriesDeleteRating($series_id, $content_type, $guest_session_id, $session_id): \App\TmdbApi\Model\ListRemoveMovie200Response
```

Delete Rating



### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\TVApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$series_id = 56; // int
$content_type = 'application/json;charset=utf-8'; // string
$guest_session_id = 'guest_session_id_example'; // string
$session_id = 'session_id_example'; // string

try {
    $result = $apiInstance->tvSeriesDeleteRating($series_id, $content_type, $guest_session_id, $session_id);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling TVApi->tvSeriesDeleteRating: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **series_id** | **int**|  | |
| **content_type** | **string**|  | [optional] [default to &#39;application/json;charset&#x3D;utf-8&#39;] |
| **guest_session_id** | **string**|  | [optional] |
| **session_id** | **string**|  | [optional] |

### Return type

[**\App\TmdbApi\Model\ListRemoveMovie200Response**](../Model/ListRemoveMovie200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `tvSeriesDetails()`

```php
tvSeriesDetails($series_id, $append_to_response, $language): \App\TmdbApi\Model\TvSeriesDetails200Response
```

Details

Get the details of a TV show.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\TVApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$series_id = 56; // int
$append_to_response = 'append_to_response_example'; // string | comma separated list of endpoints within this namespace, 20 items max
$language = 'en-US'; // string

try {
    $result = $apiInstance->tvSeriesDetails($series_id, $append_to_response, $language);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling TVApi->tvSeriesDetails: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **series_id** | **int**|  | |
| **append_to_response** | **string**| comma separated list of endpoints within this namespace, 20 items max | [optional] |
| **language** | **string**|  | [optional] [default to &#39;en-US&#39;] |

### Return type

[**\App\TmdbApi\Model\TvSeriesDetails200Response**](../Model/TvSeriesDetails200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `tvSeriesEpisodeGroups()`

```php
tvSeriesEpisodeGroups($series_id): \App\TmdbApi\Model\TvSeriesEpisodeGroups200Response
```

Episode Groups

Get the episode groups that have been added to a TV show.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\TVApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$series_id = 56; // int

try {
    $result = $apiInstance->tvSeriesEpisodeGroups($series_id);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling TVApi->tvSeriesEpisodeGroups: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **series_id** | **int**|  | |

### Return type

[**\App\TmdbApi\Model\TvSeriesEpisodeGroups200Response**](../Model/TvSeriesEpisodeGroups200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `tvSeriesExternalIds()`

```php
tvSeriesExternalIds($series_id): \App\TmdbApi\Model\TvSeriesExternalIds200Response
```

External IDs

Get a list of external IDs that have been added to a TV show.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\TVApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$series_id = 56; // int

try {
    $result = $apiInstance->tvSeriesExternalIds($series_id);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling TVApi->tvSeriesExternalIds: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **series_id** | **int**|  | |

### Return type

[**\App\TmdbApi\Model\TvSeriesExternalIds200Response**](../Model/TvSeriesExternalIds200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `tvSeriesImages()`

```php
tvSeriesImages($series_id, $include_image_language, $language): \App\TmdbApi\Model\MovieImages200Response
```

Images

Get the images that belong to a TV series.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\TVApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$series_id = 56; // int
$include_image_language = 'include_image_language_example'; // string | specify a comma separated list of ISO-639-1 values to query, for example: `en-US,null`
$language = 'language_example'; // string

try {
    $result = $apiInstance->tvSeriesImages($series_id, $include_image_language, $language);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling TVApi->tvSeriesImages: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **series_id** | **int**|  | |
| **include_image_language** | **string**| specify a comma separated list of ISO-639-1 values to query, for example: &#x60;en-US,null&#x60; | [optional] |
| **language** | **string**|  | [optional] |

### Return type

[**\App\TmdbApi\Model\MovieImages200Response**](../Model/MovieImages200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `tvSeriesKeywords()`

```php
tvSeriesKeywords($series_id): \App\TmdbApi\Model\TvSeriesKeywords200Response
```

Keywords

Get a list of keywords that have been added to a TV show.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\TVApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$series_id = 56; // int

try {
    $result = $apiInstance->tvSeriesKeywords($series_id);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling TVApi->tvSeriesKeywords: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **series_id** | **int**|  | |

### Return type

[**\App\TmdbApi\Model\TvSeriesKeywords200Response**](../Model/TvSeriesKeywords200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `tvSeriesLatestId()`

```php
tvSeriesLatestId(): \App\TmdbApi\Model\TvSeriesLatestId200Response
```

Latest

Get the newest TV show ID.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\TVApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);

try {
    $result = $apiInstance->tvSeriesLatestId();
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling TVApi->tvSeriesLatestId: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**\App\TmdbApi\Model\TvSeriesLatestId200Response**](../Model/TvSeriesLatestId200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `tvSeriesOnTheAirList()`

```php
tvSeriesOnTheAirList($language, $page, $timezone): \App\TmdbApi\Model\TvSeriesOnTheAirList200Response
```

On The Air

Get a list of TV shows that air in the next 7 days.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\TVApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$language = 'en-US'; // string
$page = 1; // int
$timezone = 'timezone_example'; // string

try {
    $result = $apiInstance->tvSeriesOnTheAirList($language, $page, $timezone);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling TVApi->tvSeriesOnTheAirList: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **language** | **string**|  | [optional] [default to &#39;en-US&#39;] |
| **page** | **int**|  | [optional] [default to 1] |
| **timezone** | **string**|  | [optional] |

### Return type

[**\App\TmdbApi\Model\TvSeriesOnTheAirList200Response**](../Model/TvSeriesOnTheAirList200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `tvSeriesPopularList()`

```php
tvSeriesPopularList($language, $page): \App\TmdbApi\Model\TvSeriesPopularList200Response
```

Popular

Get a list of TV shows ordered by popularity.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\TVApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$language = 'en-US'; // string
$page = 1; // int

try {
    $result = $apiInstance->tvSeriesPopularList($language, $page);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling TVApi->tvSeriesPopularList: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **language** | **string**|  | [optional] [default to &#39;en-US&#39;] |
| **page** | **int**|  | [optional] [default to 1] |

### Return type

[**\App\TmdbApi\Model\TvSeriesPopularList200Response**](../Model/TvSeriesPopularList200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `tvSeriesRecommendations()`

```php
tvSeriesRecommendations($series_id, $language, $page): \App\TmdbApi\Model\TvSeriesRecommendations200Response
```

Recommendations



### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\TVApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$series_id = 56; // int
$language = 'en-US'; // string
$page = 1; // int

try {
    $result = $apiInstance->tvSeriesRecommendations($series_id, $language, $page);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling TVApi->tvSeriesRecommendations: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **series_id** | **int**|  | |
| **language** | **string**|  | [optional] [default to &#39;en-US&#39;] |
| **page** | **int**|  | [optional] [default to 1] |

### Return type

[**\App\TmdbApi\Model\TvSeriesRecommendations200Response**](../Model/TvSeriesRecommendations200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `tvSeriesReviews()`

```php
tvSeriesReviews($series_id, $language, $page): \App\TmdbApi\Model\TvSeriesReviews200Response
```

Reviews

Get the reviews that have been added to a TV show.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\TVApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$series_id = 56; // int
$language = 'en-US'; // string
$page = 1; // int

try {
    $result = $apiInstance->tvSeriesReviews($series_id, $language, $page);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling TVApi->tvSeriesReviews: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **series_id** | **int**|  | |
| **language** | **string**|  | [optional] [default to &#39;en-US&#39;] |
| **page** | **int**|  | [optional] [default to 1] |

### Return type

[**\App\TmdbApi\Model\TvSeriesReviews200Response**](../Model/TvSeriesReviews200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `tvSeriesScreenedTheatrically()`

```php
tvSeriesScreenedTheatrically($series_id): \App\TmdbApi\Model\TvSeriesScreenedTheatrically200Response
```

Screened Theatrically

Get the seasons and episodes that have screened theatrically.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\TVApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$series_id = 56; // int

try {
    $result = $apiInstance->tvSeriesScreenedTheatrically($series_id);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling TVApi->tvSeriesScreenedTheatrically: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **series_id** | **int**|  | |

### Return type

[**\App\TmdbApi\Model\TvSeriesScreenedTheatrically200Response**](../Model/TvSeriesScreenedTheatrically200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `tvSeriesSimilar()`

```php
tvSeriesSimilar($series_id, $language, $page): \App\TmdbApi\Model\TvSeriesSimilar200Response
```

Similar

Get the similar TV shows.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\TVApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$series_id = 'series_id_example'; // string
$language = 'en-US'; // string
$page = 1; // int

try {
    $result = $apiInstance->tvSeriesSimilar($series_id, $language, $page);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling TVApi->tvSeriesSimilar: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **series_id** | **string**|  | |
| **language** | **string**|  | [optional] [default to &#39;en-US&#39;] |
| **page** | **int**|  | [optional] [default to 1] |

### Return type

[**\App\TmdbApi\Model\TvSeriesSimilar200Response**](../Model/TvSeriesSimilar200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `tvSeriesTopRatedList()`

```php
tvSeriesTopRatedList($language, $page): \App\TmdbApi\Model\TvSeriesTopRatedList200Response
```

Top Rated

Get a list of TV shows ordered by rating.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\TVApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$language = 'en-US'; // string
$page = 1; // int

try {
    $result = $apiInstance->tvSeriesTopRatedList($language, $page);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling TVApi->tvSeriesTopRatedList: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **language** | **string**|  | [optional] [default to &#39;en-US&#39;] |
| **page** | **int**|  | [optional] [default to 1] |

### Return type

[**\App\TmdbApi\Model\TvSeriesTopRatedList200Response**](../Model/TvSeriesTopRatedList200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `tvSeriesTranslations()`

```php
tvSeriesTranslations($series_id): \App\TmdbApi\Model\TvSeriesTranslations200Response
```

Translations

Get the translations that have been added to a TV show.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\TVApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$series_id = 56; // int

try {
    $result = $apiInstance->tvSeriesTranslations($series_id);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling TVApi->tvSeriesTranslations: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **series_id** | **int**|  | |

### Return type

[**\App\TmdbApi\Model\TvSeriesTranslations200Response**](../Model/TvSeriesTranslations200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `tvSeriesVideos()`

```php
tvSeriesVideos($series_id, $include_video_language, $language): \App\TmdbApi\Model\TvSeriesVideos200Response
```

Videos

Get the videos that belong to a TV show.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\TVApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$series_id = 56; // int
$include_video_language = 'include_video_language_example'; // string | filter the list results by language, supports more than one value by using a comma
$language = 'en-US'; // string

try {
    $result = $apiInstance->tvSeriesVideos($series_id, $include_video_language, $language);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling TVApi->tvSeriesVideos: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **series_id** | **int**|  | |
| **include_video_language** | **string**| filter the list results by language, supports more than one value by using a comma | [optional] |
| **language** | **string**|  | [optional] [default to &#39;en-US&#39;] |

### Return type

[**\App\TmdbApi\Model\TvSeriesVideos200Response**](../Model/TvSeriesVideos200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `tvSeriesWatchProviders()`

```php
tvSeriesWatchProviders($series_id): \App\TmdbApi\Model\TvSeriesWatchProviders200Response
```

Watch Providers

Get the list of streaming providers we have for a TV show.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\TVApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$series_id = 56; // int

try {
    $result = $apiInstance->tvSeriesWatchProviders($series_id);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling TVApi->tvSeriesWatchProviders: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **series_id** | **int**|  | |

### Return type

[**\App\TmdbApi\Model\TvSeriesWatchProviders200Response**](../Model/TvSeriesWatchProviders200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)
