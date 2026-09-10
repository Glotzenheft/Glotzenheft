# App\TmdbApi\GuestSessionApi



All URIs are relative to https://api.themoviedb.org, except if the operation defines another base path.

| Method | HTTP request | Description |
| ------------- | ------------- | ------------- |
| [**guestSessionRatedMovies()**](GuestSessionApi.md#guestSessionRatedMovies) | **GET** /3/guest_session/{guest_session_id}/rated/movies | Rated Movies |
| [**guestSessionRatedTv()**](GuestSessionApi.md#guestSessionRatedTv) | **GET** /3/guest_session/{guest_session_id}/rated/tv | Rated TV |
| [**guestSessionRatedTvEpisodes()**](GuestSessionApi.md#guestSessionRatedTvEpisodes) | **GET** /3/guest_session/{guest_session_id}/rated/tv/episodes | Rated TV Episodes |


## `guestSessionRatedMovies()`

```php
guestSessionRatedMovies($guest_session_id, $language, $page, $sort_by): \App\TmdbApi\Model\GuestSessionRatedMovies200Response
```

Rated Movies

Get the rated movies for a guest session.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\GuestSessionApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$guest_session_id = 'guest_session_id_example'; // string
$language = 'en-US'; // string
$page = 1; // int
$sort_by = 'created_at.asc'; // string

try {
    $result = $apiInstance->guestSessionRatedMovies($guest_session_id, $language, $page, $sort_by);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling GuestSessionApi->guestSessionRatedMovies: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **guest_session_id** | **string**|  | |
| **language** | **string**|  | [optional] [default to &#39;en-US&#39;] |
| **page** | **int**|  | [optional] [default to 1] |
| **sort_by** | **string**|  | [optional] [default to &#39;created_at.asc&#39;] |

### Return type

[**\App\TmdbApi\Model\GuestSessionRatedMovies200Response**](../Model/GuestSessionRatedMovies200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `guestSessionRatedTv()`

```php
guestSessionRatedTv($guest_session_id, $language, $page, $sort_by): \App\TmdbApi\Model\GuestSessionRatedTv200Response
```

Rated TV

Get the rated TV shows for a guest session.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\GuestSessionApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$guest_session_id = 'guest_session_id_example'; // string
$language = 'en-US'; // string
$page = 1; // int
$sort_by = 'created_at.asc'; // string

try {
    $result = $apiInstance->guestSessionRatedTv($guest_session_id, $language, $page, $sort_by);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling GuestSessionApi->guestSessionRatedTv: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **guest_session_id** | **string**|  | |
| **language** | **string**|  | [optional] [default to &#39;en-US&#39;] |
| **page** | **int**|  | [optional] [default to 1] |
| **sort_by** | **string**|  | [optional] [default to &#39;created_at.asc&#39;] |

### Return type

[**\App\TmdbApi\Model\GuestSessionRatedTv200Response**](../Model/GuestSessionRatedTv200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `guestSessionRatedTvEpisodes()`

```php
guestSessionRatedTvEpisodes($guest_session_id, $language, $page, $sort_by): \App\TmdbApi\Model\GuestSessionRatedTvEpisodes200Response
```

Rated TV Episodes

Get the rated TV episodes for a guest session.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\GuestSessionApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$guest_session_id = 'guest_session_id_example'; // string
$language = 'en-US'; // string
$page = 1; // int
$sort_by = 'created_at.asc'; // string

try {
    $result = $apiInstance->guestSessionRatedTvEpisodes($guest_session_id, $language, $page, $sort_by);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling GuestSessionApi->guestSessionRatedTvEpisodes: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **guest_session_id** | **string**|  | |
| **language** | **string**|  | [optional] [default to &#39;en-US&#39;] |
| **page** | **int**|  | [optional] [default to 1] |
| **sort_by** | **string**|  | [optional] [default to &#39;created_at.asc&#39;] |

### Return type

[**\App\TmdbApi\Model\GuestSessionRatedTvEpisodes200Response**](../Model/GuestSessionRatedTvEpisodes200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)
