# 📺 Glotzenheft

Ein webbasierter Filme und Serientracker auf Basis von Daten aus der **The Movie Database**.  

## 📖 Über dieses Projekt

Das Glotzenheft wurde im Rahmen des Moduls **Softwareprojekt 5CS-SOPR-50** im 5. Semester des Studiengangs 
Informatik an der [Dualen Hochschule Sachsen - staatliche Studienakademie Leipzig](https://www.dhsn.de/leipzig) 
erstellt und soll dazu dienen, eine visuelle und analytische Übersicht der geschauten Serien und Filme darzustellen.  



## 🛠️ Installation

### Voraussetzungen

Um die Webanwendung korrekt betreiben zu können, wird ein [TMDB API-Token](https://www.themoviedb.org/settings/api/request) benötigt.  
Eine relationale Datenbank, wie MariaDB.

### Repository klonen

```bash
git clone https://github.com/Glotzenheft/Glotzenheft.git  
cd Glotzenheft
```

### Konfiguration
#### .env Datei für Docker erstellen
```
cp .env.example .env
```
- In der neuen .env Datei eine Datenbankverbindung unter DATABASE_URL hinterlegen.  
- Die Anwendung sollte auf jeden Fall mit einer MariaDB funktionieren.
- Des Weiteren muss bei TMDB_TOKEN ein TMDB API-Token hinterlegt werden.

#### .env.local Datei für lokalen Betrieb erstellen (auch nötig für Docker)
```
cd Backend
cp .env .env.local
```
- In der .env.local wieder die Datenbank-URL und TMDB API-Token eintragen.

#### Hinweis für die DB-URL
- Falls Docker genutzt wird, die Datenbank aber z.B. außerhalb von Docker läuft, muss eventuell host.docker.internal statt z.B. 127.0.0.1 als Hostnamen verwendet werden.

### Docker Image bauen und Setup Skripte starten
Im Root Verzeichnis:
```
docker compose build
docker compose run --rm -e BOOTSTRAP_ON_START=1 app true
```
Der 2. Befehl führt ein Setup Skript aus, sodass alles bereit sein sollte.  
Wird das Image neu gebaut, muss der 2. Befehl ggf. wieder ausgeführt werden.  

### Anwendung mithilfe von Docker starten
```
docker compose up
```

### Anwendung lokal starten

#### Backend Konfigurationen
Hinweis, die DB-URL darf lokal kein host.docker.internal nutzen.  
```
cd Backend  
composer install  
php bin/console doctrine:migrations:migrate  
php bin/console glotzenheft:tmdb:migrateGenres  
openssl genrsa -out config/private.pem 4096  
openssl rsa -in config/private.pem -pubout -out config/public.pem  
php bin/console messenger:consume async -vv  
```
#### Backend starten  
``
symfony serve
``

#### Frontend Konfiguration
``
cd ../Frontend  
npm install  
``

#### Frontend starten
``
ng serve --proxy-config proxy.local.json
``