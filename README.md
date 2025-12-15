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

