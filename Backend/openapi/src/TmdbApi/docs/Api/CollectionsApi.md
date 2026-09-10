# App\TmdbApi\CollectionsApi



All URIs are relative to https://api.themoviedb.org, except if the operation defines another base path.

| Method | HTTP request | Description |
| ------------- | ------------- | ------------- |
| [**collectionDetails()**](CollectionsApi.md#collectionDetails) | **GET** /3/collection/{collection_id} | Details |
| [**collectionImages()**](CollectionsApi.md#collectionImages) | **GET** /3/collection/{collection_id}/images | Images |
| [**collectionTranslations()**](CollectionsApi.md#collectionTranslations) | **GET** /3/collection/{collection_id}/translations | Translations |


## `collectionDetails()`

```php
collectionDetails($collection_id, $language): \App\TmdbApi\Model\CollectionDetails200Response
```

Details

Get collection details by ID.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\CollectionsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$collection_id = 56; // int
$language = 'en-US'; // string

try {
    $result = $apiInstance->collectionDetails($collection_id, $language);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling CollectionsApi->collectionDetails: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **collection_id** | **int**|  | |
| **language** | **string**|  | [optional] [default to &#39;en-US&#39;] |

### Return type

[**\App\TmdbApi\Model\CollectionDetails200Response**](../Model/CollectionDetails200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `collectionImages()`

```php
collectionImages($collection_id, $include_image_language, $language): \App\TmdbApi\Model\CollectionImages200Response
```

Images

Get the images that belong to a collection.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\CollectionsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$collection_id = 56; // int
$include_image_language = 'include_image_language_example'; // string | specify a comma separated list of ISO-639-1 values to query, for example: `en-US,null`
$language = 'language_example'; // string

try {
    $result = $apiInstance->collectionImages($collection_id, $include_image_language, $language);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling CollectionsApi->collectionImages: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **collection_id** | **int**|  | |
| **include_image_language** | **string**| specify a comma separated list of ISO-639-1 values to query, for example: &#x60;en-US,null&#x60; | [optional] |
| **language** | **string**|  | [optional] |

### Return type

[**\App\TmdbApi\Model\CollectionImages200Response**](../Model/CollectionImages200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `collectionTranslations()`

```php
collectionTranslations($collection_id): \App\TmdbApi\Model\CollectionTranslations200Response
```

Translations



### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\CollectionsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$collection_id = 56; // int

try {
    $result = $apiInstance->collectionTranslations($collection_id);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling CollectionsApi->collectionTranslations: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **collection_id** | **int**|  | |

### Return type

[**\App\TmdbApi\Model\CollectionTranslations200Response**](../Model/CollectionTranslations200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)
