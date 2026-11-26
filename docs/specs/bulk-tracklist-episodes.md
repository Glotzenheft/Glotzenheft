# Mehrere Tracklist-Episoden erstellen, bearbeiten und löschen

**Status:** Fachlich freigegeben

### 1. Nutzerziel und Umfang

Angemeldete Nutzer bearbeiten im Tab **„Tracklisten“** einer Serien-Detailseite mehrere Folgen der ausgewählten Trackliste. Sie können Folgen als geschaut erfassen, ein gespeichertes Schaudatum korrigieren oder leeren und Sichtungen aus der Trackliste entfernen. Der Editor speichert gemischte Änderungen gemeinsam. Für das Hinzufügen ohne Datum und das Entfernen gibt es außerdem Schnellaktionen direkt in der Staffelliste.

| Begriff | Bedeutung für die Umsetzung |
| --- | --- |
| **Katalogepisode** | Eine Folge der Serie aus `media.seasons[].episodes`. Ihre interne `episode.id` ist die `episode_id` im POST und Staffel-PATCH. Die sichtbare Episodennummer und die `tmdbEpisodeId` dienen der Anzeige bzw. der Zuordnung zu TMDB. |
| **Tracklist-Episode (TE) / Sichtung** | Der gespeicherte Eintrag zu einer Katalogepisode innerhalb einer TracklistSeason. Seine eigene `id` gehört in den Bulk-DELETE. Ein Eintrag mit `watchDateTime: null` bedeutet **geschaut, Datum unbekannt**. Fehlt der Eintrag, gilt die Folge für diese Trackliste als **nicht geschaut**. |
| **Trackliste** | Der ausgewählte Eintrag im `p-select` der Staffelansicht. `tracklist.id` ist die `tracklist_id` im POST und die Pfad-ID beim gezielten Laden einer Trackliste. |
| **TracklistSeason** | Die Staffelzuordnung der ausgewählten Trackliste. `tracklist.tracklistSeason.id` identifiziert sie für POST und Staffel-PATCH. `tracklist.tracklistSeason.season.id` identifiziert die zugehörige Katalogstaffel. |

Jeder Auswahl- oder Speichervorgang betrifft genau eine ausgewählte Trackliste und deren TracklistSeason. Dieselbe Katalogfolge kann in einer anderen TracklistSeason separat erfasst sein, etwa für einen Rewatch. Der initiale Episodenbereich und der Filter **„Alle Episoden anzeigen“** steuern die Anzeige. Über die Listenanpassung oder den Seitenfilter können auch weitere Episoden derselben Katalogstaffel bearbeitet werden.

### 2. Nutzerabläufe

Die folgenden Abläufe beschreiben das **vereinbarte Soll-Verhalten**. § 3 und § 5 halten den geprüften Stand der Schnittstellen und des Frontends fest.

#### 2.1 Einstieg und gemeinsamer Auswahlmodus

- In der tatsächlich genutzten Serien-Staffelansicht erscheint ein PrimeNG-`p-splitbutton` als erste Aktion in der `season-page-action-bar`, sobald eine Trackliste mit TracklistSeason ausgewählt ist. Der Hauptbutton **„Episoden bearbeiten“** öffnet den Editor. Das Pfeilmenü bietet **„Episoden auswählen und bearbeiten“**, **„Episoden auswählen und entfernen“** und **„Episoden auswählen und ohne Datum hinzufügen“**. Auf dem Mobilgerät fluchten die Außenkanten des gesamten Splitbuttons mit „Trackliste bearbeiten“. Das Menü öffnet sich direkt unter oder bei Platzmangel über dem Button. Die Seite behält ihre Scrollposition. Im normalen Modus stehen die vorhandenen Einzelaktionen pro Folge zur Verfügung.
- Eine Menüaktion aktiviert den Auswahlmodus in der betroffenen Staffel. Die aktuell sichtbaren Folgen bilden die Ausgangsliste. War **„Alle Episoden anzeigen“** aktiv, sind auch Folgen außerhalb der Tracklist-Spanne enthalten. TracklistSeason und Anzeigebereich bilden den Kontext der laufenden Auswahl.
- Der Nutzer kann während der Auswahl in der Staffelliste die Trackliste wechseln. Der Wechsel beendet den Auswahlmodus und verwirft alle Markierungen. Die neu gewählte Trackliste zeigt ihre Einzelaktionen. Beim Zurückwechseln startet auch die ursprüngliche Trackliste ohne Markierungen. Ein Tracklistwechsel löst keinen Schreibrequest aus. Für einen bereits geöffneten Editor mit ungespeicherten Änderungen gilt die Verwerfbestätigung aus § 2.3.
- In der Episodenliste ersetzt `p-checkbox` den Einzelbutton. Zum Bearbeiten sind alle sichtbaren Folgen auswählbar. Zum Hinzufügen sind es die Folgen ohne TE und zum Entfernen die Folgen mit TE, jeweils bezogen auf die aktive TracklistSeason. Ungeeignete Zeilen bleiben in ihrer Position sichtbar und haben eine deaktivierte Checkbox. Ein kurzer Hinweis bei den Checkboxen erklärt die Auswahlregel. Gibt es keine geeignete Folge, ist die zugehörige Schnellaktion nicht ausführbar.
- Eine eigene schwebende Auswahlleiste erscheint unten mittig. Die Leiste nutzt `p-toolbar` und `p-button`. Wie die Activity-Toolbar hat sie eine abgerundete, durchscheinende Fläche mit weichgezeichnetem Hintergrund und dezenter Kontur. Links steht „Auswahl abbrechen“, in der Mitte ausschließlich der Zähler **„N von M ausgewählt“**, rechts stehen „Alle auswählen“ und die konkrete Weiter-Aktion. M zählt die im aktuellen Modus auswählbaren Folgen. Der Auswahlhinweis steht außerhalb der Toolbar. **„Alle auswählen“** erfasst ausschließlich geeignete Folgen. Sind alle markiert, wechselt der Button zu **„Alle abwählen“**. Bei null Markierungen bleibt die Weiter-Aktion deaktiviert. Die Leiste darf auf kleinen Bildschirmen umbrechen. Unten bleibt genügend Platz, um die letzte Folge und ihre Checkbox zu erreichen. Auswahl, Zähler und Aktionen sind per Tastatur und mit zugänglichen Namen bedienbar.
- Bei den Schnellaktionen öffnet die Weiter-Aktion einen `p-confirmdialog`. Er nennt Anzahl, Tracklistname und die konkrete Folge der Aktion. **„Zurück“** schließt die Bestätigung und behält die Auswahl. **„Auswahl abbrechen“** beendet die Auswahl und stellt die Einzelbuttons wieder her. Während eines Schreibrequests sind die zugehörigen Aktionen gegen Mehrfachauslösung gesperrt.
- Nach bestätigtem API-Erfolg wird der sichtbare Zustand aktualisiert. Dann schließt der Editor bzw. endet der Auswahlmodus. Bei einem Fehler bleiben Dialogentwurf oder Auswahl erhalten und die Oberfläche zeigt eine Fehlermeldung. Bei einem fehlgeschlagenen Batch werden keine Einzelerfolge angenommen.
- Bei einem Konflikt durch veraltete Daten kann der Nutzer die betroffene Trackliste gezielt neu laden. Nach erfolgreichem Neuladen bleibt der Auswahlmodus aktiv. Beim Hinzufügen bleiben zuvor markierte Katalogepisoden ausgewählt, für die weiterhin keine TE existiert. Beim Entfernen bleiben zuvor markierte **TE-IDs** ausgewählt, die weiterhin existieren. Eine neue TE derselben Katalogepisode muss der Nutzer ausdrücklich auswählen. Die Leiste berechnet die Anzahl und die auswählbaren Folgen neu. Bei null Markierungen ist die Aktion deaktiviert. Jeder neue Schreibversuch erfordert eine erneute Bestätigung.

#### 2.2 Mehrere Episoden ohne Datum erstellen

1. **„Episoden auswählen und ohne Datum hinzufügen“** wählen und die gewünschten, noch nicht erfassten Folgen markieren.
2. In der Auswahlleiste **„N Episoden hinzufügen“** wählen. Die Bestätigung erklärt beispielsweise „3 Episoden werden ohne Schaudatum zu ‚Staffel 1 – Rewatch‘ hinzugefügt.“ **„Hinzufügen“** sendet einen Bulk-POST mit den markierten Katalogepisoden und jeweils `watch_date_time: null`.
3. Bei Erfolg werden die zurückgegebenen TEs mit ihren neuen IDs in die aktive TracklistSeason übernommen. Die Folgen erscheinen als geschaut ohne Datum. Ein Konflikt, etwa durch eine inzwischen erfasste Folge, lässt die Auswahl offen. Bereits gespeicherte Schaudaten bleiben erhalten.

