# WAT4 Abschlussprojekt – Testbericht Mealie

## 1. Projektüberblick

Für das Abschlussprojekt wurde die bestehende Webanwendung Mealie getestet.

Mealie ist eine selbst hostbare Rezept- und Essensplanungsanwendung. Die Anwendung bietet unter anderem Funktionen zum Erstellen, Anzeigen, Suchen und Verwalten von Rezepten.

Das Projekt basiert auf einem Fork des öffentlichen Mealie-Repositories. Die Tests wurden in einer eigenen Teststruktur innerhalb des Repositorys ergänzt.

Repository: https://github.com/JG78horAz/Mealie

## 2. Team und verwendete Hilfsmittel

### Teammitglieder

- Patrick Boettger
- Lilhofer

### Verwendete KI-Tools

- ChatGPT / WAT zur Unterstützung bei:
  - Teststruktur
  - Fehlersuche
  - Dokumentationsstruktur

## 3. Testumgebung

Die Anwendung wurde lokal über Docker gestartet.

### Anwendung

- Anwendung: Mealie
- Lokale URL: `http://localhost:9091`
- Docker-Image: `mealie:dev`
- Containername: `mealie`
- Interner Port: `9000`
- Externer Port: `9091`
- Datenbank: SQLite innerhalb des Docker-Volumes

### Testbenutzer

Für die Tests wurde ein eigener Testbenutzer verwendet:

- Benutzername: `test`
- Name: `Test User`
- E-Mail: `test@example.com`
- Passwort: `Test1234!`

### Playwright-Testprojekt

Die Tests befinden sich im Ordner:

```text
playwright-tests/
```

Die Playwright-Konfiguration verwendet:

```text
baseURL: http://localhost:9091
Browser: Chromium
Reporter: HTML Reporter
Workers: 1
```

Die Tests können lokal mit folgendem Befehl ausgeführt werden:

```bash
cd playwright-tests
npx playwright test
```

Der HTML-Testbericht kann mit folgendem Befehl geöffnet werden:

```bash
npx playwright show-report
```

## 4. Teststruktur

Die Tests wurden nach Personen und Testarten getrennt.

```text
playwright-tests/tests/
├── boettger/
│   ├── e2e/
│   ├── integration/
│   ├── load/
│   └── unit/
├── helpers/
└── lilhofer/
    ├── e2e/
    ├── integration/
    ├── load/
    └── unit/
```

Der gemeinsame Login-Helper liegt unter:

```text
playwright-tests/tests/helpers/auth.ts
```

Dadurch können beide Projektmitglieder dieselbe Login-Funktion für E2E-Tests verwenden.

## 5. Testisolation

Die Tests verwenden eindeutige Testdaten, damit mehrere Testläufe hintereinander möglich sind.

Rezeptnamen werden mit `Date.now()` erzeugt. Dadurch entstehen eindeutige Namen und vorhandene Daten aus vorherigen Testläufen verursachen keine direkten Konflikte.

Beispiel:

```ts
const recipeName = `WAT4 Test Recipe ${Date.now()}`;
```

Die Tests werden außerdem mit nur einem Worker ausgeführt. Dadurch werden Seiteneffekte durch parallele UI-Tests reduziert.

## 6. Testübersicht

### Patrick Boettger

| Testart | Anzahl | Beschreibung |
|---|---:|---|
| Unit Tests | 6 | Hilfslogik für Rezepttitel, Slugs, Zeiten und Portionen |
| Integration Tests | 3 | API-Login und authentifizierter Benutzer-Endpunkt |
| E2E Tests | 2 | Rezept erstellen, Rezept suchen und öffnen |
| Load Test | 1 | Rezeptlisten-Endpunkt mit Ramp-up und Ramp-down |
| Gesamt | 12 |

### Lilhofer

| Testart | Anzahl | Beschreibung |
|---|---:|---|
| Unit Tests | 5 | Passwortbewertung / Login-Logik |
| Integration Tests | 3 | API-Authentifizierung und Rezept-API |
| E2E Tests | 2 | Login und Rezeptanlage über UI |
| Load Test | 1 | Parallele API-Anfragen |
| Gesamt | 11 |

### Gesamtprojekt

| Kategorie | Anzahl |
|---|---:|
| Patrick Boettger | 12 |
| Lilhofer | 11 |
| Gesamt | 23 |


## 7. Unit Tests

### Patrick Boettger

Die Unit Tests von Patrick Boettger befinden sich in:

```text
playwright-tests/tests/boettger/unit/recipe-unit.spec.ts
```

Getestet wird reine Hilfslogik ohne Browser und ohne API-Zugriff.

Die Unit Tests prüfen:

