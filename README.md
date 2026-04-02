# 1 vs 100 (SRF-inspiriertes Partyspiel)

Ein webbasiertes Multiplayer-Quiz, das das TV-Format **1 gegen 100** nachbildet. Eine Person agiert als Kandidat:in auf der Bühne bzw. Host, bis zu 100 Mitspieler:innen bilden den Mob und treten über ihre Smartphones gegeneinander an. Der Host steuert den Ablauf und projiziert die Host-Ansicht z. B. per Beamer.

## Konzept & Ablauf

- **Lobby & Beitritt**: Spieler melden sich per Smartphone auf `/player.html` mit ihrem Namen an. Der Host öffnet `/host.html` auf dem Präsentationsgerät.
- **Fragenrunde**: Der Host startet die nächste Frage. Alle verbundenen Spieler erhalten sie synchron und wählen eine Antwort.
- **Auflösung**: Der Host löst die Frage auf. Falsche Antworten werden eliminiert (Status "ausgeschieden"), richtige bringen einen Punkt.
- **Mob-Tracking**: Die Host-Ansicht zeigt die verbleibende Mob-Grösse, den Status aller Teilnehmenden und einen einfachen Scoreboard-Vergleich.
- **Reset**: Über einen Knopf kann der Host den Mob und die Punkte zurücksetzen, um neue Runden zu starten.

## Tech-Stack

- **Backend**: Node.js mit Express + Socket.IO für Echtzeit-Kommunikation.
- **Frontend**: Statische HTML/CSS-Seiten mit Socket.IO-Client-Skripten für Host- und Spieler-Ansicht.
- **Daten**: Beispiel-Fragen in `data/questions.json` (können laufend erweitert werden).

## Schnellstart im CLI

```bash
npm install
npm start
```

Öffne danach im Browser:
- Host-Ansicht: `http://localhost:3000/host.html`
- Spieler-Ansicht (für Smartphones): `http://localhost:3000/player.html`

### Hosting im Codex-CLI (diese Umgebung)

1. Installieren und starten:

   ```bash
   npm install
   npm start
   ```

2. Im Vorschau-Browser die oben genannten URLs öffnen. Der Host nutzt `/host.html` auf dem Beamer/Screen, alle Spielenden öffnen `/player.html` auf ihren Smartphones (im selben Netzwerk/über den weitergeleiteten Port).
3. Optional kannst du für Hot-Reload lokal `npx nodemon server.js` verwenden. In der Codex-CLI genügt i. d. R. `npm start` und ein manuelles Neuladen der Seite bei Codeänderungen.

## Schritt-für-Schritt: Von 0 bis laufendes Spiel (sehr detailliert)

> Wichtig: Um das Spiel zu starten, brauchst du **kein Codex CLI**. Das Spiel ist eine normale Node.js-Webapp und läuft in jedem Terminal.

### 1) Node.js installieren

1. Öffne https://nodejs.org
2. Lade die **LTS-Version** herunter (empfohlen).
3. Installiere Node.js mit den Standardoptionen.
4. Terminal neu öffnen und prüfen:

```bash
node -v
npm -v
```

Wenn beide Befehle eine Version anzeigen, ist alles korrekt installiert.

### 2) Projektordner besorgen

Wenn du das Repository schon hast, gehe direkt zu Schritt 3.

```bash
git clone <DEIN-REPO-URL>
cd 1vs100
```

### 3) Abhängigkeiten installieren

```bash
npm install
```

Das kann beim ersten Mal 1–3 Minuten dauern.

### 4) Server starten

```bash
npm start
```

Wenn alles funktioniert, siehst du im Terminal eine Meldung, dass der Server läuft (Standard: Port 3000).

### 5) Spiel im Browser öffnen

- Host/Moderator: `http://localhost:3000/host.html`
- Spieler: `http://localhost:3000/player.html`

### 6) Sofort-Funktionstest (ohne Smartphones)

1. Öffne 2 Tabs/Fenster:
   - Tab A: Host (`/host.html`)
   - Tab B: Player (`/player.html`)