Eine neue Sichtung **mit** Datum kann über den Editor im nächsten Ablauf gemeinsam mit anderen Änderungen erfasst werden.

#### 2.3 Mehrere Episoden bearbeiten

1. Der Hauptbutton öffnet einen gemeinsamen Dialog über den vorhandenen `DialogService`. Die sichtbare Überschrift nennt bei beiden Einstiegen den Namen der gewählten Trackliste. Die Kopfzeile nennt auch die Staffel. Initial sind beim Hauptbutton nur Folgen zwischen `startEpisodeNumber` und `endEpisodeNumber` zu sehen, jeweils einschließlich der Grenze. Eine fehlende Grenze ist offen. Sind beide Grenzen leer, startet der Editor mit der ganzen Staffel. **„Episoden auswählen und bearbeiten“** öffnet denselben Dialog mit genau den markierten Folgen, unabhängig von deren Tracklist-Spanne.
2. Jede Zeile zeigt Episodennummer und Titel in Staffelsortierung, einen `p-selectbutton` und einen `p-datepicker` für Datum und Uhrzeit. Auf kleinen Bildschirmen folgt die Statuswahl mit einem normalen Zeilenabstand direkt auf den Titel, darunter steht das Datum. Die Episodenliste scrollt innerhalb des Dialogs. Eine durchgehende horizontale Linie über den Footerbuttons trennt die Aktionen sichtbar ab. Bei gleicher Fenstergröße behalten Kopf- und Unterkante des Dialogs ihre Position beim Wechsel in die PickList, nach der Übernahme und bei leerer Liste.

   | Bedienelement | Interaktion |
   | --- | --- |
   | **„Geschaut“ / „Nicht geschaut“** | Der `SelectButton` verwendet Einzelauswahl mit `allowEmpty=false`. Eine bestehende TE startet mit „Geschaut“, eine Folge ohne TE mit „Nicht geschaut“. „Geschaut“ erhält im ausgewählten Zustand ein grünes Auge. „Nicht geschaut“ erhält ein rotes durchgestrichenes Auge. Bei einer zur Entfernung vorgemerkten bestehenden TE kennzeichnen **„Wird entfernt“** und ein Papierkorb die Wirkung. Text und zugänglicher Name identifizieren Zustand und Episode unabhängig von der Farbe. |
   | **Schaudatum** | Der DatePicker zeigt Datum und Uhrzeit im Format `TT.MM.JJJJ HH:mm`. Die Zeitauswahl bietet Stunde und Minute. Bei einer bestehenden Sichtung mit Datum wird der DatePicker vorausgefüllt. Bereits gespeicherte Sekunden bleiben beim Öffnen erhalten. „Geschaut“ aktiviert das Feld, „Nicht geschaut“ deaktiviert es und zeigt den Wert ausgegraut an. Bei einer bisher ungeschauten Folge startet das Feld leer. Eingetragene Daten bleiben beim vorübergehenden Umschalten im Entwurf erhalten. Wenn der Nutzer bei „Geschaut“ das Datum leert, bleibt die Sichtung bestehen. **„Jetzt“** ist auch bei „Nicht geschaut“ bedienbar. Der Klick setzt die Zeile auf „Geschaut“ und trägt das aktuelle lokale Datum mit Uhrzeit in den Entwurf ein. Erst „Änderungen speichern“ schreibt die Änderung. |
   | **Entwurfshinweise** | Geänderte Zeilen zeigen ihren Effekt, etwa **„Wird hinzugefügt“**, **„Datum geändert“** oder **„Wird entfernt“**. Der Footer fasst die tatsächlichen Änderungen zusammen, etwa „2 hinzufügen · 1 Datum ändern · 1 entfernen“. |

3. **„Liste anpassen“** wechselt im selben Dialog zu einer `p-picklist` **anstelle der Episodenauflistung**. Links steht **„Ausgeblendet“** (`source`), rechts **„Im Editor angezeigt“** (`target`). Auf kleinen Bildschirmen können die Listen untereinander stehen. Der Nutzer kann nach Folgenummer oder Titel suchen und Episoden über die Verschiebeschaltflächen verschieben. Nach Übernahme gilt weiterhin die Sortierung nach Episodennummer. **„Tracklist-Bereich wiederherstellen“** stellt innerhalb dieses Schritts die Tracklist-Spanne für die Anzeige wieder her. Im Footer stehen jetzt **„Zurück“** und **„Auswahl übernehmen“**. „Zurück“ verwirft die Änderungen an der sichtbaren Menge seit Öffnen der PickList. „Auswahl übernehmen“ übernimmt sie und kehrt zum Editor zurück.

   Die Sichtbarkeit einer Folge und ihr Entwurf sind getrennt. Ausgeblendete Änderungen zählen weiter zur Zusammenfassung. Wenn es solche Änderungen gibt, zeigt der Dialog beispielsweise **„2 Änderungen in ausgeblendeten Episoden“**. **„Geänderte anzeigen“** blendet sie wieder ein. Auch bei einer leeren Liste bleibt **„Liste anpassen“** erreichbar.

4. Die Footeraktionen **„Alle als geschaut markieren“** und **„Alle als nicht geschaut markieren“** ändern den Status aller aktuell eingeblendeten Entwurfszeilen. Vorhandene Schaudaten bleiben im Entwurf erhalten. Ausgeblendete Zeilen behalten Status und Datum. Erst beim Speichern gilt der gemeinsame Differenzvergleich einschließlich der Bestätigung für Entfernungen. Im Editor stehen außerdem **„Liste anpassen“**, **„Änderungen zurücksetzen“**, **„Abbrechen“** und **„Änderungen speichern“** zur Verfügung. Zurücksetzen und Verwerfen öffnen jeweils genau eine Bestätigung. Nach Bestätigen, „Zurück“ oder Schließen ist keine Bestätigung mehr sichtbar. „Zurück“ und Schließen behalten den Entwurf. Nach bestätigtem Zurücksetzen stellt der Editor Status und Daten aus der aktuellen Vergleichsbasis sowie die sichtbare Episodenmenge vom Öffnen des Dialogs wieder her. Bei Einstieg über eine manuelle Auswahl ist diese Auswahl der Ausgangspunkt für die Anzeige. Der Dialog bleibt offen. Beim Abbrechen oder Schließen mit fachlich geändertem Entwurf wird das Verwerfen bestätigt. Wurde der Editor aus dem Auswahlmodus geöffnet, führt ein Abbruch zurück zu den zuvor markierten Folgen. Wechselt der Nutzer danach die Trackliste, endet diese Auswahl gemäß § 2.1.
5. **„Änderungen speichern“** ist bei einem unveränderten Entwurf, einer ungültigen aktiven Datumseingabe oder einem ausstehenden Abgleich nach Timeout deaktiviert. Die Vergleichsbasis stammt beim Öffnen aus den geladenen Sichtungen und nach einem erfolgreichen Abgleich aus dessen GET-Antwort. Der Editor sendet nur Folgen, deren speicherbarer Endzustand von dieser Basis abweicht. Enthält der Entwurf Entfernungen, bestätigt der Nutzer sie gemeinsam, bevor der Staffel-PATCH gesendet wird. **„Zurück“** aus dieser Bestätigung behält den vollständigen Entwurf. Bei Erfolg aktualisiert die Antwort die erfassten Folgen der betroffenen Staffel. Die sichtbare Staffel, die Tracklist-Auswahl und der Seitenfilter bleiben erhalten.

   Bearbeiten zwei Sitzungen dieselbe Folge, gilt der zuletzt vom Server gespeicherte Endzustand dieser Folge. Eine spätere Datumsänderung kann eine frühere Korrektur überschreiben. Ein später gespeichertes „Nicht geschaut“ entfernt die aktuelle Sichtung für diese Katalogepisode. Folgen, die im späteren Request fehlen, behalten ihren serverseitigen Stand.
