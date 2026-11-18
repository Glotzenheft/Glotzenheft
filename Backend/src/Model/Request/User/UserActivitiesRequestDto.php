<?php
declare(strict_types=1);

namespace App\Model\Request\User;

use Symfony\Component\Serializer\Attribute\SerializedName;
use Symfony\Component\Validator\Constraints as Assert;

final readonly class UserActivitiesRequestDto
{
    public function __construct(
        #[SerializedName('user_activity_page')]
        #[Assert\Positive]
        public int $page = 1,
    ){}
}
