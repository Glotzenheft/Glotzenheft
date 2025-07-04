# App\TmdbApi\TrendingApi

All URIs are relative to https://api.themoviedb.org, except if the operation defines another base path.

| Method | HTTP request | Description |
| ------------- | ------------- | ------------- |
| [**trendingAll()**](TrendingApi.md#trendingAll) | **GET** /3/trending/all/{time_window} | All |
| [**trendingMovies()**](TrendingApi.md#trendingMovies) | **GET** /3/trending/movie/{time_window} | Movies |
| [**trendingTv()**](TrendingApi.md#trendingTv) | **GET** /3/trending/tv/{time_window} | TV |


## `trendingAll()`

```php
trendingAll($time_window, $language): \App\TmdbApi\Model\TrendingAll200Response
```

All

Get the trending movies, TV shows and people.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\TrendingApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$time_window = 'day'; // string
$language = 'en-US'; // string | `ISO-639-1`-`ISO-3166-1` code

try {
    $result = $apiInstance->trendingAll($time_window, $language);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling TrendingApi->trendingAll: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **time_window** | **string**|  | [default to &#39;day&#39;] |
| **language** | **string**| &#x60;ISO-639-1&#x60;-&#x60;ISO-3166-1&#x60; code | [optional] [default to &#39;en-US&#39;] |

### Return type

[**\App\TmdbApi\Model\TrendingAll200Response**](../Model/TrendingAll200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `trendingMovies()`

```php
trendingMovies($time_window, $language): \App\TmdbApi\Model\TrendingAll200Response
```

Movies

Get the trending movies on TMDB.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\TrendingApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$time_window = 'day'; // string
$language = 'en-US'; // string | `ISO-639-1`-`ISO-3166-1` code

try {
    $result = $apiInstance->trendingMovies($time_window, $language);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling TrendingApi->trendingMovies: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **time_window** | **string**|  | [default to &#39;day&#39;] |
| **language** | **string**| &#x60;ISO-639-1&#x60;-&#x60;ISO-3166-1&#x60; code | [optional] [default to &#39;en-US&#39;] |

### Return type

[**\App\TmdbApi\Model\TrendingAll200Response**](../Model/TrendingAll200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `trendingTv()`

```php
trendingTv($time_window, $language): \App\TmdbApi\Model\TrendingTv200Response
```

TV

Get the trending TV shows on TMDB.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\TrendingApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$time_window = 'day'; // string
$language = 'en-US'; // string | `ISO-639-1`-`ISO-3166-1` code

try {
    $result = $apiInstance->trendingTv($time_window, $language);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling TrendingApi->trendingTv: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **time_window** | **string**|  | [default to &#39;day&#39;] |
| **language** | **string**| &#x60;ISO-639-1&#x60;-&#x60;ISO-3166-1&#x60; code | [optional] [default to &#39;en-US&#39;] |

### Return type

[**\App\TmdbApi\Model\TrendingTv200Response**](../Model/TrendingTv200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)
