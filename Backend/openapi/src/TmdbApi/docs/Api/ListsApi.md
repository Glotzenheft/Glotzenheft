# App\TmdbApi\ListsApi



All URIs are relative to https://api.themoviedb.org, except if the operation defines another base path.

| Method | HTTP request | Description |
| ------------- | ------------- | ------------- |
| [**listAddMovie()**](ListsApi.md#listAddMovie) | **POST** /3/list/{list_id}/add_item | Add Movie |
| [**listCheckItemStatus()**](ListsApi.md#listCheckItemStatus) | **GET** /3/list/{list_id}/item_status | Check Item Status |
| [**listClear()**](ListsApi.md#listClear) | **POST** /3/list/{list_id}/clear | Clear |
| [**listCreate()**](ListsApi.md#listCreate) | **POST** /3/list | Create |
| [**listDelete()**](ListsApi.md#listDelete) | **DELETE** /3/list/{list_id} | Delete |
| [**listDetails()**](ListsApi.md#listDetails) | **GET** /3/list/{list_id} | Details |
| [**listRemoveMovie()**](ListsApi.md#listRemoveMovie) | **POST** /3/list/{list_id}/remove_item | Remove Movie |


## `listAddMovie()`

```php
listAddMovie($list_id, $session_id, $list_add_movie_request): \App\TmdbApi\Model\ListAddMovie200Response
```

Add Movie

Add a movie to a list.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\ListsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$list_id = 56; // int
$session_id = 'session_id_example'; // string
$list_add_movie_request = {"media_id":18}; // \App\TmdbApi\Model\ListAddMovieRequest

try {
    $result = $apiInstance->listAddMovie($list_id, $session_id, $list_add_movie_request);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling ListsApi->listAddMovie: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **list_id** | **int**|  | |
| **session_id** | **string**|  | |
| **list_add_movie_request** | [**\App\TmdbApi\Model\ListAddMovieRequest**](../Model/ListAddMovieRequest.md)|  | [optional] |

### Return type

[**\App\TmdbApi\Model\ListAddMovie200Response**](../Model/ListAddMovie200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `listCheckItemStatus()`

```php
listCheckItemStatus($list_id, $language, $movie_id): \App\TmdbApi\Model\ListCheckItemStatus200Response
```

Check Item Status

Use this method to check if an item has already been added to the list.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\ListsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$list_id = 56; // int
$language = 'en-US'; // string
$movie_id = 56; // int

try {
    $result = $apiInstance->listCheckItemStatus($list_id, $language, $movie_id);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling ListsApi->listCheckItemStatus: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **list_id** | **int**|  | |
| **language** | **string**|  | [optional] [default to &#39;en-US&#39;] |
| **movie_id** | **int**|  | [optional] |

### Return type

[**\App\TmdbApi\Model\ListCheckItemStatus200Response**](../Model/ListCheckItemStatus200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `listClear()`

```php
listClear($list_id, $session_id, $confirm): \App\TmdbApi\Model\ListAddMovie200Response
```

Clear

Clear all items from a list.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\ListsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$list_id = 56; // int
$session_id = 'session_id_example'; // string
$confirm = false; // bool

try {
    $result = $apiInstance->listClear($list_id, $session_id, $confirm);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling ListsApi->listClear: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **list_id** | **int**|  | |
| **session_id** | **string**|  | |
| **confirm** | **bool**|  | [default to false] |

### Return type

[**\App\TmdbApi\Model\ListAddMovie200Response**](../Model/ListAddMovie200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `listCreate()`

```php
listCreate($session_id, $account_add_favorite_request): \App\TmdbApi\Model\ListCreate200Response
```

Create



### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\ListsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$session_id = 'session_id_example'; // string
$account_add_favorite_request = {"name":"This is my awesome test list.","description":"Just an awesome list.","language":"en"}; // \App\TmdbApi\Model\AccountAddFavoriteRequest

try {
    $result = $apiInstance->listCreate($session_id, $account_add_favorite_request);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling ListsApi->listCreate: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **session_id** | **string**|  | |
| **account_add_favorite_request** | [**\App\TmdbApi\Model\AccountAddFavoriteRequest**](../Model/AccountAddFavoriteRequest.md)|  | [optional] |

### Return type

[**\App\TmdbApi\Model\ListCreate200Response**](../Model/ListCreate200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `listDelete()`

```php
listDelete($list_id, $session_id): \App\TmdbApi\Model\ListAddMovie200Response
```

Delete

Delete a list.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\ListsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$list_id = 56; // int
$session_id = 'session_id_example'; // string

try {
    $result = $apiInstance->listDelete($list_id, $session_id);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling ListsApi->listDelete: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **list_id** | **int**|  | |
| **session_id** | **string**|  | |

### Return type

[**\App\TmdbApi\Model\ListAddMovie200Response**](../Model/ListAddMovie200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `listDetails()`

```php
listDetails($list_id, $language, $page): \App\TmdbApi\Model\ListDetails200Response
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


$apiInstance = new App\TmdbApi\Api\ListsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$list_id = 56; // int
$language = 'en-US'; // string
$page = 1; // int

try {
    $result = $apiInstance->listDetails($list_id, $language, $page);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling ListsApi->listDetails: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **list_id** | **int**|  | |
| **language** | **string**|  | [optional] [default to &#39;en-US&#39;] |
| **page** | **int**|  | [optional] [default to 1] |

### Return type

[**\App\TmdbApi\Model\ListDetails200Response**](../Model/ListDetails200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `listRemoveMovie()`

```php
listRemoveMovie($list_id, $session_id, $account_add_favorite_request): \App\TmdbApi\Model\ListRemoveMovie200Response
```

Remove Movie

Remove a movie from a list.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\ListsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$list_id = 56; // int
$session_id = 'session_id_example'; // string
$account_add_favorite_request = {media_id=18}; // \App\TmdbApi\Model\AccountAddFavoriteRequest

try {
    $result = $apiInstance->listRemoveMovie($list_id, $session_id, $account_add_favorite_request);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling ListsApi->listRemoveMovie: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **list_id** | **int**|  | |
| **session_id** | **string**|  | |
| **account_add_favorite_request** | [**\App\TmdbApi\Model\AccountAddFavoriteRequest**](../Model/AccountAddFavoriteRequest.md)|  | [optional] |

### Return type

[**\App\TmdbApi\Model\ListRemoveMovie200Response**](../Model/ListRemoveMovie200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)
