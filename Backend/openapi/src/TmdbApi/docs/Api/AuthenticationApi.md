# App\TmdbApi\AuthenticationApi



All URIs are relative to https://api.themoviedb.org, except if the operation defines another base path.

| Method | HTTP request | Description |
| ------------- | ------------- | ------------- |
| [**authenticationCreateGuestSession()**](AuthenticationApi.md#authenticationCreateGuestSession) | **GET** /3/authentication/guest_session/new | Create Guest Session |
| [**authenticationCreateRequestToken()**](AuthenticationApi.md#authenticationCreateRequestToken) | **GET** /3/authentication/token/new | Create Request Token |
| [**authenticationCreateSession()**](AuthenticationApi.md#authenticationCreateSession) | **POST** /3/authentication/session/new | Create Session |
| [**authenticationCreateSessionFromLogin()**](AuthenticationApi.md#authenticationCreateSessionFromLogin) | **POST** /3/authentication/token/validate_with_login | Create Session (with login) |
| [**authenticationCreateSessionFromV4Token()**](AuthenticationApi.md#authenticationCreateSessionFromV4Token) | **POST** /3/authentication/session/convert/4 | Create Session (from v4 token) |
| [**authenticationDeleteSession()**](AuthenticationApi.md#authenticationDeleteSession) | **DELETE** /3/authentication/session | Delete Session |
| [**authenticationValidateKey()**](AuthenticationApi.md#authenticationValidateKey) | **GET** /3/authentication | Validate Key |


## `authenticationCreateGuestSession()`

```php
authenticationCreateGuestSession(): \App\TmdbApi\Model\AuthenticationCreateGuestSession200Response
```

Create Guest Session



### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\AuthenticationApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);

try {
    $result = $apiInstance->authenticationCreateGuestSession();
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling AuthenticationApi->authenticationCreateGuestSession: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**\App\TmdbApi\Model\AuthenticationCreateGuestSession200Response**](../Model/AuthenticationCreateGuestSession200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `authenticationCreateRequestToken()`

```php
authenticationCreateRequestToken(): \App\TmdbApi\Model\AuthenticationCreateRequestToken200Response
```

Create Request Token



### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\AuthenticationApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);

try {
    $result = $apiInstance->authenticationCreateRequestToken();
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling AuthenticationApi->authenticationCreateRequestToken: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**\App\TmdbApi\Model\AuthenticationCreateRequestToken200Response**](../Model/AuthenticationCreateRequestToken200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `authenticationCreateSession()`

```php
authenticationCreateSession($account_add_favorite_request): \App\TmdbApi\Model\AuthenticationCreateSession200Response
```

Create Session



### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\AuthenticationApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$account_add_favorite_request = {"request_token":"6bc047b88f669d1fb86574f06381005d93d3517a"}; // \App\TmdbApi\Model\AccountAddFavoriteRequest

try {
    $result = $apiInstance->authenticationCreateSession($account_add_favorite_request);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling AuthenticationApi->authenticationCreateSession: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **account_add_favorite_request** | [**\App\TmdbApi\Model\AccountAddFavoriteRequest**](../Model/AccountAddFavoriteRequest.md)|  | [optional] |

### Return type

[**\App\TmdbApi\Model\AuthenticationCreateSession200Response**](../Model/AuthenticationCreateSession200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `authenticationCreateSessionFromLogin()`

```php
authenticationCreateSessionFromLogin($account_add_favorite_request): \App\TmdbApi\Model\AuthenticationCreateSessionFromLogin200Response
```

Create Session (with login)

This method allows an application to validate a request token by entering a username and password.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\AuthenticationApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$account_add_favorite_request = {"username":"johnny_appleseed","password":"test123","request_token":"1531f1a558c8357ce8990cf887ff196e8f5402ec"}; // \App\TmdbApi\Model\AccountAddFavoriteRequest

try {
    $result = $apiInstance->authenticationCreateSessionFromLogin($account_add_favorite_request);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling AuthenticationApi->authenticationCreateSessionFromLogin: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **account_add_favorite_request** | [**\App\TmdbApi\Model\AccountAddFavoriteRequest**](../Model/AccountAddFavoriteRequest.md)|  | [optional] |

### Return type

[**\App\TmdbApi\Model\AuthenticationCreateSessionFromLogin200Response**](../Model/AuthenticationCreateSessionFromLogin200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `authenticationCreateSessionFromV4Token()`

```php
authenticationCreateSessionFromV4Token($account_add_favorite_request): \App\TmdbApi\Model\AuthenticationCreateSessionFromV4Token200Response
```

Create Session (from v4 token)



### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\AuthenticationApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$account_add_favorite_request = {"access_token":"eyK0eXAiOiJAV1QiLCJhbGciOiUIUzI1NiJ9.eyJhdWQiOiI0Ozc2YzA1ZTg4YTY1Yzk0MjFjZDI1NmBiYzRiNGE0NyIsInN1YiI6IjRiYzg4OTJhMDE3YTNjMGY5MjAwMDAwMiIsInNjb3BlayI6WyJhcGlfcmVhZCJdLCL2ZXJzaW9uIjoxfQ.Bn660W0Vi-_AI5HvwIEqtc2s5mAXDknBnTrUREZYH7A"}; // \App\TmdbApi\Model\AccountAddFavoriteRequest

try {
    $result = $apiInstance->authenticationCreateSessionFromV4Token($account_add_favorite_request);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling AuthenticationApi->authenticationCreateSessionFromV4Token: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **account_add_favorite_request** | [**\App\TmdbApi\Model\AccountAddFavoriteRequest**](../Model/AccountAddFavoriteRequest.md)|  | [optional] |

### Return type

[**\App\TmdbApi\Model\AuthenticationCreateSessionFromV4Token200Response**](../Model/AuthenticationCreateSessionFromV4Token200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `authenticationDeleteSession()`

```php
authenticationDeleteSession($account_add_favorite_request): \App\TmdbApi\Model\AuthenticationDeleteSession200Response
```

Delete Session



### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\AuthenticationApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$account_add_favorite_request = {"session_id":"2629f70fb498edc263a0adb99118ac41f0053e8c"}; // \App\TmdbApi\Model\AccountAddFavoriteRequest

try {
    $result = $apiInstance->authenticationDeleteSession($account_add_favorite_request);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling AuthenticationApi->authenticationDeleteSession: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **account_add_favorite_request** | [**\App\TmdbApi\Model\AccountAddFavoriteRequest**](../Model/AccountAddFavoriteRequest.md)|  | [optional] |

### Return type

[**\App\TmdbApi\Model\AuthenticationDeleteSession200Response**](../Model/AuthenticationDeleteSession200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `authenticationValidateKey()`

```php
authenticationValidateKey(): \App\TmdbApi\Model\AuthenticationValidateKey200Response
```

Validate Key

Test your API Key to see if it's valid.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\AuthenticationApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);

try {
    $result = $apiInstance->authenticationValidateKey();
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling AuthenticationApi->authenticationValidateKey: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**\App\TmdbApi\Model\AuthenticationValidateKey200Response**](../Model/AuthenticationValidateKey200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)
