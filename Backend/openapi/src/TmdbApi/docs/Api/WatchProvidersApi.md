# App\TmdbApi\WatchProvidersApi



All URIs are relative to https://api.themoviedb.org, except if the operation defines another base path.

| Method | HTTP request | Description |
| ------------- | ------------- | ------------- |
| [**watchProviderTvList()**](WatchProvidersApi.md#watchProviderTvList) | **GET** /3/watch/providers/tv | TV Providers |
| [**watchProvidersAvailableRegions()**](WatchProvidersApi.md#watchProvidersAvailableRegions) | **GET** /3/watch/providers/regions | Available Regions |
| [**watchProvidersMovieList()**](WatchProvidersApi.md#watchProvidersMovieList) | **GET** /3/watch/providers/movie | Movie Providers |


## `watchProviderTvList()`

```php
watchProviderTvList($language, $watch_region): \App\TmdbApi\Model\WatchProvidersMovieList200Response
```

TV Providers

Get the list of streaming providers we have for TV shows.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\WatchProvidersApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$language = 'en-US'; // string
$watch_region = 'watch_region_example'; // string

try {
    $result = $apiInstance->watchProviderTvList($language, $watch_region);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling WatchProvidersApi->watchProviderTvList: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **language** | **string**|  | [optional] [default to &#39;en-US&#39;] |
| **watch_region** | **string**|  | [optional] |

### Return type

[**\App\TmdbApi\Model\WatchProvidersMovieList200Response**](../Model/WatchProvidersMovieList200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `watchProvidersAvailableRegions()`

```php
watchProvidersAvailableRegions($language): \App\TmdbApi\Model\WatchProvidersAvailableRegions200Response
```

Available Regions

Get the list of the countries we have watch provider (OTT/streaming) data for.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\WatchProvidersApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$language = 'en-US'; // string

try {
    $result = $apiInstance->watchProvidersAvailableRegions($language);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling WatchProvidersApi->watchProvidersAvailableRegions: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **language** | **string**|  | [optional] [default to &#39;en-US&#39;] |

### Return type

[**\App\TmdbApi\Model\WatchProvidersAvailableRegions200Response**](../Model/WatchProvidersAvailableRegions200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `watchProvidersMovieList()`

```php
watchProvidersMovieList($language, $watch_region): \App\TmdbApi\Model\WatchProvidersMovieList200Response
```

Movie Providers

Get the list of streaming providers we have for movies.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\WatchProvidersApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$language = 'en-US'; // string
$watch_region = 'watch_region_example'; // string

try {
    $result = $apiInstance->watchProvidersMovieList($language, $watch_region);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling WatchProvidersApi->watchProvidersMovieList: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **language** | **string**|  | [optional] [default to &#39;en-US&#39;] |
| **watch_region** | **string**|  | [optional] |

### Return type

[**\App\TmdbApi\Model\WatchProvidersMovieList200Response**](../Model/WatchProvidersMovieList200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)
