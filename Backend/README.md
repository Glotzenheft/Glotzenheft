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

Show running workers:

```bash
ps aux | grep messenger:consume
```

Kill all workers:

```bash
pkill -f messenger:consume
```