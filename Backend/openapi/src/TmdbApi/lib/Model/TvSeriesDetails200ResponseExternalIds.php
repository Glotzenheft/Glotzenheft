<?php

declare(strict_types=1);

namespace App\TmdbApi\Model;

use ArrayAccess;
use App\TmdbApi\ObjectSerializer;
use JsonSerializable;
use ReturnTypeWillChange;

/**
 * TvSeriesDetails200ResponseExternalIds
 *
 * @category Class
 * @package  App\TmdbApi
 * @author   OpenAPI Generator team
 * @link     https://openapi-generator.tech
 * @implements ArrayAccess<string, mixed>
 */
class TvSeriesDetails200ResponseExternalIds implements ModelInterface, ArrayAccess, JsonSerializable
{
    public const null DISCRIMINATOR = null;
    protected static string $openAPIModelName = 'tv_series_details_200_response_external_ids';
    protected static array $openAPITypes = [
        'imdb_id' => 'string',
        'tvdb_id' => 'int',
        'wikidata_id' => 'string',
        'facebook_id' => 'string',
        'instagram_id' => 'string',
        'twitter_id' => 'string',
    ];

    protected static array $openAPIFormats = [
        'imdb_id' => null,
        'tvdb_id' => null,
        'wikidata_id' => null,
        'facebook_id' => null,
        'instagram_id' => null,
        'twitter_id' => null,
    ];

    protected static array $openAPINullables = [
        'imdb_id' => true,
        'tvdb_id' => true,
        'wikidata_id' => true,
        'facebook_id' => true,
        'instagram_id' => true,
        'twitter_id' => true,
    ];

    protected array $openAPINullablesSetToNull = [];

    public static function openAPITypes(): array
    {
        return self::$openAPITypes;
    }

    public static function openAPIFormats(): array
    {
        return self::$openAPIFormats;
    }

    protected static function openAPINullables(): array
    {
        return self::$openAPINullables;
    }

    private function getOpenAPINullablesSetToNull(): array
    {
        return $this->openAPINullablesSetToNull;
    }

    private function setOpenAPINullablesSetToNull(array $openAPINullablesSetToNull): void
    {
        $this->openAPINullablesSetToNull = $openAPINullablesSetToNull;
    }

    public static function isNullable(string $property): bool
    {
        return self::openAPINullables()[$property] ?? false;
    }

    public function isNullableSetToNull(string $property): bool
    {
        return in_array($property, $this->getOpenAPINullablesSetToNull(), true);
    }

    protected static array $attributeMap = [
        'imdb_id' => 'imdb_id',
        'tvdb_id' => 'tvdb_id',
        'wikidata_id' => 'wikidata_id',
        'facebook_id' => 'facebook_id',
        'instagram_id' => 'instagram_id',
        'twitter_id' => 'twitter_id',
    ];

    protected static array $setters = [
        'imdb_id' => 'setImdbId',
        'tvdb_id' => 'setTvdbId',
        'wikidata_id' => 'setWikidataId',
        'facebook_id' => 'setFacebookId',
        'instagram_id' => 'setInstagramId',
        'twitter_id' => 'setTwitterId',
    ];

    protected static array $getters = [
        'imdb_id' => 'getImdbId',
        'tvdb_id' => 'getTvdbId',
        'wikidata_id' => 'getWikidataId',
        'facebook_id' => 'getFacebookId',
        'instagram_id' => 'getInstagramId',
        'twitter_id' => 'getTwitterId',
    ];

    public static function attributeMap(): array
    {
        return self::$attributeMap;
    }

    public static function setters(): array
    {
        return self::$setters;
    }

    public static function getters(): array
    {
        return self::$getters;
    }

    public function getModelName(): string
    {
        return self::$openAPIModelName;
    }

    protected array $container = [];

    public function __construct(?array $data = null)
    {
        $this->setIfExists('imdb_id', $data ?? []);
        $this->setIfExists('tvdb_id', $data ?? []);
        $this->setIfExists('wikidata_id', $data ?? []);
        $this->setIfExists('facebook_id', $data ?? []);
        $this->setIfExists('instagram_id', $data ?? []);
        $this->setIfExists('twitter_id', $data ?? []);
    }

    private function setIfExists(string $variableName, array $fields): void
    {
        if (self::isNullable($variableName) && array_key_exists($variableName, $fields) && is_null($fields[$variableName]))
        {
            $this->openAPINullablesSetToNull[] = $variableName;
        }
        $this->container[$variableName] = $fields[$variableName] ?? null;
    }

    public function listInvalidProperties(): array
    {
        return [];
    }

    public function valid(): true
    {
        return true;
    }

    public function getImdbId(): ?string
    {
        return $this->container['imdb_id'];
    }

    public function setImdbId(?string $imdb_id): self
    {
        $this->container['imdb_id'] = $imdb_id;
        return $this;
    }

    public function getTvdbId(): ?int
    {
        return $this->container['tvdb_id'];
    }

    public function setTvdbId(?int $tvdb_id): self
    {
        $this->container['tvdb_id'] = $tvdb_id;
        return $this;
    }

    public function getWikidataId(): ?string
    {
        return $this->container['wikidata_id'];
    }

    public function setWikidataId(?string $wikidata_id): self
    {
        $this->container['wikidata_id'] = $wikidata_id;
        return $this;
    }

    public function getFacebookId(): ?string
    {
        return $this->container['facebook_id'];
    }

    public function setFacebookId(?string $facebook_id): self
    {
        $this->container['facebook_id'] = $facebook_id;
        return $this;
    }

    public function getInstagramId(): ?string
    {
        return $this->container['instagram_id'];
    }

    public function setInstagramId(?string $instagram_id): self
    {
        $this->container['instagram_id'] = $instagram_id;
        return $this;
    }

    public function getTwitterId(): ?string
    {
        return $this->container['twitter_id'];
    }

    public function setTwitterId(?string $twitter_id): self
    {
        $this->container['twitter_id'] = $twitter_id;
        return $this;
    }

    public function offsetExists($offset): bool
    {
        return isset($this->container[$offset]);
    }

    #[ReturnTypeWillChange]
    public function offsetGet($offset)
    {
        return $this->container[$offset] ?? null;
    }

    public function offsetSet($offset, $value): void
    {
        if (is_null($offset))
        {
            $this->container[] = $value;
        }
        else
        {
            $this->container[$offset] = $value;
        }
    }

    public function offsetUnset($offset): void
    {
        unset($this->container[$offset]);
    }

    #[ReturnTypeWillChange]
    public function jsonSerialize()
    {
        return ObjectSerializer::sanitizeForSerialization($this);
    }

    public function __toString()
    {
        return json_encode(ObjectSerializer::sanitizeForSerialization($this), JSON_PRETTY_PRINT);
    }

    public function toHeaderValue(): false|string
    {
        return json_encode(ObjectSerializer::sanitizeForSerialization($this));
    }
}