6. Bleibt die Antwort auf den Staffel-PATCH aus, ist das Speicherergebnis unbekannt. Der Editor bleibt mit seinem Entwurf offen. Vor einem weiteren Schreibversuch lädt der Nutzer die betroffene TracklistSeason gezielt über `GET /api/tracklist-seasons/{tracklistSeasonId}` neu.

   Nach erfolgreichem GET wird der geladene Serverstand zur neuen Vergleichsbasis. Der Editor vergleicht ausschließlich die im ursprünglichen PATCH übermittelten Folgen mit ihrem jeweiligen gewünschten Endzustand aus diesem Request. Bereits erfüllte Änderungen entfallen aus der Zusammenfassung. Noch abweichende Folgen behalten ihren gewünschten Zustand als Entwurf. Für alle anderen Folgen übernimmt der Editor den geladenen Serverstand.

   Der GET zeigt den aktuellen Stand unabhängig davon, wie er zustande kam. Er löst keinen automatischen PATCH aus. Bei verbleibenden Änderungen kann der Nutzer bewusst erneut speichern und bestätigt verbleibende Entfernungen erneut. Sind alle gewünschten Zustände bereits erfüllt, bleibt **„Änderungen speichern“** deaktiviert. Scheitert der GET, bleibt der Entwurf für einen erneuten Abgleich erhalten und der Schreibversuch bleibt gesperrt.

#### 2.4 Mehrere Tracklist-Episoden entfernen

1. **„Episoden auswählen und entfernen“** wählen und bestehende Sichtungen markieren. Eine TE ohne Datum ist ebenfalls auswählbar.
2. In der Auswahlleiste **„N Episoden entfernen“** wählen. In der Bestätigung steht beispielsweise „10 Sichtungen aus ‚Staffel 1 – Rewatch‘ entfernen? Die gespeicherten Schaudaten dieser Sichtungen gehen verloren.“ **„Entfernen“** sendet einen Bulk-DELETE mit den zuvor ausgewählten **TE-IDs**.
3. Nach `204` verschwinden genau diese Sichtungen aus der aktiven TracklistSeason. Die Serienfolgen bleiben in der Staffelliste sichtbar und erscheinen dort als nicht geschaut. Nicht markierte Sichtungen und Sichtungen in anderen Tracklisten behalten ihren Zustand. Erhält der Client `404`, wurde der Batch abgewiesen. Ein nach der Auswahl neu angelegter Eintrag für dieselbe Folge wird beim Wiederholen ausschließlich mit einer neuen Auswahl erfasst.

### 3. API-Vertrag

Die folgenden Angaben beschreiben den **verifizierten Ist-Zustand**. Alle drei Routen verwenden `#[IsAuthenticated]` und `#[MapRequestPayload]`. Der Client sendet JSON mit `Content-Type: application/json`. Der vorhandene `authInterceptor` ergänzt im Browser den Bearer-Token. Request-Felder verwenden die gezeigten Namen in snake_case, Response-Felder wie `tracklistEpisodes` und `watchDateTime` verwenden camelCase. Schaudaten sind lokale Datum-Uhrzeit-Strings im Format `YYYY-MM-DD HH:mm:ss` oder `null`. [JwtAuthenticator.php](../../Backend/src/Security/JwtAuthenticator.php), [auth.interceptor.ts](../../Frontend/src/app/core/interceptors/auth.interceptor.ts)

Syntaktisch defektes JSON ergibt `400`, ein nicht unterstütztes Format `415`, fehlende oder ungültige Authentifizierung `401`. Validierungsfehler beim DTO ergeben `422`, beispielsweise bei einer leeren Liste oder einem ungültigen Feldtyp. Bei DTO-Validierungsfehlern liefert der Listener `{ "errors": { "<Feldpfad>": "<Meldung>" } }`. Die fachlichen Fehler `404` und `409` kann der Client über den HTTP-Status unterscheiden. Die Anwendung braucht dafür kein festes zusätzliches Fehlerformat oder eine Liste erfolgreich verarbeiteter Zeilen. [ValidationExceptionListener.php](../../Backend/src/EventListener/ValidationExceptionListener.php)

Die Beispiele verwenden unabhängig voneinander die Trackliste `42`, deren TracklistSeason `50` und die Katalogstaffel `20`. Die Katalog-ID `303` steht für Folge E03. Eine zugehörige TE hat beispielsweise die eigene ID `703`.

#### 3.1 Erstellen mit `POST /api/tracklist-episodes/bulk`

Der Body enthält eine nicht leere `episodes`-Liste. Pro Eintrag sind die ganzzahligen Felder `tracklist_id` (Trackliste), `tracklist_season_id` (deren Staffelzuordnung) und `episode_id` (Katalogepisode) erforderlich. `watch_date_time` ist optional und ergibt beim Weglassen `null`. Die Schnellaktion sendet diesen Wert explizit.

```json
{
  "episodes": [
    { "tracklist_id": 42, "tracklist_season_id": 50, "episode_id": 305, "watch_date_time": null },
    { "tracklist_id": 42, "tracklist_season_id": 50, "episode_id": 306, "watch_date_time": null }
  ]
}
```

Bei `201 Created` folgt ein Array mit den erzeugten `TracklistEpisodeDetailDataDto` in Eingabereihenfolge. Der Client übernimmt die gelieferten TE-IDs und ordnet die Einträge anhand von `episode.id` zu.

```json
[
  {
    "id": 705, "createdAt": "2026-11-25 21:00:00", "updatedAt": "2026-11-25 21:00:00",
    "watchDateTime": null,
    "episode": { "id": 305, "episodeNumber": 5, "createdAt": "2026-10-01 10:00:00", "updatedAt": null }
  },
  {
    "id": 706, "createdAt": "2026-11-25 21:00:00", "updatedAt": "2026-11-25 21:00:00",
    "watchDateTime": null,
    "episode": { "id": 306, "episodeNumber": 6, "createdAt": "2026-10-01 10:00:00", "updatedAt": null }
  }
]
```

- `404` bei fehlender oder fremder TracklistSeason, unpassender `tracklist_id` oder einer Katalogepisode außerhalb der zugehörigen Staffel. Die Zuordnungen werden für die ganze Anfrage geprüft, bevor persistiert wird.
- `409` bei wiederholtem Paar aus TracklistSeason und Katalogfolge im Request oder bei bestehender Sichtung für dieses Paar. Die Migration erzwingt die Eindeutigkeit in der Datenbank. Scheitert die Anlage am Unique-Index, wird die ganze Anlage inklusive WatchActivities zurückgerollt. **Darum nutzt die Schnellaktion POST.** Ein Staffel-PATCH mit `watched: true` und Datum `null` könnte das inzwischen in einer anderen Sitzung gespeicherte Datum leeren.
- `Prefer: return=minimal` oder `?return=minimal` ergibt hier ebenfalls `201`, allerdings mit leerem Body. Für die Integration bleibt die normale Antwort mit den erzeugten Einträgen erforderlich.

[TracklistEpisodeController.php](../../Backend/src/Controller/API/Tracklist/TracklistEpisodeController.php), [CreateBulkTracklistEpisodeRequestDto.php](../../Backend/src/Model/Request/TracklistEpisode/CreateBulkTracklistEpisodeRequestDto.php), [CreateTracklistEpisodeRequestDto.php](../../Backend/src/Model/Request/TracklistEpisode/CreateTracklistEpisodeRequestDto.php), [TracklistEpisodeService.php](../../Backend/src/Service/Tracklist/TracklistEpisodeService.php), [Unique-Index-Migration](../../Backend/migrations/Version20261122000000.php)

#### 3.2 Gemischt bearbeiten mit `PATCH /api/tracklist-seasons/{tracklistSeasonId}/episodes`

Die Pfad-ID stammt aus `tracklist.tracklistSeason.id`. Der Body enthält eine nicht leere `episodes`-Liste. Pro Eintrag sind `episode_id` (positive Katalog-ID) und `watched` (Boolean) erforderlich. `watch_date_time` ist pro Eintrag optional und hat den Default `null`.

| Absicht | Was der Client sendet | Tatsächliche Wirkung |
| --- | --- | --- |
| Folge unverändert lassen | Den gesamten Eintrag aus `episodes` weglassen | Die bisherige Sichtung und ihr Datum bleiben erhalten. |
| Datum setzen | `watched: true` und den gewünschten String in `watch_date_time` | Eine vorhandene TE erhält das Datum. Fehlt die TE, wird sie mit Datum angelegt. |
| Datum leeren oder ohne Datum erfassen | `watched: true, watch_date_time: null` | Eine vorhandene TE bleibt mit geleertem Datum bestehen. Fehlt sie, wird sie ohne Datum angelegt. |
| Nur `watch_date_time` im Eintrag weglassen | `watched: true`, ohne Datumsfeld | Der Server behandelt das als `null`. Um für eine mitgesendete geschaut bleibende Folge ein Datum zu bewahren, müsste der Client es explizit senden. Im Editor wird eine unveränderte Folge ganz ausgelassen. |
| Sichtung entfernen | `watched: false` ohne Datumsfeld oder mit `null` | Die TE wird entfernt. Ist sie bereits abwesend, bleibt der gewünschte Zustand erreicht. Ein Datum zusammen mit `watched: false` ergibt `422`. |

