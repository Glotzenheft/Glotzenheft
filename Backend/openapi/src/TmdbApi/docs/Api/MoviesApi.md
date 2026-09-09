# App\TmdbApi\MoviesApi



All URIs are relative to https://api.themoviedb.org, except if the operation defines another base path.

| Method | HTTP request | Description |
| ------------- | ------------- | ------------- |
| [**changesMovieList()**](MoviesApi.md#changesMovieList) | **GET** /3/movie/changes | Movie List |
| [**movieAccountStates()**](MoviesApi.md#movieAccountStates) | **GET** /3/movie/{movie_id}/account_states | Account States |
| [**movieAddRating()**](MoviesApi.md#movieAddRating) | **POST** /3/movie/{movie_id}/rating | Add Rating |
| [**movieAlternativeTitles()**](MoviesApi.md#movieAlternativeTitles) | **GET** /3/movie/{movie_id}/alternative_titles | Alternative Titles |
| [**movieChanges()**](MoviesApi.md#movieChanges) | **GET** /3/movie/{movie_id}/changes | Changes |
| [**movieCredits()**](MoviesApi.md#movieCredits) | **GET** /3/movie/{movie_id}/credits | Credits |
| [**movieDeleteRating()**](MoviesApi.md#movieDeleteRating) | **DELETE** /3/movie/{movie_id}/rating | Delete Rating |
| [**movieDetails()**](MoviesApi.md#movieDetails) | **GET** /3/movie/{movie_id} | Details |
| [**movieExternalIds()**](MoviesApi.md#movieExternalIds) | **GET** /3/movie/{movie_id}/external_ids | External IDs |
| [**movieImages()**](MoviesApi.md#movieImages) | **GET** /3/movie/{movie_id}/images | Images |
| [**movieKeywords()**](MoviesApi.md#movieKeywords) | **GET** /3/movie/{movie_id}/keywords | Keywords |
| [**movieLatestId()**](MoviesApi.md#movieLatestId) | **GET** /3/movie/latest | Latest |
| [**movieLists()**](MoviesApi.md#movieLists) | **GET** /3/movie/{movie_id}/lists | Lists |
| [**movieNowPlayingList()**](MoviesApi.md#movieNowPlayingList) | **GET** /3/movie/now_playing | Now Playing |
| [**moviePopularList()**](MoviesApi.md#moviePopularList) | **GET** /3/movie/popular | Popular |
| [**movieRecommendations()**](MoviesApi.md#movieRecommendations) | **GET** /3/movie/{movie_id}/recommendations | Recommendations |
| [**movieReleaseDates()**](MoviesApi.md#movieReleaseDates) | **GET** /3/movie/{movie_id}/release_dates | Release Dates |
| [**movieReviews()**](MoviesApi.md#movieReviews) | **GET** /3/movie/{movie_id}/reviews | Reviews |
| [**movieSimilar()**](MoviesApi.md#movieSimilar) | **GET** /3/movie/{movie_id}/similar | Similar |
| [**movieTopRatedList()**](MoviesApi.md#movieTopRatedList) | **GET** /3/movie/top_rated | Top Rated |
| [**movieTranslations()**](MoviesApi.md#movieTranslations) | **GET** /3/movie/{movie_id}/translations | Translations |
| [**movieUpcomingList()**](MoviesApi.md#movieUpcomingList) | **GET** /3/movie/upcoming | Upcoming |
| [**movieVideos()**](MoviesApi.md#movieVideos) | **GET** /3/movie/{movie_id}/videos | Videos |
| [**movieWatchProviders()**](MoviesApi.md#movieWatchProviders) | **GET** /3/movie/{movie_id}/watch/providers | Watch Providers |


## `changesMovieList()`

```php
changesMovieList($end_date, $page, $start_date): \App\TmdbApi\Model\ChangesMovieList200Response
```

Movie List

Get a list of all of the movie ids that have been changed in the past 24 hours.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\MoviesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$end_date = new \DateTime('2013-10-20T19:20:30+01:00'); // \DateTime
$page = 1; // int
$start_date = new \DateTime('2013-10-20T19:20:30+01:00'); // \DateTime

try {
    $result = $apiInstance->changesMovieList($end_date, $page, $start_date);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling MoviesApi->changesMovieList: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **end_date** | **\DateTime**|  | [optional] |
| **page** | **int**|  | [optional] [default to 1] |
| **start_date** | **\DateTime**|  | [optional] |

### Return type

[**\App\TmdbApi\Model\ChangesMovieList200Response**](../Model/ChangesMovieList200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `movieAccountStates()`

```php
movieAccountStates($movie_id, $session_id, $guest_session_id): \App\TmdbApi\Model\MovieAccountStates200Response
```

Account States

Get the rating, watchlist and favourite status of an account.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\MoviesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$movie_id = 56; // int
$session_id = 'session_id_example'; // string
$guest_session_id = 'guest_session_id_example'; // string

try {
    $result = $apiInstance->movieAccountStates($movie_id, $session_id, $guest_session_id);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling MoviesApi->movieAccountStates: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **movie_id** | **int**|  | |
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

## `movieAddRating()`

```php
movieAddRating($movie_id, $content_type, $guest_session_id, $session_id, $account_add_favorite_request): \App\TmdbApi\Model\AccountAddFavorite200Response
```

Add Rating

Rate a movie and save it to your rated list.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\MoviesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$movie_id = 56; // int
$content_type = 'application/json;charset=utf-8'; // string
$guest_session_id = 'guest_session_id_example'; // string
$session_id = 'session_id_example'; // string
$account_add_favorite_request = {"value":8.5}; // \App\TmdbApi\Model\AccountAddFavoriteRequest

try {
    $result = $apiInstance->movieAddRating($movie_id, $content_type, $guest_session_id, $session_id, $account_add_favorite_request);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling MoviesApi->movieAddRating: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **movie_id** | **int**|  | |
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

## `movieAlternativeTitles()`

```php
movieAlternativeTitles($movie_id, $country): \App\TmdbApi\Model\MovieAlternativeTitles200Response
```

Alternative Titles

Get the alternative titles for a movie.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\MoviesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$movie_id = 56; // int
$country = 'country_example'; // string | specify a ISO-3166-1 value to filter the results

try {
    $result = $apiInstance->movieAlternativeTitles($movie_id, $country);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling MoviesApi->movieAlternativeTitles: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **movie_id** | **int**|  | |
| **country** | **string**| specify a ISO-3166-1 value to filter the results | [optional] |

### Return type

[**\App\TmdbApi\Model\MovieAlternativeTitles200Response**](../Model/MovieAlternativeTitles200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `movieChanges()`

```php
movieChanges($movie_id, $end_date, $page, $start_date): \App\TmdbApi\Model\MovieChanges200Response
```

Changes

Get the recent changes for a movie.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\MoviesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$movie_id = 56; // int
$end_date = new \DateTime('2013-10-20T19:20:30+01:00'); // \DateTime
$page = 1; // int
$start_date = new \DateTime('2013-10-20T19:20:30+01:00'); // \DateTime

try {
    $result = $apiInstance->movieChanges($movie_id, $end_date, $page, $start_date);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling MoviesApi->movieChanges: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **movie_id** | **int**|  | |
| **end_date** | **\DateTime**|  | [optional] |
| **page** | **int**|  | [optional] [default to 1] |
| **start_date** | **\DateTime**|  | [optional] |

### Return type

[**\App\TmdbApi\Model\MovieChanges200Response**](../Model/MovieChanges200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `movieCredits()`

```php
movieCredits($movie_id, $language): \App\TmdbApi\Model\MovieCredits200Response
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


$apiInstance = new App\TmdbApi\Api\MoviesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$movie_id = 56; // int
$language = 'en-US'; // string

try {
    $result = $apiInstance->movieCredits($movie_id, $language);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling MoviesApi->movieCredits: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **movie_id** | **int**|  | |
| **language** | **string**|  | [optional] [default to &#39;en-US&#39;] |

### Return type

[**\App\TmdbApi\Model\MovieCredits200Response**](../Model/MovieCredits200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `movieDeleteRating()`

```php
movieDeleteRating($movie_id, $content_type, $guest_session_id, $session_id): \App\TmdbApi\Model\ListRemoveMovie200Response
```

Delete Rating

Delete a user rating.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\MoviesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$movie_id = 56; // int
$content_type = 'application/json;charset=utf-8'; // string
$guest_session_id = 'guest_session_id_example'; // string
$session_id = 'session_id_example'; // string

try {
    $result = $apiInstance->movieDeleteRating($movie_id, $content_type, $guest_session_id, $session_id);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling MoviesApi->movieDeleteRating: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **movie_id** | **int**|  | |
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

## `movieDetails()`

```php
movieDetails($movie_id, $append_to_response, $language): \App\TmdbApi\Model\MovieDetails200Response
```

Details

Get the top level details of a movie by ID.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\MoviesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$movie_id = 56; // int
$append_to_response = 'append_to_response_example'; // string | comma separated list of endpoints within this namespace, 20 items max
$language = 'en-US'; // string

try {
    $result = $apiInstance->movieDetails($movie_id, $append_to_response, $language);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling MoviesApi->movieDetails: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **movie_id** | **int**|  | |
| **append_to_response** | **string**| comma separated list of endpoints within this namespace, 20 items max | [optional] |
| **language** | **string**|  | [optional] [default to &#39;en-US&#39;] |

### Return type

[**\App\TmdbApi\Model\MovieDetails200Response**](../Model/MovieDetails200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `movieExternalIds()`

```php
movieExternalIds($movie_id): \App\TmdbApi\Model\MovieExternalIds200Response
```

External IDs



### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\MoviesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$movie_id = 56; // int

try {
    $result = $apiInstance->movieExternalIds($movie_id);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling MoviesApi->movieExternalIds: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **movie_id** | **int**|  | |

### Return type

[**\App\TmdbApi\Model\MovieExternalIds200Response**](../Model/MovieExternalIds200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `movieImages()`

```php
movieImages($movie_id, $include_image_language, $language): \App\TmdbApi\Model\MovieImages200Response
```

Images

Get the images that belong to a movie.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\MoviesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$movie_id = 56; // int
$include_image_language = 'include_image_language_example'; // string | specify a comma separated list of ISO-639-1 values to query, for example: `en-US,null`
$language = 'language_example'; // string

try {
    $result = $apiInstance->movieImages($movie_id, $include_image_language, $language);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling MoviesApi->movieImages: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **movie_id** | **int**|  | |
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

## `movieKeywords()`

```php
movieKeywords($movie_id): \App\TmdbApi\Model\MovieKeywords200Response
```

Keywords



### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\MoviesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$movie_id = 'movie_id_example'; // string

try {
    $result = $apiInstance->movieKeywords($movie_id);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling MoviesApi->movieKeywords: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **movie_id** | **string**|  | |

### Return type

[**\App\TmdbApi\Model\MovieKeywords200Response**](../Model/MovieKeywords200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `movieLatestId()`

```php
movieLatestId(): \App\TmdbApi\Model\MovieLatestId200Response
```

Latest

Get the newest movie ID.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\MoviesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);

try {
    $result = $apiInstance->movieLatestId();
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling MoviesApi->movieLatestId: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**\App\TmdbApi\Model\MovieLatestId200Response**](../Model/MovieLatestId200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `movieLists()`

```php
movieLists($movie_id, $language, $page): \App\TmdbApi\Model\MovieLists200Response
```

Lists

Get the lists that a movie has been added to.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\MoviesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$movie_id = 56; // int
$language = 'en-US'; // string
$page = 1; // int

try {
    $result = $apiInstance->movieLists($movie_id, $language, $page);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling MoviesApi->movieLists: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **movie_id** | **int**|  | |
| **language** | **string**|  | [optional] [default to &#39;en-US&#39;] |
| **page** | **int**|  | [optional] [default to 1] |

### Return type

[**\App\TmdbApi\Model\MovieLists200Response**](../Model/MovieLists200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `movieNowPlayingList()`

```php
movieNowPlayingList($language, $page, $region): \App\TmdbApi\Model\MovieNowPlayingList200Response
```

Now Playing

Get a list of movies that are currently in theatres.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\MoviesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$language = 'en-US'; // string
$page = 1; // int
$region = 'region_example'; // string | ISO-3166-1 code

try {
    $result = $apiInstance->movieNowPlayingList($language, $page, $region);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling MoviesApi->movieNowPlayingList: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **language** | **string**|  | [optional] [default to &#39;en-US&#39;] |
| **page** | **int**|  | [optional] [default to 1] |
| **region** | **string**| ISO-3166-1 code | [optional] |

### Return type

[**\App\TmdbApi\Model\MovieNowPlayingList200Response**](../Model/MovieNowPlayingList200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `moviePopularList()`

```php
moviePopularList($language, $page, $region): \App\TmdbApi\Model\MoviePopularList200Response
```

Popular

Get a list of movies ordered by popularity.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\MoviesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$language = 'en-US'; // string
$page = 1; // int
$region = 'region_example'; // string | ISO-3166-1 code

try {
    $result = $apiInstance->moviePopularList($language, $page, $region);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling MoviesApi->moviePopularList: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **language** | **string**|  | [optional] [default to &#39;en-US&#39;] |
| **page** | **int**|  | [optional] [default to 1] |
| **region** | **string**| ISO-3166-1 code | [optional] |

### Return type

[**\App\TmdbApi\Model\MoviePopularList200Response**](../Model/MoviePopularList200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `movieRecommendations()`

```php
movieRecommendations($movie_id, $language, $page): \App\TmdbApi\Model\MovieRecommendations200Response
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


$apiInstance = new App\TmdbApi\Api\MoviesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$movie_id = 56; // int
$language = 'en-US'; // string
$page = 1; // int

try {
    $result = $apiInstance->movieRecommendations($movie_id, $language, $page);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling MoviesApi->movieRecommendations: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **movie_id** | **int**|  | |
| **language** | **string**|  | [optional] [default to &#39;en-US&#39;] |
| **page** | **int**|  | [optional] [default to 1] |

### Return type

[**\App\TmdbApi\Model\MovieRecommendations200Response**](../Model/MovieRecommendations200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `movieReleaseDates()`

```php
movieReleaseDates($movie_id): \App\TmdbApi\Model\MovieReleaseDates200Response
```

Release Dates

Get the release dates and certifications for a movie.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\MoviesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$movie_id = 56; // int

try {
    $result = $apiInstance->movieReleaseDates($movie_id);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling MoviesApi->movieReleaseDates: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **movie_id** | **int**|  | |

### Return type

[**\App\TmdbApi\Model\MovieReleaseDates200Response**](../Model/MovieReleaseDates200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `movieReviews()`

```php
movieReviews($movie_id, $language, $page): \App\TmdbApi\Model\MovieReviews200Response
```

Reviews

Get the user reviews for a movie.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\MoviesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$movie_id = 56; // int
$language = 'en-US'; // string
$page = 1; // int

try {
    $result = $apiInstance->movieReviews($movie_id, $language, $page);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling MoviesApi->movieReviews: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **movie_id** | **int**|  | |
| **language** | **string**|  | [optional] [default to &#39;en-US&#39;] |
| **page** | **int**|  | [optional] [default to 1] |

### Return type

[**\App\TmdbApi\Model\MovieReviews200Response**](../Model/MovieReviews200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `movieSimilar()`

```php
movieSimilar($movie_id, $language, $page): \App\TmdbApi\Model\MovieSimilar200Response
```

Similar

Get the similar movies based on genres and keywords.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\MoviesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$movie_id = 56; // int
$language = 'en-US'; // string
$page = 1; // int

try {
    $result = $apiInstance->movieSimilar($movie_id, $language, $page);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling MoviesApi->movieSimilar: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **movie_id** | **int**|  | |
| **language** | **string**|  | [optional] [default to &#39;en-US&#39;] |
| **page** | **int**|  | [optional] [default to 1] |

### Return type

[**\App\TmdbApi\Model\MovieSimilar200Response**](../Model/MovieSimilar200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `movieTopRatedList()`

```php
movieTopRatedList($language, $page, $region): \App\TmdbApi\Model\MovieTopRatedList200Response
```

Top Rated

Get a list of movies ordered by rating.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\MoviesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$language = 'en-US'; // string
$page = 1; // int
$region = 'region_example'; // string | ISO-3166-1 code

try {
    $result = $apiInstance->movieTopRatedList($language, $page, $region);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling MoviesApi->movieTopRatedList: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **language** | **string**|  | [optional] [default to &#39;en-US&#39;] |
| **page** | **int**|  | [optional] [default to 1] |
| **region** | **string**| ISO-3166-1 code | [optional] |

### Return type

[**\App\TmdbApi\Model\MovieTopRatedList200Response**](../Model/MovieTopRatedList200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `movieTranslations()`

```php
movieTranslations($movie_id): \App\TmdbApi\Model\MovieTranslations200Response
```

Translations

Get the translations for a movie.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\MoviesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$movie_id = 56; // int

try {
    $result = $apiInstance->movieTranslations($movie_id);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling MoviesApi->movieTranslations: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **movie_id** | **int**|  | |

### Return type

[**\App\TmdbApi\Model\MovieTranslations200Response**](../Model/MovieTranslations200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `movieUpcomingList()`

```php
movieUpcomingList($language, $page, $region): \App\TmdbApi\Model\MovieUpcomingList200Response
```

Upcoming

Get a list of movies that are being released soon.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\MoviesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$language = 'en-US'; // string
$page = 1; // int
$region = 'region_example'; // string | ISO-3166-1 code

try {
    $result = $apiInstance->movieUpcomingList($language, $page, $region);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling MoviesApi->movieUpcomingList: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **language** | **string**|  | [optional] [default to &#39;en-US&#39;] |
| **page** | **int**|  | [optional] [default to 1] |
| **region** | **string**| ISO-3166-1 code | [optional] |

### Return type

[**\App\TmdbApi\Model\MovieUpcomingList200Response**](../Model/MovieUpcomingList200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `movieVideos()`

```php
movieVideos($movie_id, $language): \App\TmdbApi\Model\MovieVideos200Response
```

Videos



### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\MoviesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$movie_id = 56; // int
$language = 'en-US'; // string

try {
    $result = $apiInstance->movieVideos($movie_id, $language);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling MoviesApi->movieVideos: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **movie_id** | **int**|  | |
| **language** | **string**|  | [optional] [default to &#39;en-US&#39;] |

### Return type

[**\App\TmdbApi\Model\MovieVideos200Response**](../Model/MovieVideos200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `movieWatchProviders()`

```php
movieWatchProviders($movie_id): \App\TmdbApi\Model\MovieWatchProviders200Response
```

Watch Providers

Get the list of streaming providers we have for a movie.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\MoviesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$movie_id = 56; // int

try {
    $result = $apiInstance->movieWatchProviders($movie_id);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling MoviesApi->movieWatchProviders: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **movie_id** | **int**|  | |

### Return type

[**\App\TmdbApi\Model\MovieWatchProviders200Response**](../Model/MovieWatchProviders200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)
