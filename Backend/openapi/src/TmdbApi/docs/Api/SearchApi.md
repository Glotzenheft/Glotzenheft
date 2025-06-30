# App\TmdbApi\SearchApi

All URIs are relative to https://api.themoviedb.org, except if the operation defines another base path.

| Method | HTTP request | Description |
| ------------- | ------------- | ------------- |
| [**searchMovie()**](SearchApi.md#searchMovie) | **GET** /3/search/movie | Movie |
| [**searchMulti()**](SearchApi.md#searchMulti) | **GET** /3/search/multi | Multi |
| [**searchTv()**](SearchApi.md#searchTv) | **GET** /3/search/tv | TV |


## `searchMovie()`

```php
searchMovie($query, $include_adult, $language, $primary_release_year, $page, $region, $year): \App\TmdbApi\Model\SearchMovie200Response
```

Movie

Search for movies by their original, translated and alternative titles.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\SearchApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$query = 'query_example'; // string
$include_adult = false; // bool
$language = 'en-US'; // string
$primary_release_year = 'primary_release_year_example'; // string
$page = 1; // int
$region = 'region_example'; // string
$year = 'year_example'; // string

try {
    $result = $apiInstance->searchMovie($query, $include_adult, $language, $primary_release_year, $page, $region, $year);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling SearchApi->searchMovie: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **query** | **string**|  | |
| **include_adult** | **bool**|  | [optional] [default to false] |
| **language** | **string**|  | [optional] [default to &#39;en-US&#39;] |
| **primary_release_year** | **string**|  | [optional] |
| **page** | **int**|  | [optional] [default to 1] |
| **region** | **string**|  | [optional] |
| **year** | **string**|  | [optional] |

### Return type

[**\App\TmdbApi\Model\SearchMovie200Response**](../Model/SearchMovie200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `searchMulti()`

```php
searchMulti($query, $include_adult, $language, $page): \App\TmdbApi\Model\SearchMulti200Response
```

Multi

Use multi search when you want to search for movies, TV shows and people in a single request.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\SearchApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$query = 'query_example'; // string
$include_adult = false; // bool
$language = 'en-US'; // string
$page = 1; // int

try {
    $result = $apiInstance->searchMulti($query, $include_adult, $language, $page);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling SearchApi->searchMulti: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **query** | **string**|  | |
| **include_adult** | **bool**|  | [optional] [default to false] |
| **language** | **string**|  | [optional] [default to &#39;en-US&#39;] |
| **page** | **int**|  | [optional] [default to 1] |

### Return type

[**\App\TmdbApi\Model\SearchMulti200Response**](../Model/SearchMulti200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `searchTv()`

```php
searchTv($query, $first_air_date_year, $include_adult, $language, $page, $year): \App\TmdbApi\Model\SearchTv200Response
```

TV

Search for TV shows by their original, translated and also known as names.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\SearchApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$query = 'query_example'; // string
$first_air_date_year = 56; // int | Search only the first air date. Valid values are: 1000..9999
$include_adult = false; // bool
$language = 'en-US'; // string
$page = 1; // int
$year = 56; // int | Search the first air date and all episode air dates. Valid values are: 1000..9999

try {
    $result = $apiInstance->searchTv($query, $first_air_date_year, $include_adult, $language, $page, $year);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling SearchApi->searchTv: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **query** | **string**|  | |
| **first_air_date_year** | **int**| Search only the first air date. Valid values are: 1000..9999 | [optional] |
| **include_adult** | **bool**|  | [optional] [default to false] |
| **language** | **string**|  | [optional] [default to &#39;en-US&#39;] |
| **page** | **int**|  | [optional] [default to 1] |
| **year** | **int**| Search the first air date and all episode air dates. Valid values are: 1000..9999 | [optional] |

### Return type

[**\App\TmdbApi\Model\SearchTv200Response**](../Model/SearchTv200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)