Beispiel für `PATCH /api/tracklist-seasons/50/episodes`. E03 hat bereits eine Sichtung, E04 soll entfernt werden, E05 wird ohne Datum erfasst.

```json
{
  "episodes": [
    { "episode_id": 303, "watched": true, "watch_date_time": "2026-11-24 21:00:00" },
    { "episode_id": 304, "watched": false },
    { "episode_id": 305, "watched": true, "watch_date_time": null }
  ]
}
```

`200 OK` liefert ein vollständiges `TracklistSeasonDetailDataDto` mit allen weiterhin vorhandenen Sichtungen, einschließlich nicht mitgesendeter Einträge. Im Beispiel waren vor dem Speichern nur E03 und E04 erfasst. Die Antwort enthält daher E03 und E05. `season` und `episode` enthalten Kurzdetails. Titel und die vollständige Episodenliste kommen weiterhin aus den Mediendaten.

```json
{
  "id": 50,
  "createdAt": "2026-11-01 12:00:00",
  "updatedAt": "2026-11-01 12:00:00",
  "startEpisodeNumber": 3,
  "endEpisodeNumber": 6,
  "customSeasonNumber": null,
  "customPartNumber": null,
  "season": { "id": 20, "seasonNumber": 1, "createdAt": "2026-10-01 10:00:00", "updatedAt": null },
  "tracklistEpisodes": [
    {
      "id": 703, "createdAt": "2026-11-20 21:00:00", "updatedAt": "2026-11-25 21:00:00",
      "watchDateTime": "2026-11-24 21:00:00",
      "episode": { "id": 303, "episodeNumber": 3, "createdAt": "2026-10-01 10:00:00", "updatedAt": null }
    },
    {
      "id": 705, "createdAt": "2026-11-25 21:00:00", "updatedAt": "2026-11-25 21:00:00",
      "watchDateTime": null,
      "episode": { "id": 305, "episodeNumber": 5, "createdAt": "2026-10-01 10:00:00", "updatedAt": null }
    }
  ]
}
```

- `404` bei fehlender oder fremder TracklistSeason oder einer fehlenden bzw. staffelfremden Katalogepisode. `409` bei doppelter `episode_id` im selben Request. `422` beispielsweise bei fehlendem `watched`, leerem Batch, unlesbarem Datumsformat oder einem Datum für eine als ungeschaut gesendete Folge.
- Der Server lädt die eigene TracklistSeason für den Schreibvorgang gesperrt und prüft alle Ziel-Episoden vor der ersten Änderung. Die gemischte Anlage, Aktualisierung und Entfernung werden zusammen mit der WatchActivity-Synchronisierung in einer Transaktion ausgeführt. Schlägt ein Eintrag oder der Synchronisierungsvorgang fehl, wird der gesamte Batch verworfen. Die Prüfung verwendet die tatsächliche Katalogstaffel, damit auch Folgen außerhalb der Tracklist-Spanne zu dieser Staffel bearbeitet werden können.
- Die Sperre koordiniert gleichzeitige Schreibvorgänge. Der PATCH wendet jede übermittelte Änderung auf die zum Schreibzeitpunkt vorhandene Sichtung der Katalogepisode an. Der Vertrag enthält weder eine Versionsprüfung noch den Ausgangswert aus dem Editor. Ein zwischenzeitlich geändertes Datum allein löst daher keinen Konflikt aus.
- `Prefer: return=minimal` oder `?return=minimal` liefert `204` ohne Body. Der Editor fordert die volle Antwort an und übernimmt die Staffel einschließlich der endgültigen Liste der TEs. `tracklistEpisodes` bleibt nach der Entfernung ein JSON-Array.
- Der Einzel-PATCH unter `/api/tracklist-episodes/{tracklistEpisodeId}` unterscheidet per Feldpräsenz zwischen Datum behalten und leeren. Der Bulk-PATCH unter `/api/tracklist-episodes/bulk` arbeitet mit TE-IDs, verlangt für jeden Eintrag `watch_date_time` und aktualisiert nur vorhandene Einträge. Der gemischte Dialog benutzt ausschließlich den Staffel-PATCH. So bleiben alle Teilaktionen atomar.

[TracklistSeasonController.php](../../Backend/src/Controller/API/Tracklist/TracklistSeasonController.php), [PatchTracklistSeasonEpisodesDto.php](../../Backend/src/Model/Request/TracklistSeason/PatchTracklistSeasonEpisodesDto.php), [TracklistSeasonEpisodeStateDto.php](../../Backend/src/Model/Request/TracklistSeason/TracklistSeasonEpisodeStateDto.php), [TracklistSeasonService.php](../../Backend/src/Service/Tracklist/TracklistSeasonService.php), [TracklistSeasonRepository.php](../../Backend/src/Repository/TracklistSeasonRepository.php), [TracklistSeasonDetailDataDto.php](../../Backend/src/Model/Response/Tracklist/TracklistSeason/TracklistSeasonDetailDataDto.php), [TracklistEpisodeDetailDataDto.php](../../Backend/src/Model/Response/Tracklist/TracklistSeason/TracklistEpisode/TracklistEpisodeDetailDataDto.php), [UpdateTracklistEpisodeItemDto.php](../../Backend/src/Model/Request/TracklistEpisode/UpdateTracklistEpisodeItemDto.php), [ConditionalResponseTrait.php](../../Backend/src/Controller/API/Traits/ConditionalResponseTrait.php)

#### 3.3 Entfernen mit `DELETE /api/tracklist-episodes/bulk`

Der JSON-Body enthält `tracklist_episode_ids` als nicht leere Liste positiver ganzzahliger **TE-IDs**.

```json
{ "tracklist_episode_ids": [703, 704] }
```

`204 No Content` hat einen leeren Body. Damit ist die Löschung aller IDs dieses Requests bestätigt. Der Client entfernt sie lokal aus `tracklistEpisodes`. Er behält Katalogfolgen und alle anderen TE-IDs in der Ansicht.

- `422` bei ungültiger Liste, etwa Zahlen als Strings oder leerem Array. `409` bei doppelten IDs. `404`, sobald mindestens eine ID fehlt oder einem anderen Nutzer gehört. Das Repository lädt alle Einträge im Nutzerkontext, der Service prüft die vollständige Trefferzahl vor dem ersten `remove()` und führt die Löschungen in einem Flush aus.
- DELETE identifiziert die konkret ausgewählte Sichtung. Wurde sie zwischenzeitlich mit einer neuen TE-ID erneut erfasst, ist die alte ID unbekannt. Der Bulk-DELETE scheitert vollständig und erfasst die neue Sichtung mit der alten ID nicht.

[TracklistEpisodeController.php](../../Backend/src/Controller/API/Tracklist/TracklistEpisodeController.php), [DeleteBulkTracklistEpisodeRequestDto.php](../../Backend/src/Model/Request/TracklistEpisode/DeleteBulkTracklistEpisodeRequestDto.php), [TracklistEpisodeService.php](../../Backend/src/Service/Tracklist/TracklistEpisodeService.php), [TracklistEpisodeRepository.php](../../Backend/src/Repository/TracklistEpisodeRepository.php)

#### 3.4 Atomarität und aktualisierter Stand

Ein abgewiesener Batch enthält keine Teilerfolge. Die DTO-Validierung greift vor dem Service. POST und Staffel-PATCH schreiben TEs und WatchActivities in derselben Transaktion. Beim Löschen entfernt der Fremdschlüssel zu `tracklist_episode_id` die WatchActivity in derselben Datenbankoperation. Daraus folgt für die Oberfläche eine gemeinsame Erfolgs- bzw. Fehlerbehandlung pro Request. Bei einer unterbrochenen Verbindung oder einem Timeout ohne Serverantwort kann die Anwendung allein aus dem Transportfehler nicht ableiten, ob der Server gespeichert hat. In diesem Fall dient ein gezielter Reload zum Abgleich vor einem erneuten Schreiben.

Für den Abgleich im Editor liefert `GET /api/tracklist-seasons/{tracklistSeasonId}` mit `200` das aktuelle Staffel-DTO bzw. `404` bei fehlender oder fremder Staffelzuordnung. Die Antwort ist eine Momentaufnahme und enthält keine Aussage darüber, ob der ursprüngliche PATCH gespeichert wurde. Unterschiedliche Übereinstimmungen einzelner Folgen mit dem Entwurf zeigen daher keinen Teilerfolg des atomaren PATCH an. Im Frontend steht bereits `TracklistService.getTracklist(tracklistId)` für `GET /api/tracklists/{tracklistId}` zur Verfügung, wenn zusätzlich der zugehörige Tracklist-Stand gebraucht wird. Im normalen Erfolgsfall reichen die POST- und PATCH-Antworten bzw. die beim DELETE bestätigten IDs für die lokale Aktualisierung. [WatchActivitySynchronizer.php](../../Backend/src/Service/WatchActivity/WatchActivitySynchronizer.php), [WatchActivity-Migration](../../Backend/migrations/Version20261118160215.php), [TracklistController.php](../../Backend/src/Controller/API/Tracklist/TracklistController.php)

