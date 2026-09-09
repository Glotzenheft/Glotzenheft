# App\TmdbApi\NetworksApi



All URIs are relative to https://api.themoviedb.org, except if the operation defines another base path.

| Method | HTTP request | Description |
| ------------- | ------------- | ------------- |
| [**alternativeNamesCopy()**](NetworksApi.md#alternativeNamesCopy) | **GET** /3/network/{network_id}/images | Images |
| [**detailsCopy()**](NetworksApi.md#detailsCopy) | **GET** /3/network/{network_id}/alternative_names | Alternative Names |
| [**networkDetails()**](NetworksApi.md#networkDetails) | **GET** /3/network/{network_id} | Details |


## `alternativeNamesCopy()`

```php
alternativeNamesCopy($network_id): \App\TmdbApi\Model\AlternativeNamesCopy200Response
```

Images

Get the TV network logos by id.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\NetworksApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$network_id = 56; // int

try {
    $result = $apiInstance->alternativeNamesCopy($network_id);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling NetworksApi->alternativeNamesCopy: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **network_id** | **int**|  | |

### Return type

[**\App\TmdbApi\Model\AlternativeNamesCopy200Response**](../Model/AlternativeNamesCopy200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `detailsCopy()`

```php
detailsCopy($network_id): \App\TmdbApi\Model\DetailsCopy200Response
```

Alternative Names

Get the alternative names of a network.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\NetworksApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$network_id = 56; // int

try {
    $result = $apiInstance->detailsCopy($network_id);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling NetworksApi->detailsCopy: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **network_id** | **int**|  | |

### Return type

[**\App\TmdbApi\Model\DetailsCopy200Response**](../Model/DetailsCopy200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `networkDetails()`

```php
networkDetails($network_id): \App\TmdbApi\Model\NetworkDetails200Response
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


$apiInstance = new App\TmdbApi\Api\NetworksApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$network_id = 56; // int

try {
    $result = $apiInstance->networkDetails($network_id);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling NetworksApi->networkDetails: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **network_id** | **int**|  | |

### Return type

[**\App\TmdbApi\Model\NetworkDetails200Response**](../Model/NetworkDetails200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)
