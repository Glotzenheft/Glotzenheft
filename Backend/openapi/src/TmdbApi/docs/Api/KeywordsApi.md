# App\TmdbApi\KeywordsApi



All URIs are relative to https://api.themoviedb.org, except if the operation defines another base path.

| Method | HTTP request | Description |
| ------------- | ------------- | ------------- |
| [**keywordDetails()**](KeywordsApi.md#keywordDetails) | **GET** /3/keyword/{keyword_id} | Details |
| [**keywordMovies()**](KeywordsApi.md#keywordMovies) | **GET** /3/keyword/{keyword_id}/movies | Movies |


## `keywordDetails()`

```php
keywordDetails($keyword_id): \App\TmdbApi\Model\KeywordDetails200Response
```

Details



### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\KeywordsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$keyword_id = 56; // int

try {
    $result = $apiInstance->keywordDetails($keyword_id);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling KeywordsApi->keywordDetails: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **keyword_id** | **int**|  | |

### Return type

[**\App\TmdbApi\Model\KeywordDetails200Response**](../Model/KeywordDetails200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `keywordMovies()`

```php
keywordMovies($keyword_id, $include_adult, $language, $page): \App\TmdbApi\Model\KeywordMovies200Response
```

Movies



### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\KeywordsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$keyword_id = 'keyword_id_example'; // string
$include_adult = false; // bool
$language = 'en-US'; // string
$page = 1; // int

try {
    $result = $apiInstance->keywordMovies($keyword_id, $include_adult, $language, $page);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling KeywordsApi->keywordMovies: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **keyword_id** | **string**|  | |
| **include_adult** | **bool**|  | [optional] [default to false] |
| **language** | **string**|  | [optional] [default to &#39;en-US&#39;] |
| **page** | **int**|  | [optional] [default to 1] |

### Return type

[**\App\TmdbApi\Model\KeywordMovies200Response**](../Model/KeywordMovies200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)