### 4. Fachliche Regeln und Akzeptanzbeispiele

- **`SCOPE-01`** Jede Aktion gehört zur beim Einstieg gewählten TracklistSeason. Der Hauptbutton öffnet den inklusiven Tracklist-Bereich, eine Bearbeitung aus dem Auswahlmodus öffnet die dort markierten Folgen.
- **`SELECT-01`** Der mittig platzierte Zähler „N von M ausgewählt“ zählt markierte und im jeweiligen Modus auswählbare Folgen. Sie zeigt die konkrete Aktion und erlaubt, die Auswahl vollständig zu setzen oder zu verlassen.
- **`SELECT-02`** Nach dem Neuladen bleiben zuvor markierte und weiterhin geeignete Katalogepisoden beim Hinzufügen bzw. weiterhin vorhandene markierte TE-IDs beim Entfernen ausgewählt. Vor dem nächsten Schreibrequest bestätigt der Nutzer die aktualisierte Auswahl erneut.
- **`SELECT-03`** Ein Tracklistwechsel in der Staffelliste beendet die Auswahl und verwirft alle Markierungen. Die neue Trackliste zeigt ihre Einzelaktionen. Der Wechsel sendet keinen Schreibrequest.
- **`CREATE-01`** Die Schnellaktion legt ausschließlich bisher nicht erfasste, markierte Folgen ohne Datum an.
- **`EDIT-01`** Status und Datum werden pro Folge geführt. Gespeichert wird nur die fachliche Differenz gegenüber der aktuellen Vergleichsbasis.
- **`EDIT-02`** „Geschaut ohne Datum“ behält bzw. erzeugt eine Sichtung. „Nicht geschaut“ entfernt eine bestehende Sichtung bei Bestätigung. Ein nur im Entwurf vorhandenes Datum bleibt beim Umschalten erhalten.
- **`LIST-01`** Die PickList verändert die Sichtbarkeit. Bearbeitungen an ausgeblendeten Folgen bleiben im Entwurf und werden in der Zusammenfassung berücksichtigt.
- **`EDIT-03`** Zurücksetzen stellt die Status und Daten der aktuellen Vergleichsbasis und die beim Öffnen sichtbare Episodenmenge wieder her. Zurücksetzen und Verwerfen erfordern jeweils genau eine Entscheidung. Bestätigtes Verwerfen gibt den Entwurf auf.
- **`EDIT-04`** Für dieselbe Folge gilt der zuletzt erfolgreich gespeicherte Endzustand. Eine Folge, deren ID im späteren PATCH fehlt, behält ihren bisherigen Serverstand.
- **`EDIT-05`** Sammelmarkieren ändert den Entwurfsstatus der sichtbaren Folgen unter Erhalt der Schaudaten. „Jetzt“ markiert eine einzelne Folge als geschaut und setzt ihr lokales Schaudatum. Beide Aktionen verwenden den bestehenden Speicherablauf.
- **`DELETE-01`** Die Schnellaktion entfernt ausschließlich die bestätigten TE-IDs. Die dargestellten Katalogfolgen bleiben verfügbar.
- **`SAVE-01`** Die Anwendung zeigt den neuen Serverzustand erst nach Erfolg. Bei Fehlern bleiben die Eingaben für Korrektur oder Abgleich verfügbar.
- **`SAVE-02`** Nach einem Staffel-PATCH ohne Antwort bleibt der Entwurf offen und weiteres Speichern erfordert einen erfolgreichen GET. Der GET setzt die Vergleichsbasis. Nur im ursprünglichen PATCH enthaltene Folgen, deren gewünschter Endzustand noch abweicht, bleiben als Änderungen sichtbar. Ein erneuter PATCH erfordert eine bewusste Speicheraktion mit erneuter Bestätigung verbleibender Entfernungen.

