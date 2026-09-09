# App\TmdbApi\ReviewsApi



All URIs are relative to https://api.themoviedb.org, except if the operation defines another base path.

| Method | HTTP request | Description |
| ------------- | ------------- | ------------- |
| [**reviewDetails()**](ReviewsApi.md#reviewDetails) | **GET** /3/review/{review_id} | Details |


## `reviewDetails()`

```php
reviewDetails($review_id): \App\TmdbApi\Model\ReviewDetails200Response
```

Details

Retrieve the details of a movie or TV show review.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\ReviewsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$review_id = 'review_id_example'; // string

try {
    $result = $apiInstance->reviewDetails($review_id);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling ReviewsApi->reviewDetails: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **review_id** | **string**|  | |

### Return type

[**\App\TmdbApi\Model\ReviewDetails200Response**](../Model/ReviewDetails200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)
