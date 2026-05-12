# Food Delivery Portfolio App

A polished React Native food delivery UI portfolio project built with Expo and TypeScript. The app showcases a modern ordering flow with mock restaurants, animated screens, cart state, and a clean mobile-first experience inspired by popular delivery apps.

## Tech Stack

![React Native](https://img.shields.io/badge/React%20Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=FFFFFF)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=FFFFFF)
![Zustand](https://img.shields.io/badge/Zustand-1F1F1F?style=for-the-badge)
![React Navigation](https://img.shields.io/badge/React%20Navigation-0A84FF?style=for-the-badge)

## Screenshots

Placeholder screenshots will be added here.

- Splash Screen: `TODO`
- Home Screen: `TODO`
- Restaurant Detail Screen: `TODO`
- Cart Screen: `TODO`
- Order Tracking Screen: `TODO`

## Features

- Animated splash screen with auto-navigation
- Home dashboard with searchable restaurant list
- Category chips for quick browsing
- Restaurant detail view with menu sections and item controls
- Cart state managed with Zustand
- Cart badge and quantity counters
- Order tracking screen with animated delivery steps
- Bottom tabs and stack navigation wired together
- Consistent warm visual theme and mock data throughout

## Run Locally

Install dependencies and start the Expo dev server:

```bash
npm install
npx expo start
```

To run on Android:

```bash
npx expo start -c
yarn android
```

## Folder Structure

```text
src/
	components/        Reusable UI components
	data/              Mock restaurant and menu data
	navigation/        Stack and tab navigation setup
	screens/           App screens
	store/             Zustand cart store
	theme/             Colors, spacing, and typography tokens
	types/             Shared TypeScript interfaces
```

## Credits

- UI concept inspired by modern food delivery experiences such as Foodpanda and Uber Eats.
- Placeholder imagery sourced from `picsum.photos` for mock presentation purposes.
- Built as a portfolio project to demonstrate Expo, TypeScript, navigation, state management, and animation patterns.

## Design Inspiration

The visual direction uses a warm accent palette, rounded surfaces, and lightweight motion to create a polished, app-store-ready food ordering experience.

## Scripts

- `npm run start`
- `npm run android`
- `npm run ios`
- `npm run web`
- `npm run typecheck`