| AC-ID | Regel | Ausgangslage | Aktion | Erwartetes Ergebnis |
| --- | --- | --- | --- | --- |
| AC-SCOPE-01 | `SCOPE-01` | Dieselbe Katalogstaffel hat zwei Tracklisten. In der gewählten TracklistSeason `50` ist der Bereich E03–E06 hinterlegt. Auf der Seite werden alle Folgen angezeigt. | Hauptbutton öffnen. Danach abbrechen und über das Menü gezielt E01 und E07 zum Bearbeiten wählen. | Der Hauptbutton öffnet E03–E06 inklusive. Der zweite Einstieg öffnet E01 und E07. Beide Bearbeitungen zielen auf TracklistSeason `50`. In beiden Fällen ist ihr Tracklistenname als Überschrift sichtbar. |
| AC-SELECT-01 | `SELECT-01` | Sechs Folgen sichtbar, vier erfasst. | „Episoden auswählen und entfernen“, dann „Alle auswählen“, „Alle abwählen“ und „Auswahl abbrechen“. | Zwei Checkboxen sind deaktiviert. Der Zähler wechselt von „0 von 4 ausgewählt“ zu „4 von 4 ausgewählt“ und zurück. Bei null ist die Weiter-Aktion deaktiviert. Abbruch stellt die Einzelbuttons wieder her. |
| AC-SELECT-02 | `SELECT-03` | In Trackliste A sind drei Folgen markiert. | Zu Trackliste B und danach zurück zu A wechseln. | Beim Wechsel zu B verschwindet die Auswahlleiste und B zeigt die Einzelaktionen. Zurück in A sind alle drei Folgen abgewählt und die Einzelaktionen sichtbar. Beide Wechsel lösen keinen Schreibrequest aus. |
| AC-SELECT-03 | `SELECT-01` | Die Seite ist auf dem Mobilgerät bis zum Splitbutton gescrollt. | Menü öffnen, Auswahlmodus starten. | Der Splitbutton ist so breit wie „Trackliste bearbeiten“. Das Menü liegt am Button und die Seite springt nicht. Die transparente, gerundete Toolbar zeigt Abbruch links, den Zähler mittig und beide Auswahlaktionen rechts. |
| AC-CREATE-01 | `CREATE-01` | E03 ist mit Datum erfasst. E05 und E06 sind noch nicht erfasst. | Schnellaktion zum Hinzufügen, beide geeigneten Folgen auswählen und bestätigen. | Ein POST enthält die Katalog-IDs von E05 und E06 und explizit `null` je Datum. Nach `201` sind beide mit den neuen TE-IDs als geschaut ohne Datum sichtbar. E03 behält sein Datum. |
| AC-CREATE-02 | `CREATE-01`, `SAVE-01` | E05 und E06 wurden ausgewählt. Inzwischen wurde E05 in einem anderen Tab mit Schaudatum angelegt. | Hinzufügen bestätigen. | `409` für den Batch. E05 behält sein serverseitiges Datum. E06 wird durch diesen Request nicht angelegt. Die Auswahl bleibt offen und ein Abgleich ist möglich. |
| AC-CREATE-03 | `CREATE-01`, `SELECT-02` | Die Auswahl aus AC-CREATE-02 ist nach `409` offen. E05 wurde inzwischen erfasst und E06 ist weiterhin ohne Sichtung. | Trackliste neu laden und das Hinzufügen erneut bestätigen. | E05 wird abgewählt und ist deaktiviert. E06 bleibt markiert. Die Leiste zeigt „1 von 1 ausgewählt“, wenn E06 die einzige geeignete Folge ist. Erst nach erneuter Bestätigung geht ein POST ausschließlich für E06 raus. |
| AC-EDIT-01 | `EDIT-01` | E03 und E04 sind für denselben Editor ausgewählt und geschaut. E03 hat `2026-11-20 19:00:00`, E04 hat `2026-11-21 20:00:00`. | In beiden Zeilen ausschließlich das gemeinsame Feld **Schaudatum** bearbeiten. Für E03 `2026-11-24 21:00:00` einstellen, bei E04 das Datum leeren. | Ein PATCH enthält für beide Katalog-IDs `watched: true`. E03 hat danach `2026-11-24 21:00:00`, E04 hat `null`. Beide behalten ihre TE-ID und den Status „Geschaut“. |
| AC-EDIT-02 | `EDIT-01` | E03 und E04 sind wieder wie in AC-EDIT-01 vorausgefüllt und ausgewählt. | Ausschließlich E03 auf `2026-11-24 21:00:00` setzen und speichern. | Der PATCH enthält nur E03. Danach hat E03 den neuen Wert, E04 weiterhin exakt `2026-11-21 20:00:00`. |
| AC-EDIT-03 | `EDIT-02` | E05 hat keine Sichtung. | „Geschaut“ wählen, ein Datum eingeben, „Nicht geschaut“ wählen und wieder „Geschaut“ wählen. Dann das Datum leeren und speichern. | Der DatePicker ist zunächst leer und deaktiviert. Beim Zwischenwechsel ist das Datum ausgegraut, beim Wiedereinschalten ist es verfügbar. Nach Leeren und Speichern existiert E05 als Sichtung mit `watchDateTime: null`. |
| AC-EDIT-04 | `EDIT-01`, `EDIT-02` | E03 und E04 haben vorhandene Sichtungen. E05 fehlt. Eine weitere Sichtung E06 steht außerhalb der aktuellen Bearbeitung. | E03 ein neues Datum geben, E04 auf „Nicht geschaut“ setzen und E05 auf „Geschaut“ setzen. Dann speichern und Entfernung bestätigen. | Ein PATCH setzt das Datum von E03, entfernt E04 mit `watched: false` ohne Datum und erzeugt E05. Die Antwort zeigt E03, E05 und die unveränderte E06. E04 ist weiterhin als Katalogfolge verfügbar. |
| AC-EDIT-05 | `EDIT-01`, `EDIT-02` | E05 hat keine Sichtung. | „Geschaut“ wählen, ein Datum eingeben und wieder „Nicht geschaut“ wählen. | E05 hat denselben speicherbaren Zustand wie beim Öffnen. Das ausgegraute Entwurfsdatum erzeugt keine Änderung. Ist E05 die einzige bearbeitete Folge, ist Speichern deaktiviert. Bei weiteren Änderungen wird E05 im PATCH weggelassen. |
| AC-EDIT-06 | `EDIT-04` | Zwei Tabs öffnen E03 mit `2026-11-24 20:00:00`. | Tab A speichert `2026-11-24 21:00:00`. Danach speichert Tab B für E03 `2026-11-24 21:30:00`. | Beide PATCH-Requests erhalten `200`. Die zweite Antwort und die Trackliste enthalten für E03 `2026-11-24 21:30:00`. |
| AC-EDIT-07 | `EDIT-01`, `EDIT-04` | Tab B hat E03 und E04 geöffnet. Währenddessen speichert Tab A E03 mit `2026-11-24 21:00:00`. | Tab B speichert ausschließlich für E04 `2026-11-24 21:30:00`. | Der zweite PATCH enthält nur E04. Die Antwort enthält für E03 weiterhin `2026-11-24 21:00:00` und für E04 den neuen Wert `2026-11-24 21:30:00`. |
| AC-EDIT-08 | `EDIT-05`, `EDIT-02` | E03 mit Schaudatum und E05 ohne Sichtung sind sichtbar. E04 hat einen ausgeblendeten Datumsentwurf. | Erst alle sichtbaren Folgen als geschaut, dann als nicht geschaut markieren. Anschließend speichern. | Jede Aktion ändert ausschließlich den sichtbaren Status. Die Entwurfsdaten aller drei Folgen bleiben erhalten. Vor dem PATCH wird die Entfernung von E03 bestätigt. E05 bleibt im PATCH ausgelassen. |
| AC-EDIT-09 | `EDIT-05` | E05 ist ungeschaut, der DatePicker deaktiviert. | „Jetzt“ klicken und danach speichern. | Vor dem Speichern steht E05 bereits auf „Geschaut“, der DatePicker zeigt den lokalen Klickzeitpunkt. Erst das Speichern sendet diesen Endzustand. |
| AC-LIST-01 | `LIST-01` | E03 hat eine ungespeicherte Datumsänderung. E01 liegt außerhalb des anfänglichen Bereichs in derselben Katalogstaffel. | „Liste anpassen“, E03 ausblenden und E01 einblenden, „Auswahl übernehmen“. | Nach der PickList erscheint die neue Zeilenliste. Der Footer weist auf die ausgeblendete Änderung an E03 hin. „Geänderte anzeigen“ bringt sie mit Entwurfsdatum zurück. Das Übernehmen der PickList löst keinen Schreibrequest aus. |
| AC-LIST-02 | `LIST-01`, `EDIT-03` | Der Editor wurde mit E03 und E05 geöffnet. Das Datum von E03 ist geändert. | In der PickList zusätzlich E06 einblenden und „Zurück“ wählen. Danach E06 erneut einblenden, übernehmen und „Änderungen zurücksetzen“ bestätigen. | Genau eine Reset-Bestätigung erscheint. Nach der Entscheidung ist sie vollständig geschlossen. Beim ersten Zurück bleiben E03 und E05 mit Entwurf sichtbar. Nach dem bestätigten Zurücksetzen sind wieder E03 und E05 mit ihren ursprünglichen Daten sichtbar und Speichern ist deaktiviert. |
| AC-LIST-03 | `LIST-01` | Editor auf Desktop und mobil öffnen. | In die PickList wechseln, alle Folgen ausblenden und übernehmen. | Der Dialog bleibt in allen drei Ansichten gleich hoch. Die Linie über den Footerbuttons bleibt sichtbar. Mobil folgt die Statuswahl ohne großen Leerraum auf den Episodentitel. |
| AC-FLOW-01 | `SELECT-01`, `EDIT-03` | E03 und E05 wurden im Modus „auswählen und bearbeiten“ markiert. | Editor öffnen, Datum ändern, „Abbrechen“ und Verwerfen bestätigen. | Genau eine Verwerfbestätigung erscheint. Nach der Entscheidung bleibt keine zweite sichtbar. Kein Schreibrequest. Die Staffelansicht zeigt den Auswahlmodus mit E03 und E05 weiterhin markiert. |
| AC-DELETE-01 | `DELETE-01` | E03 (TE `703`), E04 (TE `704`, ohne Datum) und E05 (TE `705`) sind erfasst. | E03 und E04 markieren, aus der Bestätigung zunächst „Zurück“ wählen, erneut öffnen und bestätigen. | „Zurück“ behält beide Markierungen. Ein DELETE enthält nur `[703, 704]`. Nach `204` erscheinen E03 und E04 als nicht geschaut, E05 bleibt mit TE `705` erfasst. |
| AC-DELETE-02 | `DELETE-01`, `SAVE-01` | E03 und E04 wurden über TE-IDs `703` und `704` ausgewählt. E03 wurde zwischenzeitlich gelöscht und als TE `803` neu erfasst. | Die ursprüngliche Auswahl bestätigen. | Der DELETE ergibt `404`. TE `704` und die neue TE `803` bleiben erhalten. Die Oberfläche behandelt den Fehler für den ganzen Batch. |
| AC-DELETE-03 | `DELETE-01`, `SELECT-02` | Die Auswahl aus AC-DELETE-02 ist nach `404` offen. Auf dem Server existieren TE `704` und die neue TE `803`. | Trackliste neu laden und die verbleibende Auswahl erneut bestätigen. | TE `704` bleibt markiert, TE `803` ist auswählbar und zunächst abgewählt. Erst nach erneuter Bestätigung sendet die Anwendung `{"tracklist_episode_ids":[704]}`. Nach `204` ist TE `704` entfernt und TE `803` bleibt erhalten. |
| AC-SAVE-01 | `SAVE-01` | Ein gemischter PATCH enthält eine gültige Datumsänderung und eine Katalog-ID einer anderen Staffel. | Speichern bzw. den veralteten Request im Test senden. | `404`. Das frühere Datum bleibt serverseitig erhalten. Die Oberfläche zeigt den Fehler bei offenem Entwurf und übernimmt keine Änderungen als gespeichert. |
| AC-SAVE-02 | `EDIT-02`, `SAVE-01` | In der UI wurde ein Datum bei einer „Geschaut“-Zeile ungültig eingegeben. Der API-Test sendet separat `watched: false` zusammen mit einem Datum. | Im UI zu speichern versuchen und den separaten API-Fall ausführen. | Der Editor sperrt Speichern für die ungültige aktive Eingabe. Die API lehnt den widersprüchlichen Body mit `422` ab und führt keine Mutation aus. |
| AC-SAVE-03 | `SAVE-01` | Der Nutzer hat eine Änderung oder Schnellaktion bestätigt. Die Serverantwort steht aus. | Speichern bzw. Bestätigen nochmals auslösen. Anschließend einen API-Fehler simulieren. | Es bleibt bei einem Schreibrequest. Nach dem Fehler bleiben Daten und Auswahl bzw. Entwurf erhalten. Eine erneute Aktion ist nach Korrektur oder Abgleich möglich. |
| AC-SAVE-04 | `SAVE-02` | Der ursprüngliche PATCH für E03 und E04 bleibt ohne Antwort. E03 soll das Datum `2026-11-24 21:00:00` erhalten, E04 `2026-11-24 21:30:00`. | Die betroffene TracklistSeason neu laden. Der GET zeigt E03 mit `21:00:00` und E04 mit `20:00:00` am selben Tag. Danach erneut speichern. | Die GET-Antwort bildet die neue Vergleichsbasis und zeigt den aktuellen Stand unabhängig von seiner Entstehung. Nur E04 bleibt mit dem Wunschdatum `21:30:00` in der Zusammenfassung. Der Abgleich sendet keinen PATCH. Erst beim erneuten Speichern enthält der PATCH ausschließlich E04. |
| AC-SAVE-05 | `SAVE-02` | Derselbe Entwurf für E03 und E04 bleibt nach einem Timeout offen. | Die betroffene TracklistSeason neu laden. Der GET zeigt beide gewünschten Daten aus AC-SAVE-04. | Der Editor übernimmt den geladenen Stand als Basis. Die Zusammenfassung enthält keine offenen Änderungen und „Änderungen speichern“ ist deaktiviert. Der Abgleich sendet keinen PATCH. |
| AC-SAVE-06 | `SAVE-02` | Der PATCH für eine Datumsänderung an E03 und eine geplante Entfernung von E04 bleibt ohne Antwort. | Den Abgleich ausführen. Der erste GET schlägt fehl. Der zweite zeigt E03 mit dem gewünschten Datum und E04 weiterhin als geschaut. Dann erneut speichern. | Nach dem GET-Fehler bleibt der Entwurf erhalten und Speichern bleibt gesperrt. Der erfolgreiche GET lässt nur die Entfernung von E04 offen. „Zurück“ aus ihrer Bestätigung behält den Entwurf. Erst die erneute Bestätigung sendet den PATCH für E04. |

