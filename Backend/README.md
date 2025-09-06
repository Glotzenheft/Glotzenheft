```bash
symfony console doctrine:migrations:diff
``` 

```bash
symfony console doctrine:migrations:migrate
```

Run an async worker for backups:

```bash
php bin/console messenger:consume async -vv
```