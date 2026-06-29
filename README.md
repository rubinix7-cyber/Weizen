# Weizen oder Spreu

Eine tägliche Selbstreflektions-App: Bist du heute **Weizen** oder **Spreu**?

## Features

- **Profil erstellen** – einmaliges Onboarding mit deinem Namen
- **Tägliche Wahl** – Startbildschirm mit zwei großen Buttons: 🌾 Weizen und 💨 Spreu
- **Push-Benachrichtigung** – täglich um 14:00 Uhr wirst du erinnert
- **Verlauf** – alle bisherigen Einträge mit Statistik

## Tech Stack

- [Expo](https://expo.dev) (React Native) mit TypeScript
- [expo-notifications](https://docs.expo.dev/versions/latest/sdk/notifications/) für Push-Benachrichtigungen
- [@react-native-async-storage/async-storage](https://react-native-async-storage.github.io/async-storage/) für lokale Datenspeicherung
- [expo-router](https://expo.github.io/router/) für Navigation

## Setup

```bash
npm install
npx expo start
```

Scanne den QR-Code mit der **Expo Go** App auf deinem Smartphone.

## Projektstruktur

```
app/
  _layout.tsx      # Root-Layout, Routing-Initialisierung
  index.tsx        # Redirect-Einstiegspunkt
  setup.tsx        # Profil-Erstellungs-Screen
  home.tsx         # Startbildschirm (Weizen/Spreu-Buttons)
  history.tsx      # Verlauf & Statistik
src/
  utils/
    storage.ts       # AsyncStorage Helfer
    notifications.ts # Expo Notifications Setup & Scheduling
```