### 5. Umsetzung im bestehenden Frontend und Testnachweis

#### 5.1 Verifizierter Einstieg und Wiederverwendung

Der Feature-Einstieg ist **`/tmdb/media/tv/:mediaId/tracklists`**. Das App-Routing lädt die TMDB-Routen. Die Medien-Detailroute lädt `MediaDetailComponent` mit dem Kind-Tab `tracklists`. Dessen Template rendert für `MediaType.TV_SHOW` die `MediaDetailTvSeriesTracklistsTabComponent`. Das ältere `SeasonPageComponent` ist separat unter `/media/tv/:id` erreichbar. Die Namensgleichheit der CSS-Klasse `season-page-action-bar` in beiden Ansichten erklärt, warum die Routing-Kette für die Wahl des Templates wichtig ist. [App-Routen](../../Frontend/src/app/app.routes.ts), [TMDB-Routen](../../Frontend/src/app/features/the-movie-db/tmdb.routes.ts), [MediaDetail-Routen](../../Frontend/src/app/features/the-movie-db/media/components/media-detail/media-detail.routes.ts), [Tracklists-Tab-Template](../../Frontend/src/app/features/the-movie-db/media/components/media-detail/media-detail-tabs/media-detail-tracklists-tab/media-detail-tracklists-tab.component.html), [älteres MediaModule](../../Frontend/src/features/media/media.module.ts)

| Bestehender Baustein | Rolle bei der Umsetzung |
| --- | --- |
| [Serien-Tab-Template](../../Frontend/src/app/features/the-movie-db/media/components/media-detail/media-detail-tabs/media-detail-tracklists-tab/components/media-detail-tv-series-tracklists-tab/media-detail-tv-series-tracklists-tab.component.html) und [Serien-Tab-Komponente](../../Frontend/src/app/features/the-movie-db/media/components/media-detail/media-detail-tabs/media-detail-tracklists-tab/components/media-detail-tv-series-tracklists-tab/media-detail-tv-series-tracklists-tab.component.ts) | Einstieg, Accordion, Tracklist-Auswahl, Seitenfilter und Zeilen. `panels` verknüpft Katalogfolge und Sichtung über `item.episode.id`. `panel.season.episodes` enthält alle Katalogfolgen. `panel.episodes` ist bereits nach Filter und Tracklist-Spanne eingeschränkt. Über `openAuxiliary()` werden vorhandene Dialoge geöffnet und beim Verlassen des Tabs aufgeräumt. |
| [TracklistSelectionService](../../Frontend/src/app/features/the-movie-db/tracklists/tracklist/services/tracklist-selection.service.ts) | Speichert die aktive Trackliste je Medium und Staffel. Markierte Episoden und der Dialogentwurf sind temporärer Zustand des neuen Workflows. |
| [TracklistEpisodeFormDialogComponent](../../Frontend/src/app/features/the-movie-db/tracklists/tracklist-episode/components/tracklist-episode-form-dialog/tracklist-episode-form-dialog.component.ts) und [tracklist-form.utils.ts](../../Frontend/src/app/features/the-movie-db/tracklists/tracklist/utils/tracklist-form.utils.ts) | Vorbild für DynamicDialog, Bestätigung, Pending-Zustand und Fehlermeldung. `parseTracklistDate`, `optionalDate` und `formatTracklistDate(value, true)` für lokalen Datum-Uhrzeit-Roundtrip wiederverwenden. Der Einzel-Dialog setzt bei neuer Sichtung initial das aktuelle Datum. Der Mehrfacheditor startet gemäß § 2.3 mit einem leeren Feld. |
| [TracklistEpisodeService](../../Frontend/src/app/features/the-movie-db/tracklists/tracklist-episode/services/tracklist-episode.service.ts) und [CreateBulkTracklistEpisodeRequestDto](../../Frontend/src/app/features/the-movie-db/tracklists/tracklist-episode/models/request/create-bulk-tracklist-episode-request.dto.ts) | `createBulkTracklistEpisodes()` und der POST-Typ sind vorhanden. Die Schnelllöschung verwendet `deleteBulkTracklistEpisodes()` mit JSON-Body. |
| [MediaDetailStateService](../../Frontend/src/app/features/the-movie-db/media/services/media-detail-state.service.ts) und [TracklistService](../../Frontend/src/app/features/the-movie-db/tracklists/tracklist/services/tracklist.service.ts) | `upsertTracklistEpisode()`, `removeTracklistEpisode()` und `upsertTracklist()` ermöglichen lokale Aktualisierungen. `getTracklist(tracklistId)` lädt gezielt den Serverzustand für einen Abgleich. Die im Serien-Tab bestehende Methode `refreshTracklist()` meldet aktuell Tag-Fehler. Meldungen für Episoden sollen den Episodenvorgang benennen. |
| [MediaSeasonDetailResponseDto](../../Frontend/src/app/features/the-movie-db/media/models/response/media-season-detail-response.dto.ts), [TracklistSeasonDetailDataDto](../../Frontend/src/app/features/the-movie-db/tracklists/tracklist/models/response/tracklist-season/tracklist-season-detail-data.dto.ts) und [TracklistEpisodeDetailDataDto](../../Frontend/src/app/features/the-movie-db/tracklists/tracklist/models/response/tracklist-season/tracklist-episode/tracklist-episode-detail-data.dto.ts) | Vorhandene Typen für vollständige Episodenliste, gespeicherte Staffelzuordnung und einzelne Sichtung. Beim Staffel-PATCH die gespeicherten TE-Daten aus der Antwort übernehmen und die Katalogdaten für die Darstellung beibehalten. |

#### 5.2 Bausteine

