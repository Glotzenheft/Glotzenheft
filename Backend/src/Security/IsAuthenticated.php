<?php declare(strict_types=1);

namespace App\Security;

use Attribute;

#[Attribute(Attribute::TARGET_METHOD)]
class IsAuthenticated
{

}