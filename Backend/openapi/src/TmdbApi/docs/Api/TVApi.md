# App\TmdbApi\TVApi

All URIs are relative to https://api.themoviedb.org, except if the operation defines another base path.

| Method | HTTP request | Description |
| ------------- | ------------- | ------------- |
| [**tvEpisodeDetails()**](TVApi.md#tvEpisodeDetails) | **GET** /3/tv/{series_id}/season/{season_number}/episode/{episode_number} | Details |
| [**tvSeasonDetails()**](TVApi.md#tvSeasonDetails) | **GET** /3/tv/{series_id}/season/{season_number} | Details |
| [**tvSeriesDetails()**](TVApi.md#tvSeriesDetails) | **GET** /3/tv/{series_id} | Details |


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