2. Melde im Player einen Namen an.
3. Starte im Host eine Frage.
4. Antworte im Player.
5. Löse im Host auf.

Wenn das klappt, läuft die Basis korrekt.

### 7) Mit echten Smartphones testen (gleicher WLAN-Router)

1. Finde die lokale IP deines PCs/Macs:
   - macOS/Linux: `ip a` oder `ifconfig`
   - Windows (PowerShell/CMD): `ipconfig`
2. Beispiel-IP: `192.168.1.23`
3. Auf dem Smartphone öffnen:
   - `http://192.168.1.23:3000/player.html`
4. Falls es nicht geht:
   - prüfen, ob Handy und Rechner im selben WLAN sind
   - prüfen, ob Firewall Port 3000 blockiert

### 8) Server stoppen

Im Terminal mit laufendem Server:

- `Ctrl + C`

### 9) Häufige Fehler

- **`EADDRINUSE`**: Port 3000 ist belegt.
  - Lösung A: laufenden Prozess stoppen
  - Lösung B: anderer Port

  ```bash
  PORT=3001 npm start
  ```

- **Seite lädt, aber Änderungen fehlen**:
  - Browser hart neu laden (Strg/Cmd + Shift + R)

- **`npm`/`node` nicht gefunden**:
  - Node.js ist nicht korrekt installiert oder Terminal wurde nicht neu gestartet.

## Lokal testen (auf deinem eigenen Rechner)

1. **Voraussetzungen prüfen**
   - Node.js 18+ installieren (`node -v`)
   - npm ist bei Node.js bereits dabei (`npm -v`)

2. **Projekt klonen und Abhängigkeiten installieren**

   ```bash
   git clone <DEIN-REPO-URL>
   cd 1vs100
   npm install
   ```

3. **Server starten**

   ```bash
   npm start
   ```

4. **Ansichten öffnen**
   - Host (Moderator/Beamer): `http://localhost:3000/host.html`
   - Spieler (Smartphone am selben Gerät): `http://localhost:3000/player.html`

5. **Mit echten Smartphones im gleichen WLAN testen**
   - Lokale IP des Host-Rechners herausfinden (z. B. `192.168.1.23`)
   - Auf dem Handy dann öffnen: `http://192.168.1.23:3000/player.html`
   - Wichtig: Alle Geräte müssen im gleichen Netzwerk sein, und lokale Firewall muss Port `3000` erlauben.

6. **Kurzer Testablauf**
   - Mindestens 2 Browser-Fenster öffnen (1x Host, 1x Spieler)
   - Spieler anmelden
   - Host startet eine Frage
   - Spieler antwortet
   - Host löst auf und prüft Mob/Scoreboard

### Häufige Probleme

- **Port ist belegt (`EADDRINUSE`)**: Entweder den blockierenden Prozess beenden oder einen anderen Port verwenden (`PORT=3001 npm start`).
- **Smartphone erreicht den Server nicht**: Prüfen, ob wirklich die lokale IP (nicht `localhost`) verwendet wird und Firewall-Regeln passen.
- **Änderungen erscheinen nicht**: Seite hart neu laden oder optional mit `npx nodemon server.js` entwickeln.

## Erweiterungsideen

- Authentifizierung über Spielcode/Lobby-Key
- Timer pro Frage und automatisches Auswerten
- Kandidat:innen-Rolle mit separater Punktelogik gegen den Mob
- Erweiterbare Fragenverwaltung (CSV/Google Sheet Import)
- Persistenz der Ergebnisse und Statistiken
- Animierte Reveal-Visuals und Audio-Cues

## Struktur

```
./server.js           # Express + Socket.IO Server, Spiel- und Mob-Logik
./public/index.html   # Einstieg mit Links zur Host- und Player-Ansicht
./public/host.html    # Moderator-UI: Fragen starten, Antworten auswerten, Mob-Grösse anzeigen
./public/player.html  # Spieler-UI: Antworten tippen, Punktestand sehen
./public/styles.css   # Gemeinsames Layout & Styles
./data/questions.json # Beispiel-Fragenset
```

