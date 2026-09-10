# App\TmdbApi\AccountApi



All URIs are relative to https://api.themoviedb.org, except if the operation defines another base path.

| Method | HTTP request | Description |
| ------------- | ------------- | ------------- |
| [**accountAddFavorite()**](AccountApi.md#accountAddFavorite) | **POST** /3/account/{account_id}/favorite | Add Favorite |
| [**accountAddToWatchlist()**](AccountApi.md#accountAddToWatchlist) | **POST** /3/account/{account_id}/watchlist | Add To Watchlist |
| [**accountDetails()**](AccountApi.md#accountDetails) | **GET** /3/account/{account_id} | Details |
| [**accountFavoriteTv()**](AccountApi.md#accountFavoriteTv) | **GET** /3/account/{account_id}/favorite/tv | Favorite TV |
| [**accountGetFavorites()**](AccountApi.md#accountGetFavorites) | **GET** /3/account/{account_id}/favorite/movies | Favorite Movies |
| [**accountLists()**](AccountApi.md#accountLists) | **GET** /3/account/{account_id}/lists | Lists |
| [**accountRatedMovies()**](AccountApi.md#accountRatedMovies) | **GET** /3/account/{account_id}/rated/movies | Rated Movies |
| [**accountRatedTv()**](AccountApi.md#accountRatedTv) | **GET** /3/account/{account_id}/rated/tv | Rated TV |
| [**accountRatedTvEpisodes()**](AccountApi.md#accountRatedTvEpisodes) | **GET** /3/account/{account_id}/rated/tv/episodes | Rated TV Episodes |
| [**accountWatchlistMovies()**](AccountApi.md#accountWatchlistMovies) | **GET** /3/account/{account_id}/watchlist/movies | Watchlist Movies |
| [**accountWatchlistTv()**](AccountApi.md#accountWatchlistTv) | **GET** /3/account/{account_id}/watchlist/tv | Watchlist TV |


## `accountAddFavorite()`

```php
accountAddFavorite($account_id, $session_id, $account_add_favorite_request): \App\TmdbApi\Model\AccountAddFavorite200Response
```

Add Favorite

Mark a movie or TV show as a favourite.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\AccountApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$account_id = 56; // int
$session_id = 'session_id_example'; // string
$account_add_favorite_request = {"media_type":"movie","media_id":550,"favorite":true}; // \App\TmdbApi\Model\AccountAddFavoriteRequest

try {
    $result = $apiInstance->accountAddFavorite($account_id, $session_id, $account_add_favorite_request);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling AccountApi->accountAddFavorite: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **account_id** | **int**|  | |
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

## `accountAddToWatchlist()`

```php
accountAddToWatchlist($account_id, $session_id, $account_add_favorite_request): \App\TmdbApi\Model\AccountAddFavorite200Response
```

Add To Watchlist

Add a movie or TV show to your watchlist.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\AccountApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$account_id = 56; // int
$session_id = 'session_id_example'; // string
$account_add_favorite_request = {"media_type":"movie","media_id":11,"watchlist":true}; // \App\TmdbApi\Model\AccountAddFavoriteRequest

try {
    $result = $apiInstance->accountAddToWatchlist($account_id, $session_id, $account_add_favorite_request);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling AccountApi->accountAddToWatchlist: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **account_id** | **int**|  | |
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

## `accountDetails()`

```php
accountDetails($account_id, $session_id): \App\TmdbApi\Model\AccountDetails200Response
```

Details

Get the public details of an account on TMDB.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\AccountApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$account_id = null; // int
$session_id = 'session_id_example'; // string

try {
    $result = $apiInstance->accountDetails($account_id, $session_id);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling AccountApi->accountDetails: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **account_id** | **int**|  | [default to null] |
| **session_id** | **string**|  | [optional] |

### Return type

[**\App\TmdbApi\Model\AccountDetails200Response**](../Model/AccountDetails200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `accountFavoriteTv()`

```php
accountFavoriteTv($account_id, $language, $page, $session_id, $sort_by): \App\TmdbApi\Model\AccountFavoriteTv200Response
```

Favorite TV

Get a users list of favourite TV shows.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\AccountApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$account_id = 56; // int
$language = 'en-US'; // string
$page = 1; // int
$session_id = 'session_id_example'; // string
$sort_by = 'created_at.asc'; // string

try {
    $result = $apiInstance->accountFavoriteTv($account_id, $language, $page, $session_id, $sort_by);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling AccountApi->accountFavoriteTv: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **account_id** | **int**|  | |
| **language** | **string**|  | [optional] [default to &#39;en-US&#39;] |
| **page** | **int**|  | [optional] [default to 1] |
| **session_id** | **string**|  | [optional] |
| **sort_by** | **string**|  | [optional] [default to &#39;created_at.asc&#39;] |

### Return type

[**\App\TmdbApi\Model\AccountFavoriteTv200Response**](../Model/AccountFavoriteTv200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `accountGetFavorites()`

```php
accountGetFavorites($account_id, $language, $page, $session_id, $sort_by): \App\TmdbApi\Model\AccountGetFavorites200Response
```

Favorite Movies

Get a users list of favourite movies.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\AccountApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$account_id = 56; // int
$language = 'en-US'; // string
$page = 1; // int
$session_id = 'session_id_example'; // string
$sort_by = 'created_at.asc'; // string

try {
    $result = $apiInstance->accountGetFavorites($account_id, $language, $page, $session_id, $sort_by);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling AccountApi->accountGetFavorites: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **account_id** | **int**|  | |
| **language** | **string**|  | [optional] [default to &#39;en-US&#39;] |
| **page** | **int**|  | [optional] [default to 1] |
| **session_id** | **string**|  | [optional] |
| **sort_by** | **string**|  | [optional] [default to &#39;created_at.asc&#39;] |

### Return type

[**\App\TmdbApi\Model\AccountGetFavorites200Response**](../Model/AccountGetFavorites200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `accountLists()`

```php
accountLists($account_id, $page, $session_id): \App\TmdbApi\Model\AccountLists200Response
```

Lists

Get a users list of custom lists.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\AccountApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$account_id = 56; // int
$page = 1; // int
$session_id = 'session_id_example'; // string

try {
    $result = $apiInstance->accountLists($account_id, $page, $session_id);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling AccountApi->accountLists: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **account_id** | **int**|  | |
| **page** | **int**|  | [optional] [default to 1] |
| **session_id** | **string**|  | [optional] |

### Return type

[**\App\TmdbApi\Model\AccountLists200Response**](../Model/AccountLists200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `accountRatedMovies()`

```php
accountRatedMovies($account_id, $language, $page, $session_id, $sort_by): \App\TmdbApi\Model\AccountRatedMovies200Response
```

Rated Movies

Get a users list of rated movies.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\AccountApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$account_id = 56; // int
$language = 'en-US'; // string
$page = 1; // int
$session_id = 'session_id_example'; // string
$sort_by = 'created_at.asc'; // string

try {
    $result = $apiInstance->accountRatedMovies($account_id, $language, $page, $session_id, $sort_by);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling AccountApi->accountRatedMovies: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **account_id** | **int**|  | |
| **language** | **string**|  | [optional] [default to &#39;en-US&#39;] |
| **page** | **int**|  | [optional] [default to 1] |
| **session_id** | **string**|  | [optional] |
| **sort_by** | **string**|  | [optional] [default to &#39;created_at.asc&#39;] |

### Return type

[**\App\TmdbApi\Model\AccountRatedMovies200Response**](../Model/AccountRatedMovies200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `accountRatedTv()`

```php
accountRatedTv($account_id, $language, $page, $session_id, $sort_by): \App\TmdbApi\Model\AccountRatedTv200Response
```

Rated TV

Get a users list of rated TV shows.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\AccountApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$account_id = 56; // int
$language = 'en-US'; // string
$page = 1; // int
$session_id = 'session_id_example'; // string
$sort_by = 'created_at.asc'; // string

try {
    $result = $apiInstance->accountRatedTv($account_id, $language, $page, $session_id, $sort_by);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling AccountApi->accountRatedTv: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **account_id** | **int**|  | |
| **language** | **string**|  | [optional] [default to &#39;en-US&#39;] |
| **page** | **int**|  | [optional] [default to 1] |
| **session_id** | **string**|  | [optional] |
| **sort_by** | **string**|  | [optional] [default to &#39;created_at.asc&#39;] |

### Return type

[**\App\TmdbApi\Model\AccountRatedTv200Response**](../Model/AccountRatedTv200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `accountRatedTvEpisodes()`

```php
accountRatedTvEpisodes($account_id, $language, $page, $session_id, $sort_by): \App\TmdbApi\Model\AccountRatedTvEpisodes200Response
```

Rated TV Episodes

Get a users list of rated TV episodes.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\AccountApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$account_id = 56; // int
$language = 'en-US'; // string
$page = 1; // int
$session_id = 'session_id_example'; // string
$sort_by = 'created_at.asc'; // string

try {
    $result = $apiInstance->accountRatedTvEpisodes($account_id, $language, $page, $session_id, $sort_by);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling AccountApi->accountRatedTvEpisodes: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **account_id** | **int**|  | |
| **language** | **string**|  | [optional] [default to &#39;en-US&#39;] |
| **page** | **int**|  | [optional] [default to 1] |
| **session_id** | **string**|  | [optional] |
| **sort_by** | **string**|  | [optional] [default to &#39;created_at.asc&#39;] |

### Return type

[**\App\TmdbApi\Model\AccountRatedTvEpisodes200Response**](../Model/AccountRatedTvEpisodes200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `accountWatchlistMovies()`

```php
accountWatchlistMovies($account_id, $language, $page, $session_id, $sort_by): \App\TmdbApi\Model\AccountWatchlistMovies200Response
```

Watchlist Movies

Get a list of movies added to a users watchlist.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\AccountApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$account_id = 56; // int
$language = 'en-US'; // string
$page = 1; // int
$session_id = 'session_id_example'; // string
$sort_by = 'created_at.asc'; // string

try {
    $result = $apiInstance->accountWatchlistMovies($account_id, $language, $page, $session_id, $sort_by);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling AccountApi->accountWatchlistMovies: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **account_id** | **int**|  | |
| **language** | **string**|  | [optional] [default to &#39;en-US&#39;] |
| **page** | **int**|  | [optional] [default to 1] |
| **session_id** | **string**|  | [optional] |
| **sort_by** | **string**|  | [optional] [default to &#39;created_at.asc&#39;] |

### Return type

[**\App\TmdbApi\Model\AccountWatchlistMovies200Response**](../Model/AccountWatchlistMovies200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `accountWatchlistTv()`

```php
accountWatchlistTv($account_id, $language, $page, $session_id, $sort_by): \App\TmdbApi\Model\AccountWatchlistTv200Response
```

Watchlist TV

Get a list of TV shows added to a users watchlist.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\AccountApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$account_id = 56; // int
$language = 'en-US'; // string
$page = 1; // int
$session_id = 'session_id_example'; // string
$sort_by = 'created_at.asc'; // string

try {
    $result = $apiInstance->accountWatchlistTv($account_id, $language, $page, $session_id, $sort_by);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling AccountApi->accountWatchlistTv: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **account_id** | **int**|  | |
| **language** | **string**|  | [optional] [default to &#39;en-US&#39;] |
| **page** | **int**|  | [optional] [default to 1] |
| **session_id** | **string**|  | [optional] |
| **sort_by** | **string**|  | [optional] [default to &#39;created_at.asc&#39;] |

### Return type

[**\App\TmdbApi\Model\AccountWatchlistTv200Response**](../Model/AccountWatchlistTv200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)
