# App\TmdbApi\DiscoverApi



All URIs are relative to https://api.themoviedb.org, except if the operation defines another base path.

| Method | HTTP request | Description |
| ------------- | ------------- | ------------- |
| [**discoverMovie()**](DiscoverApi.md#discoverMovie) | **GET** /3/discover/movie | Movie |
| [**discoverTv()**](DiscoverApi.md#discoverTv) | **GET** /3/discover/tv | TV |


## `discoverMovie()`

```php
discoverMovie($certification, $certification_gte, $certification_lte, $certification_country, $include_adult, $include_video, $language, $page, $primary_release_year, $primary_release_date_gte, $primary_release_date_lte, $region, $release_date_gte, $release_date_lte, $sort_by, $vote_average_gte, $vote_average_lte, $vote_count_gte, $vote_count_lte, $watch_region, $with_cast, $with_companies, $with_crew, $with_genres, $with_keywords, $with_origin_country, $with_original_language, $with_people, $with_release_type, $with_runtime_gte, $with_runtime_lte, $with_watch_monetization_types, $with_watch_providers, $without_companies, $without_genres, $without_keywords, $without_watch_providers, $year): \App\TmdbApi\Model\DiscoverMovie200Response
```

Movie

Find movies using over 30 filters and sort options.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\DiscoverApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$certification = 'certification_example'; // string | use in conjunction with `region`
$certification_gte = 'certification_gte_example'; // string | use in conjunction with `region`
$certification_lte = 'certification_lte_example'; // string | use in conjunction with `region`
$certification_country = 'certification_country_example'; // string | use in conjunction with the `certification`, `certification.gte` and `certification.lte` filters
$include_adult = false; // bool
$include_video = false; // bool
$language = 'en-US'; // string
$page = 1; // int
$primary_release_year = 56; // int
$primary_release_date_gte = new \DateTime('2013-10-20T19:20:30+01:00'); // \DateTime
$primary_release_date_lte = new \DateTime('2013-10-20T19:20:30+01:00'); // \DateTime
$region = 'region_example'; // string
$release_date_gte = new \DateTime('2013-10-20T19:20:30+01:00'); // \DateTime
$release_date_lte = new \DateTime('2013-10-20T19:20:30+01:00'); // \DateTime
$sort_by = 'popularity.desc'; // string
$vote_average_gte = 3.4; // float
$vote_average_lte = 3.4; // float
$vote_count_gte = 3.4; // float
$vote_count_lte = 3.4; // float
$watch_region = 'watch_region_example'; // string | use in conjunction with `with_watch_monetization_types ` or `with_watch_providers `
$with_cast = 'with_cast_example'; // string | can be a comma (`AND`) or pipe (`OR`) separated query
$with_companies = 'with_companies_example'; // string | can be a comma (`AND`) or pipe (`OR`) separated query
$with_crew = 'with_crew_example'; // string | can be a comma (`AND`) or pipe (`OR`) separated query
$with_genres = 'with_genres_example'; // string | can be a comma (`AND`) or pipe (`OR`) separated query
$with_keywords = 'with_keywords_example'; // string | can be a comma (`AND`) or pipe (`OR`) separated query
$with_origin_country = 'with_origin_country_example'; // string
$with_original_language = 'with_original_language_example'; // string
$with_people = 'with_people_example'; // string | can be a comma (`AND`) or pipe (`OR`) separated query
$with_release_type = 56; // int | possible values are: [1, 2, 3, 4, 5, 6] can be a comma (`AND`) or pipe (`OR`) separated query, can be used in conjunction with `region`
$with_runtime_gte = 56; // int
$with_runtime_lte = 56; // int
$with_watch_monetization_types = 'with_watch_monetization_types_example'; // string | possible values are: [flatrate, free, ads, rent, buy] use in conjunction with `watch_region`, can be a comma (`AND`) or pipe (`OR`) separated query
$with_watch_providers = 'with_watch_providers_example'; // string | use in conjunction with `watch_region`, can be a comma (`AND`) or pipe (`OR`) separated query
$without_companies = 'without_companies_example'; // string
$without_genres = 'without_genres_example'; // string
$without_keywords = 'without_keywords_example'; // string
$without_watch_providers = 'without_watch_providers_example'; // string
$year = 56; // int

try {
    $result = $apiInstance->discoverMovie($certification, $certification_gte, $certification_lte, $certification_country, $include_adult, $include_video, $language, $page, $primary_release_year, $primary_release_date_gte, $primary_release_date_lte, $region, $release_date_gte, $release_date_lte, $sort_by, $vote_average_gte, $vote_average_lte, $vote_count_gte, $vote_count_lte, $watch_region, $with_cast, $with_companies, $with_crew, $with_genres, $with_keywords, $with_origin_country, $with_original_language, $with_people, $with_release_type, $with_runtime_gte, $with_runtime_lte, $with_watch_monetization_types, $with_watch_providers, $without_companies, $without_genres, $without_keywords, $without_watch_providers, $year);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DiscoverApi->discoverMovie: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **certification** | **string**| use in conjunction with &#x60;region&#x60; | [optional] |
| **certification_gte** | **string**| use in conjunction with &#x60;region&#x60; | [optional] |
| **certification_lte** | **string**| use in conjunction with &#x60;region&#x60; | [optional] |
| **certification_country** | **string**| use in conjunction with the &#x60;certification&#x60;, &#x60;certification.gte&#x60; and &#x60;certification.lte&#x60; filters | [optional] |
| **include_adult** | **bool**|  | [optional] [default to false] |
| **include_video** | **bool**|  | [optional] [default to false] |
| **language** | **string**|  | [optional] [default to &#39;en-US&#39;] |
| **page** | **int**|  | [optional] [default to 1] |
| **primary_release_year** | **int**|  | [optional] |
| **primary_release_date_gte** | **\DateTime**|  | [optional] |
| **primary_release_date_lte** | **\DateTime**|  | [optional] |
| **region** | **string**|  | [optional] |
| **release_date_gte** | **\DateTime**|  | [optional] |
| **release_date_lte** | **\DateTime**|  | [optional] |
| **sort_by** | **string**|  | [optional] [default to &#39;popularity.desc&#39;] |
| **vote_average_gte** | **float**|  | [optional] |
| **vote_average_lte** | **float**|  | [optional] |
| **vote_count_gte** | **float**|  | [optional] |
| **vote_count_lte** | **float**|  | [optional] |
| **watch_region** | **string**| use in conjunction with &#x60;with_watch_monetization_types &#x60; or &#x60;with_watch_providers &#x60; | [optional] |
| **with_cast** | **string**| can be a comma (&#x60;AND&#x60;) or pipe (&#x60;OR&#x60;) separated query | [optional] |
| **with_companies** | **string**| can be a comma (&#x60;AND&#x60;) or pipe (&#x60;OR&#x60;) separated query | [optional] |
| **with_crew** | **string**| can be a comma (&#x60;AND&#x60;) or pipe (&#x60;OR&#x60;) separated query | [optional] |
| **with_genres** | **string**| can be a comma (&#x60;AND&#x60;) or pipe (&#x60;OR&#x60;) separated query | [optional] |
| **with_keywords** | **string**| can be a comma (&#x60;AND&#x60;) or pipe (&#x60;OR&#x60;) separated query | [optional] |
| **with_origin_country** | **string**|  | [optional] |
| **with_original_language** | **string**|  | [optional] |
| **with_people** | **string**| can be a comma (&#x60;AND&#x60;) or pipe (&#x60;OR&#x60;) separated query | [optional] |
| **with_release_type** | **int**| possible values are: [1, 2, 3, 4, 5, 6] can be a comma (&#x60;AND&#x60;) or pipe (&#x60;OR&#x60;) separated query, can be used in conjunction with &#x60;region&#x60; | [optional] |
| **with_runtime_gte** | **int**|  | [optional] |
| **with_runtime_lte** | **int**|  | [optional] |
| **with_watch_monetization_types** | **string**| possible values are: [flatrate, free, ads, rent, buy] use in conjunction with &#x60;watch_region&#x60;, can be a comma (&#x60;AND&#x60;) or pipe (&#x60;OR&#x60;) separated query | [optional] |
| **with_watch_providers** | **string**| use in conjunction with &#x60;watch_region&#x60;, can be a comma (&#x60;AND&#x60;) or pipe (&#x60;OR&#x60;) separated query | [optional] |
| **without_companies** | **string**|  | [optional] |
| **without_genres** | **string**|  | [optional] |
| **without_keywords** | **string**|  | [optional] |
| **without_watch_providers** | **string**|  | [optional] |
| **year** | **int**|  | [optional] |

### Return type

[**\App\TmdbApi\Model\DiscoverMovie200Response**](../Model/DiscoverMovie200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `discoverTv()`

```php
discoverTv($air_date_gte, $air_date_lte, $first_air_date_year, $first_air_date_gte, $first_air_date_lte, $include_adult, $include_null_first_air_dates, $language, $page, $screened_theatrically, $sort_by, $timezone, $vote_average_gte, $vote_average_lte, $vote_count_gte, $vote_count_lte, $watch_region, $with_companies, $with_genres, $with_keywords, $with_networks, $with_origin_country, $with_original_language, $with_runtime_gte, $with_runtime_lte, $with_status, $with_watch_monetization_types, $with_watch_providers, $without_companies, $without_genres, $without_keywords, $without_watch_providers, $with_type): \App\TmdbApi\Model\DiscoverTv200Response
```

TV

Find TV shows using over 30 filters and sort options.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: sec0
$config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = App\TmdbApi\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new App\TmdbApi\Api\DiscoverApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$air_date_gte = new \DateTime('2013-10-20T19:20:30+01:00'); // \DateTime
$air_date_lte = new \DateTime('2013-10-20T19:20:30+01:00'); // \DateTime
$first_air_date_year = 56; // int
$first_air_date_gte = new \DateTime('2013-10-20T19:20:30+01:00'); // \DateTime
$first_air_date_lte = new \DateTime('2013-10-20T19:20:30+01:00'); // \DateTime
$include_adult = false; // bool
$include_null_first_air_dates = false; // bool
$language = 'en-US'; // string
$page = 1; // int
$screened_theatrically = True; // bool
$sort_by = 'popularity.desc'; // string
$timezone = 'timezone_example'; // string
$vote_average_gte = 3.4; // float
$vote_average_lte = 3.4; // float
$vote_count_gte = 3.4; // float
$vote_count_lte = 3.4; // float
$watch_region = 'watch_region_example'; // string | use in conjunction with `with_watch_monetization_types ` or `with_watch_providers `
$with_companies = 'with_companies_example'; // string | can be a comma (`AND`) or pipe (`OR`) separated query
$with_genres = 'with_genres_example'; // string | can be a comma (`AND`) or pipe (`OR`) separated query
$with_keywords = 'with_keywords_example'; // string | can be a comma (`AND`) or pipe (`OR`) separated query
$with_networks = 56; // int
$with_origin_country = 'with_origin_country_example'; // string
$with_original_language = 'with_original_language_example'; // string
$with_runtime_gte = 56; // int
$with_runtime_lte = 56; // int
$with_status = 'with_status_example'; // string | possible values are: [0, 1, 2, 3, 4, 5], can be a comma (`AND`) or pipe (`OR`) separated query
$with_watch_monetization_types = 'with_watch_monetization_types_example'; // string | possible values are: [flatrate, free, ads, rent, buy] use in conjunction with `watch_region`, can be a comma (`AND`) or pipe (`OR`) separated query
$with_watch_providers = 'with_watch_providers_example'; // string | use in conjunction with `watch_region`, can be a comma (`AND`) or pipe (`OR`) separated query
$without_companies = 'without_companies_example'; // string
$without_genres = 'without_genres_example'; // string
$without_keywords = 'without_keywords_example'; // string
$without_watch_providers = 'without_watch_providers_example'; // string
$with_type = 'with_type_example'; // string | possible values are: [0, 1, 2, 3, 4, 5, 6], can be a comma (`AND`) or pipe (`OR`) separated query

try {
    $result = $apiInstance->discoverTv($air_date_gte, $air_date_lte, $first_air_date_year, $first_air_date_gte, $first_air_date_lte, $include_adult, $include_null_first_air_dates, $language, $page, $screened_theatrically, $sort_by, $timezone, $vote_average_gte, $vote_average_lte, $vote_count_gte, $vote_count_lte, $watch_region, $with_companies, $with_genres, $with_keywords, $with_networks, $with_origin_country, $with_original_language, $with_runtime_gte, $with_runtime_lte, $with_status, $with_watch_monetization_types, $with_watch_providers, $without_companies, $without_genres, $without_keywords, $without_watch_providers, $with_type);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DiscoverApi->discoverTv: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **air_date_gte** | **\DateTime**|  | [optional] |
| **air_date_lte** | **\DateTime**|  | [optional] |
| **first_air_date_year** | **int**|  | [optional] |
| **first_air_date_gte** | **\DateTime**|  | [optional] |
| **first_air_date_lte** | **\DateTime**|  | [optional] |
| **include_adult** | **bool**|  | [optional] [default to false] |
| **include_null_first_air_dates** | **bool**|  | [optional] [default to false] |
| **language** | **string**|  | [optional] [default to &#39;en-US&#39;] |
| **page** | **int**|  | [optional] [default to 1] |
| **screened_theatrically** | **bool**|  | [optional] |
| **sort_by** | **string**|  | [optional] [default to &#39;popularity.desc&#39;] |
| **timezone** | **string**|  | [optional] |
| **vote_average_gte** | **float**|  | [optional] |
| **vote_average_lte** | **float**|  | [optional] |
| **vote_count_gte** | **float**|  | [optional] |
| **vote_count_lte** | **float**|  | [optional] |
| **watch_region** | **string**| use in conjunction with &#x60;with_watch_monetization_types &#x60; or &#x60;with_watch_providers &#x60; | [optional] |
| **with_companies** | **string**| can be a comma (&#x60;AND&#x60;) or pipe (&#x60;OR&#x60;) separated query | [optional] |
| **with_genres** | **string**| can be a comma (&#x60;AND&#x60;) or pipe (&#x60;OR&#x60;) separated query | [optional] |
| **with_keywords** | **string**| can be a comma (&#x60;AND&#x60;) or pipe (&#x60;OR&#x60;) separated query | [optional] |
| **with_networks** | **int**|  | [optional] |
| **with_origin_country** | **string**|  | [optional] |
| **with_original_language** | **string**|  | [optional] |
| **with_runtime_gte** | **int**|  | [optional] |
| **with_runtime_lte** | **int**|  | [optional] |
| **with_status** | **string**| possible values are: [0, 1, 2, 3, 4, 5], can be a comma (&#x60;AND&#x60;) or pipe (&#x60;OR&#x60;) separated query | [optional] |
| **with_watch_monetization_types** | **string**| possible values are: [flatrate, free, ads, rent, buy] use in conjunction with &#x60;watch_region&#x60;, can be a comma (&#x60;AND&#x60;) or pipe (&#x60;OR&#x60;) separated query | [optional] |
| **with_watch_providers** | **string**| use in conjunction with &#x60;watch_region&#x60;, can be a comma (&#x60;AND&#x60;) or pipe (&#x60;OR&#x60;) separated query | [optional] |
| **without_companies** | **string**|  | [optional] |
| **without_genres** | **string**|  | [optional] |
| **without_keywords** | **string**|  | [optional] |
| **without_watch_providers** | **string**|  | [optional] |
| **with_type** | **string**| possible values are: [0, 1, 2, 3, 4, 5, 6], can be a comma (&#x60;AND&#x60;) or pipe (&#x60;OR&#x60;) separated query | [optional] |

### Return type

[**\App\TmdbApi\Model\DiscoverTv200Response**](../Model/DiscoverTv200Response.md)

### Authorization

[sec0](../../README.md#sec0)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)