1. Entfernen von Leerzeichen am Anfang und Ende eines Rezepttitels
2. Normalisierung mehrfacher Leerzeichen innerhalb eines Titels
3. Ablehnung zu kurzer Rezepttitel
4. Erzeugung eines URL-freundlichen Slugs
5. Berechnung der gesamten Zubereitungszeit
6. Formatierung von Portionstexten

Diese Tests sind schnell, stabil und unabhängig von der laufenden Mealie-Anwendung.

### Lilhofer

Die Unit Tests von Lilhofer befinden sich in:

```text
playwright-tests/tests/lilhofer/unit/login-unit.spec.ts
```

Getestet wird isolierte Logik zur Bewertung von Passwörtern beziehungsweise Login-Daten. Die Tests laufen ohne Browser und ohne API-Zugriff.

Die Unit Tests prüfen:

1. Ein leeres Passwort erhält den Score 0.
2. Ein zu kurzes Passwort erhält den Score 0.
3. Ein Passwort mit einem blockierten Login-Begriff erhält den Score 0.
4. Ein gemischtes Passwort erhält einen höheren Score als ein rein kleingeschriebenes Passwort.
5. Der Passwort-Score steigt nicht über 100.

Diese Tests prüfen kleine, klar abgegrenzte Logik und sind unabhängig von der laufenden Mealie-Anwendung.

## 8. Integration Tests

### Patrick Boettger

Die Integration Tests von Patrick Boettger befinden sich in:

```text
playwright-tests/tests/boettger/integration/recipe-api-integration.spec.ts
```

Diese Tests prüfen das Zusammenspiel zwischen Testcode, Mealie-API und Authentifizierung.

Die Integration Tests prüfen:

1. Der Benutzer-Endpunkt lehnt nicht authentifizierte Requests ab.
2. Der API-Login liefert ein gültiges Access Token.
3. Der authentifizierte Benutzer-Endpunkt liefert den Testbenutzer zurück.

Dadurch wird geprüft, ob die API korrekt erreichbar ist und ob die Authentifizierung mit dem Testbenutzer funktioniert.

### Lilhofer

Die Integration Tests von Lilhofer befinden sich in:

```text
playwright-tests/tests/lilhofer/integration/api-integration.spec.ts
```

Diese Tests prüfen das Zusammenspiel zwischen Playwrights API-Testfunktionen, der Mealie-API und der Authentifizierung.

Die Integration Tests prüfen:

1. Der Benutzer-Endpunkt benötigt eine Authentifizierung.
2. Der API-Login gibt den aktuell angemeldeten Benutzer zurück.
3. Ein Rezept kann über die API erstellt und anschließend wieder geladen werden.

Damit wird geprüft, ob die API-Endpunkte nicht nur einzeln erreichbar sind, sondern auch im Zusammenspiel mit Authentifizierung und Rezeptdaten korrekt funktionieren.

## 9. E2E Tests

### Patrick Boettger

Die E2E Tests von Patrick Boettger befinden sich in:

```text
playwright-tests/tests/boettger/e2e/recipes-e2e.spec.ts
```

Die Tests verwenden Playwright und steuern die Anwendung über den Browser.

Getestet wird:

1. Ein Rezept mit eindeutigem Titel wird über die Benutzeroberfläche erstellt.
2. Ein erstelltes Rezept wird über die Suche gefunden und geöffnet.

Damit werden zentrale Nutzeraktionen der Anwendung getestet:

- Login
- Navigation
- Rezeptanlage
- Rezeptsuche
- Öffnen einer Rezeptdetailseite

### Lilhofer

Die E2E Tests von Lilhofer befinden sich in:

```text
playwright-tests/tests/lilhofer/e2e/recipe-ui.spec.ts
```

Die Tests verwenden Playwright und testen die Anwendung aus Sicht eines Benutzers im Browser.

Getestet wird:

1. Nach einem gültigen Login wird die Rezept-Startseite angezeigt.
2. Ein neues Rezept kann über das Formular erstellt werden.

Damit werden zentrale UI-Funktionen geprüft:

- Login über die Benutzeroberfläche
- Laden der Startseite
- Öffnen der Rezeptanlage
- Ausfüllen des Rezeptformulars
- Erstellen eines neuen Rezepts

## 10. Load Tests

### Patrick Boettger

Der Load Test von Patrick Boettger befindet sich in:

```text
playwright-tests/tests/boettger/load/recipe-load.spec.ts
```

Der Test prüft den Rezeptlisten-Endpunkt der Mealie-API unter stufenweiser Last.

Getesteter Endpunkt:

```text
GET /api/recipes
```

Vor dem Load Test wird ein API-Login durchgeführt:

```text
POST /api/auth/token
```

#### Lastprofil Patrick Boettger

Der Load Test verwendet ein Ramp-up- und Ramp-down-Profil:

