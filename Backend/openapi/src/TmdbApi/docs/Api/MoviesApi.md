# App\TmdbApi\MoviesApi

All URIs are relative to https://api.themoviedb.org, except if the operation defines another base path.

| Method | HTTP request | Description |
| ------------- | ------------- | ------------- |
| [**movieDetails()**](MoviesApi.md#movieDetails) | **GET** /3/movie/{movie_id} | Details |


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
