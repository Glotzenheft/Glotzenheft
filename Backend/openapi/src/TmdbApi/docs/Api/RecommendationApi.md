# App\TmdbApi\RecommendationApi

All URIs are relative to https://api.themoviedb.org, except if the operation defines another base path.

| Method | HTTP request | Description |
| ------------- | ------------- | ------------- |
| [**movieRecommendations()**](RecommendationApi.md#movieRecommendations) | **GET** /3/movie/{movie_id}/recommendations | Recommendations |
| [**tvSeriesRecommendations()**](RecommendationApi.md#tvSeriesRecommendations) | **GET** /3/tv/{series_id}/recommendations | Recommendations |


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


$apiInstance = new App\TmdbApi\Api\RecommendationApi(
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
    echo 'Exception when calling RecommendationApi->movieRecommendations: ', $e->getMessage(), PHP_EOL;
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

[sec0](../../../TmdbApi3/README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../../TmdbApi3/README.md#endpoints)
[[Back to Model list]](../../../TmdbApi3/README.md#models)
[[Back to README]](../../../TmdbApi3/README.md)

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


$apiInstance = new App\TmdbApi\Api\RecommendationApi(
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
    echo 'Exception when calling RecommendationApi->tvSeriesRecommendations: ', $e->getMessage(), PHP_EOL;
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

[sec0](../../../TmdbApi3/README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../../TmdbApi3/README.md#endpoints)
[[Back to Model list]](../../../TmdbApi3/README.md#models)
[[Back to README]](../../../TmdbApi3/README.md)
