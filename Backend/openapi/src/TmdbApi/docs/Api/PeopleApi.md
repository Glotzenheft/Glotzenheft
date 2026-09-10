# App\TmdbApi\PeopleApi



All URIs are relative to https://api.themoviedb.org, except if the operation defines another base path.

| Method | HTTP request | Description |
| ------------- | ------------- | ------------- |
| [**changesPeopleList()**](PeopleApi.md#changesPeopleList) | **GET** /3/person/changes | People List |
| [**personChanges()**](PeopleApi.md#personChanges) | **GET** /3/person/{person_id}/changes | Changes |
| [**personCombinedCredits()**](PeopleApi.md#personCombinedCredits) | **GET** /3/person/{person_id}/combined_credits | Combined Credits |
| [**personDetails()**](PeopleApi.md#personDetails) | **GET** /3/person/{person_id} | Details |
| [**personExternalIds()**](PeopleApi.md#personExternalIds) | **GET** /3/person/{person_id}/external_ids | External IDs |
| [**personImages()**](PeopleApi.md#personImages) | **GET** /3/person/{person_id}/images | Images |
| [**personLatestId()**](PeopleApi.md#personLatestId) | **GET** /3/person/latest | Latest |
| [**personMovieCredits()**](PeopleApi.md#personMovieCredits) | **GET** /3/person/{person_id}/movie_credits | Movie Credits |
| [**personPopularList()**](PeopleApi.md#personPopularList) | **GET** /3/person/popular | Popular |
| [**personTaggedImages()**](PeopleApi.md#personTaggedImages) | **GET** /3/person/{person_id}/tagged_images | Tagged Images |
| [**personTvCredits()**](PeopleApi.md#personTvCredits) | **GET** /3/person/{person_id}/tv_credits | TV Credits |
| [**translations()**](PeopleApi.md#translations) | **GET** /3/person/{person_id}/translations | Translations |


## `changesPeopleList()`

```php
changesPeopleList($end_date, $page, $start_date): \App\TmdbApi\Model\ChangesPeopleList200Response
```

People List



### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\PeopleApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$end_date = new \DateTime('2013-10-20T19:20:30+01:00'); // \DateTime
$page = 1; // int
$start_date = new \DateTime('2013-10-20T19:20:30+01:00'); // \DateTime

try {
    $result = $apiInstance->changesPeopleList($end_date, $page, $start_date);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling PeopleApi->changesPeopleList: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **end_date** | **\DateTime**|  | [optional] |
| **page** | **int**|  | [optional] [default to 1] |
| **start_date** | **\DateTime**|  | [optional] |

### Return type

[**\App\TmdbApi\Model\ChangesPeopleList200Response**](../Model/ChangesPeopleList200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `personChanges()`

```php
personChanges($person_id, $end_date, $page, $start_date): \App\TmdbApi\Model\PersonChanges200Response
```

Changes

Get the recent changes for a person.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\PeopleApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$person_id = 56; // int
$end_date = new \DateTime('2013-10-20T19:20:30+01:00'); // \DateTime
$page = 1; // int
$start_date = new \DateTime('2013-10-20T19:20:30+01:00'); // \DateTime

try {
    $result = $apiInstance->personChanges($person_id, $end_date, $page, $start_date);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling PeopleApi->personChanges: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **person_id** | **int**|  | |
| **end_date** | **\DateTime**|  | [optional] |
| **page** | **int**|  | [optional] [default to 1] |
| **start_date** | **\DateTime**|  | [optional] |

### Return type

[**\App\TmdbApi\Model\PersonChanges200Response**](../Model/PersonChanges200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `personCombinedCredits()`

```php
personCombinedCredits($person_id, $language): \App\TmdbApi\Model\PersonCombinedCredits200Response
```

Combined Credits

Get the combined movie and TV credits that belong to a person.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\PeopleApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$person_id = 'person_id_example'; // string
$language = 'en-US'; // string

try {
    $result = $apiInstance->personCombinedCredits($person_id, $language);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling PeopleApi->personCombinedCredits: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **person_id** | **string**|  | |
| **language** | **string**|  | [optional] [default to &#39;en-US&#39;] |

### Return type

[**\App\TmdbApi\Model\PersonCombinedCredits200Response**](../Model/PersonCombinedCredits200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `personDetails()`

```php
personDetails($person_id, $append_to_response, $language): \App\TmdbApi\Model\PersonDetails200Response
```

Details

Query the top level details of a person.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\PeopleApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$person_id = 56; // int
$append_to_response = 'append_to_response_example'; // string | comma separated list of endpoints within this namespace, 20 items max
$language = 'en-US'; // string

try {
    $result = $apiInstance->personDetails($person_id, $append_to_response, $language);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling PeopleApi->personDetails: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **person_id** | **int**|  | |
| **append_to_response** | **string**| comma separated list of endpoints within this namespace, 20 items max | [optional] |
| **language** | **string**|  | [optional] [default to &#39;en-US&#39;] |

### Return type

[**\App\TmdbApi\Model\PersonDetails200Response**](../Model/PersonDetails200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `personExternalIds()`

```php
personExternalIds($person_id): \App\TmdbApi\Model\PersonExternalIds200Response
```

External IDs

Get the external ID's that belong to a person.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\PeopleApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$person_id = 56; // int

try {
    $result = $apiInstance->personExternalIds($person_id);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling PeopleApi->personExternalIds: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **person_id** | **int**|  | |

### Return type

[**\App\TmdbApi\Model\PersonExternalIds200Response**](../Model/PersonExternalIds200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `personImages()`

```php
personImages($person_id): \App\TmdbApi\Model\PersonImages200Response
```

Images

Get the profile images that belong to a person.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\PeopleApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$person_id = 56; // int

try {
    $result = $apiInstance->personImages($person_id);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling PeopleApi->personImages: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **person_id** | **int**|  | |

### Return type

[**\App\TmdbApi\Model\PersonImages200Response**](../Model/PersonImages200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `personLatestId()`

```php
personLatestId(): \App\TmdbApi\Model\PersonLatestId200Response
```

Latest

Get the newest created person. This is a live response and will continuously change.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\PeopleApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);

try {
    $result = $apiInstance->personLatestId();
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling PeopleApi->personLatestId: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**\App\TmdbApi\Model\PersonLatestId200Response**](../Model/PersonLatestId200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `personMovieCredits()`

```php
personMovieCredits($person_id, $language): \App\TmdbApi\Model\PersonMovieCredits200Response
```

Movie Credits

Get the movie credits for a person.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\PeopleApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$person_id = 56; // int
$language = 'en-US'; // string

try {
    $result = $apiInstance->personMovieCredits($person_id, $language);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling PeopleApi->personMovieCredits: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **person_id** | **int**|  | |
| **language** | **string**|  | [optional] [default to &#39;en-US&#39;] |

### Return type

[**\App\TmdbApi\Model\PersonMovieCredits200Response**](../Model/PersonMovieCredits200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `personPopularList()`

```php
personPopularList($language, $page): \App\TmdbApi\Model\PersonPopularList200Response
```

Popular

Get a list of people ordered by popularity.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\PeopleApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$language = 'en-US'; // string
$page = 1; // int

try {
    $result = $apiInstance->personPopularList($language, $page);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling PeopleApi->personPopularList: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **language** | **string**|  | [optional] [default to &#39;en-US&#39;] |
| **page** | **int**|  | [optional] [default to 1] |

### Return type

[**\App\TmdbApi\Model\PersonPopularList200Response**](../Model/PersonPopularList200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `personTaggedImages()`

```php
personTaggedImages($person_id, $page): \App\TmdbApi\Model\PersonTaggedImages200Response
```

Tagged Images

Get the tagged images for a person.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\PeopleApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$person_id = 56; // int
$page = 1; // int

try {
    $result = $apiInstance->personTaggedImages($person_id, $page);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling PeopleApi->personTaggedImages: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **person_id** | **int**|  | |
| **page** | **int**|  | [optional] [default to 1] |

### Return type

[**\App\TmdbApi\Model\PersonTaggedImages200Response**](../Model/PersonTaggedImages200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `personTvCredits()`

```php
personTvCredits($person_id, $language): \App\TmdbApi\Model\PersonTvCredits200Response
```

TV Credits

Get the TV credits that belong to a person.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\PeopleApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$person_id = 56; // int
$language = 'en-US'; // string

try {
    $result = $apiInstance->personTvCredits($person_id, $language);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling PeopleApi->personTvCredits: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **person_id** | **int**|  | |
| **language** | **string**|  | [optional] [default to &#39;en-US&#39;] |

### Return type

[**\App\TmdbApi\Model\PersonTvCredits200Response**](../Model/PersonTvCredits200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `translations()`

```php
translations($person_id): \App\TmdbApi\Model\Translations200Response
```

Translations

Get the translations that belong to a person.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\PeopleApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$person_id = 56; // int

try {
    $result = $apiInstance->translations($person_id);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling PeopleApi->translations: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **person_id** | **int**|  | |

### Return type

[**\App\TmdbApi\Model\Translations200Response**](../Model/Translations200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)