| Phase | Virtuelle Nutzer / parallele Requests |
|---|---:|
| Ramp-up | 1 |
| Ramp-up | 5 |
| Ramp-up | 10 |
| Ramp-up | 15 |
| Maximallast | 20 |
| Ramp-down | 15 |
| Ramp-down | 10 |
| Ramp-down | 5 |
| Ramp-down | 1 |

Insgesamt werden damit 82 authentifizierte API-Requests ausgeführt.

#### Gemessene Werte Patrick Boettger

Pro Stufe werden folgende Werte erfasst:

- Anzahl paralleler Requests
- Dauer der Stufe in Millisekunden
- Anzahl erfolgreicher Requests
- Anzahl fehlerhafter Requests

Zusätzlich werden am Ende zusammengefasst:

- Gesamtanzahl Requests
- Gesamtanzahl Fehler
- Gesamtdauer
- Erfolgsrate

#### Ziel des Load Tests Patrick Boettger

Ziel ist nicht, die absolute Belastungsgrenze von Mealie zu bestimmen.

Der Test soll prüfen, ob ein zentraler API-Endpunkt bei steigender und anschließend sinkender paralleler Last stabil erreichbar bleibt.

#### Erwartung Patrick Boettger

Der Test gilt als erfolgreich, wenn:

- keine Fehlerantworten auftreten
- jede Laststufe unter 10 Sekunden abgeschlossen wird
- die Erfolgsrate 100 Prozent beträgt

### Lilhofer

Der Load Test von Lilhofer befindet sich in:

```text
playwright-tests/tests/lilhofer/load/recipes-load.spec.ts
```

Der Test prüft, ob die Rezeptliste parallele API-Anfragen verarbeiten kann.

Getesteter Endpunkt:

```text
GET /api/recipes
```

Der Test simuliert mehrere gleichzeitige API-Zugriffe auf den Rezeptlisten-Endpunkt. Dabei wird geprüft, ob die parallelen Requests erfolgreich beantwortet werden.

#### Ziel des Load Tests Lilhofer

Ziel ist zu prüfen, ob der Rezeptlisten-Endpunkt bei gleichzeitigen Zugriffen stabil bleibt und keine Fehlerantworten liefert.

Der Test ist ein einfacher API-basierter Load Test. Er untersucht nicht die maximale Belastungsgrenze der Anwendung, sondern prüft das Verhalten bei parallelen Requests.

### Ergebnis der Load Tests

Die Load Tests wurden lokal gegen die Docker-basierte Mealie-Instanz ausgeführt.

Die Requests wurden erfolgreich verarbeitet und die Testläufe wurden bestanden.

Die genaue Konsolenausgabe kann über Playwright eingesehen werden:

```bash
npx playwright test tests/boettger/load
npx playwright test tests/lilhofer/load
```

## 11. Testausführung

Alle Tests können mit folgendem Befehl ausgeführt werden:

```bash
cd playwright-tests
npx playwright test
```

Die Testliste kann mit folgendem Befehl angezeigt werden:

```bash
npx playwright test --list
```

Beim letzten geprüften Stand wurden insgesamt 23 Tests erkannt.

## 12. CI/CD Pipeline <<<<<<<<<<<<<<<<<<<<<<<TBD

Für das Projekt ist eine CI/CD-Pipeline mit GitHub Actions vorgesehen.

Die Pipeline soll bei Pushes und Pull Requests automatisch die Playwright-Tests ausführen.

Geplanter Workflow:

1. Repository auschecken
2. Node.js installieren
3. Abhängigkeiten im Ordner `playwright-tests` installieren
4. Playwright-Browser installieren
5. Tests ausführen
6. Testbericht als Artefakt speichern

Die CI/CD-Pipeline stellt sicher, dass die Tests nicht nur lokal, sondern auch automatisiert im Repository ausgeführt werden können.

## 13. Bewertung der Testabdeckung

Die Tests decken mehrere Ebenen der Testpyramide ab:

- Unit Tests für kleine, isolierte Logik
- Integration Tests für API und Authentifizierung
- E2E Tests für vollständige Nutzerabläufe im Browser
- Load Tests für parallele Zugriffe auf einen zentralen API-Endpunkt

Dadurch werden sowohl einzelne Funktionen als auch das Zusammenspiel mehrerer Komponenten geprüft.

## 14. Fazit

Das Projekt erfüllt die geforderten Testarten und die Mindestanzahl an Tests pro Person.

Die Anwendung wurde lokal mit Docker betrieben und mit Playwright getestet.

Die Tests sind nach Personen und Testarten strukturiert.

Für zentrale Funktionen wie Login, Rezeptanlage, Rezeptsuche, API-Authentifizierung und parallele API-Zugriffe wurden automatisierte Tests erstellt.

Die Gesamtzahl von 23 Tests liegt über der Mindestanforderung von 22 Tests.
