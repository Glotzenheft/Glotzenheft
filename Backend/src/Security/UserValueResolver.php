<?php declare(strict_types=1);

namespace App\Security;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Controller\ValueResolverInterface;
use Symfony\Component\HttpKernel\ControllerMetadata\ArgumentMetadata;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

readonly class UserValueResolver implements ValueResolverInterface
{
    public function __construct(
        private EntityManagerInterface $entityManager
    ){}

    public function resolve(
        Request $request,
        ArgumentMetadata $argument
    ): iterable
    {
        if ($argument->getType() !== User::class)
        {
            return [];
        }

        /**
         * Get the user_id from the request which is set through the JwtAuthenticator
         * after successful authentication with the  JSON Web Token.
         */
        $userId = $request->attributes->get('user_id');
        if (!$userId)
        {
            return [];
        }

        $user = $this->entityManager->getRepository(User::class)->find($userId);
        if (!$user)
        {
            throw new NotFoundHttpException('User not found');
        }

        /**
         * The user object is now avaible for autowire.
         */
        return [$user];
    }
}