- **`TracklistSeasonEpisodesDialogComponent`** mit eigenen Dateien `tracklist-season-episodes-dialog.component.ts`, `.html`, `.css` und `.spec.ts` im Tracklist-Feature. Der Dialog führt die aktuelle Vergleichsbasis, den Bearbeitungsentwurf und die sichtbare Episodenmenge separat anhand der Katalog-ID. Für den Abgleich nach Timeout verwendet er die gesendeten gewünschten Zustände. Der PickList-Ansichtsmodus erhält eine temporäre Kopie der sichtbaren Menge für „Zurück“. Beide Einstiege nutzen denselben Editor.
- **Auswahlleisten-Komponente** beim Serien-Tab, beispielsweise `episode-selection-toolbar.component.ts` mit Template und CSS. Sie verwendet `p-toolbar` mit lokaler Positionierung. Der Serien-Tab hält den Staffel- und Tracklist-Kontext sowie die Auswahl und öffnet Editor bzw. Bestätigung. Die Leiste zeigt Zähler, modusspezifische Aktion und einen laufenden Request an und meldet Nutzeraktionen an den Tab.
- **Angular-Client und Request-Typen für den Staffel-PATCH**, beispielsweise `tracklist-season.service.ts` und `patch-tracklist-season-episodes-request.dto.ts`. Der Typ bildet `episodes`, `episode_id`, `watched` und `watch_date_time` ab. Für die Response wird das bestehende `TracklistSeasonDetailDataDto` verwendet. `TracklistEpisodeService` verwendet eine Bulk-DELETE-Methode mit `{ body: { tracklist_episode_ids: ids } }` und leerer Response. POST verwendet die vorhandene Methode.
- Ergebnisse anhand des beim Einstieg festgehaltenen Tracklist- und Staffelkontexts in die geladenen Mediendaten übernehmen. PATCH ersetzt die betroffene `tracklistSeason` im aktuellen Tracklist-Datensatz. POST fügt die zurückgegebenen Einträge hinzu. DELETE entfernt die gesendeten TE-IDs nach `204`. Vorhandene Staffel-/Tracklist-Auswahl und Seitenfilter bleiben dabei erhalten. Verspätete Antworten nur übernehmen, wenn der Zielkontext in den geladenen Daten noch existiert.

#### 5.3 Testnachweis und Testzuordnung

Im Backend decken die vorhandenen Service-Unit-Tests die Bulk-Anlage mit Rückgabereihenfolge und Eindeutigkeit sowie den gemischten Staffel-PATCH, unveränderte Sichtungen und die Abweisung bei fremden oder ungültigen IDs ab. Beide Dateien wurden bei der Vertragsprüfung ausgeführt und alle 10 Tests mit 30 Assertions bestanden. Symfony-Argumentauflösung, Datumsauslassung, ausgewählte `400`/`422`-Fälle und das Response-Format wurden zusätzlich ohne Datenbankzugriff geprüft. Das transaktionale Verhalten und der Bulk-DELETE sind für diesen Entwurf aus Controller, Service und Schema nachvollzogen. Die vorhandenen Service-Tests sind kein HTTP- oder Datenbanktest des Bulk-DELETE. [TracklistEpisodeServiceTest.php](../../Backend/tests/Unit/Service/Tracklist/TracklistEpisodeServiceTest.php), [TracklistSeasonServiceTest.php](../../Backend/tests/Unit/Service/Tracklist/TracklistSeasonServiceTest.php)

Frontend-Tests nutzen Angular `TestBed`, Jasmine und Karma. Der vorhandene Serien-Tab-Test prüft die Klassenlogik mit gemocktem Dialog. Für sichtbare Abläufe zusätzlich mit gerendertem Template prüfen, dass die richtigen Schaltflächen, Kontrollen und Zustände erreichbar sind. [Testkonfiguration](../../Frontend/angular.json), [Serien-Tab-Test](../../Frontend/src/app/features/the-movie-db/media/components/media-detail/media-detail-tabs/media-detail-tracklists-tab/components/media-detail-tv-series-tracklists-tab/media-detail-tv-series-tracklists-tab.component.spec.ts), [MediaDetail-Fixtures](../../Frontend/src/app/features/the-movie-db/media/testing/media-detail.fixtures.ts)

| Geplanter Test | Nachweis |
| --- | --- |
| **Serien-Tab und Auswahlleiste** | `AC-SCOPE-01`, `AC-SELECT-01`, `AC-SELECT-02`, `AC-FLOW-01`, `AC-CREATE-01` bis `AC-CREATE-03`, `AC-DELETE-01` bis `AC-DELETE-03`, `AC-SAVE-03`. Einstieg, Auswahl, Bestätigung, Abbruch und sichtbare Zustandsänderung nach Erfolg prüfen. Den Tracklistwechsel und den Rückwechsel mit gerendertem Template prüfen und sicherstellen, dass sie keine Mutation aufrufen. Für den Konfliktfall die gezielte GET-Antwort simulieren und Markierungen, Zähler und den Request nach erneuter Bestätigung prüfen. |
| **Editor-Komponententest, neu** | `AC-SCOPE-01`, `AC-EDIT-01` bis `AC-EDIT-07`, `AC-LIST-01`, `AC-LIST-02`, `AC-FLOW-01`, `AC-SAVE-01` bis `AC-SAVE-03`. Startfolgen, Einzelauswahl, Datumsentwurf, PickList, Zurücksetzen, Verwerfen, Mehrfachklicks und Fehlerzustand prüfen. Für die Tab-Fälle den gespeicherten Serverstand in der PATCH-Antwort simulieren und prüfen, dass der Editor ihn übernimmt und nur geänderte Folgen sendet. Der bestehende Einzel-Dialog-Test dient als Muster. [Einzel-Dialog-Test](../../Frontend/src/app/features/the-movie-db/tracklists/tracklist-episode/components/tracklist-episode-form-dialog/tracklist-episode-form-dialog.component.spec.ts) |
| **Editor-Komponententest zum Abgleich nach Timeout, neu** | `AC-SAVE-04`, `AC-SAVE-05`, `AC-SAVE-06`. PATCH ohne Antwort und danach erfolgreiche bzw. fehlgeschlagene GETs simulieren. Sichtbare Zusammenfassung, Sperre von Speichern, Erhalt des Entwurfs und erneute Bestätigung bei Entfernung prüfen. Eine im ursprünglichen PATCH ausgelassene Folge übernimmt den GET-Stand und erscheint nicht im nächsten PATCH. Der Abgleich sendet in keinem der Fälle automatisch einen PATCH. |
| **API-Service-Tests mit `HttpTestingController`** | Den vorhandenen Test für Bulk-POST wiederverwenden und um DELETE mit Body und leerem `204` erweitern. Für PATCH Methode, Pfad mit TracklistSeason-ID und den exakten JSON-Body prüfen. Dazu gehört bei `AC-EDIT-01`, `AC-EDIT-02` und `AC-EDIT-04` die Unterscheidung zwischen Datum setzen, explizitem `null`, `watched: false` ohne Datumsfeld und komplett ausgelassener Folge. Die Service-Tests simulieren `404`, `409` und `422`. [TracklistEpisodeService-Test](../../Frontend/src/app/features/the-movie-db/tracklists/tracklist-episode/services/tracklist-episode.service.spec.ts) |
| **API-Aufrufe beim Abgleich** | Für `AC-SAVE-04` bis `AC-SAVE-06` die Reihenfolge der Requests prüfen. Auf den Timeout des Staffel-PATCH folgt ein GET für dieselbe TracklistSeason. Ein weiterer PATCH folgt erst nach erfolgreichem GET und bewusster Speicheraktion. Sein Body enthält ausschließlich die verbleibenden Änderungen. |
| **State-Service-Test** | Den [vorhandenen State-Test](../../Frontend/src/app/features/the-movie-db/media/services/media-detail-state.service.spec.ts) um den Austausch der einen Staffel nach PATCH sowie das Hinzufügen und Entfernen mehrerer Einträge ergänzen. Andere Tracklisten und später geladene Medien behalten ihren Zustand. |
| **Regressionen** | Überschrift mit Tracklistenname aus beiden Einstiegen (`AC-SCOPE-01`). Bei Zurücksetzen und Verwerfen im gerenderten UI vor der Entscheidung genau eine und danach null sichtbare Bestätigungen zählen (`AC-LIST-02`, `AC-FLOW-01`). Mobil das Menü an Serien-Splitbutton und Tracklist-Card bei gescrollter Ansicht öffnen und Menüposition sowie Scrollposition vergleichen (`AC-SELECT-03`). |
| **Neue Bedienung und Gestaltung** | Im Komponententest sichtbare und ausgeblendete Entwürfe, Schaudaten, Schreibzeitpunkt und Entfernungsbestätigung für `AC-EDIT-08/09` prüfen. Im Browser die Anfangshöhe mit PickList und leerer Liste vergleichen und Zeilenabstand, Footerlinie, Buttonbreite sowie Toolbar-Anordnung einschließlich Zähler prüfen (`AC-LIST-03`, `AC-SELECT-01/03`). |
| **Manueller UI-Durchlauf** | Die geroutete Serienansicht im Browser öffnen. Mobilansicht und Desktop, Tab-Navigation und sichtbaren Fokus prüfen. Die Auswahlleiste lässt die letzte Episode bedienbar. Beim Wechsel von Bestätigung oder PickList zurück zum Editor bleiben Auswahl und Entwurf erhalten. |

### 6. Offene Entscheidungen

Für den beschriebenen Umfang sind die fachlichen Entscheidungen getroffen.
