
# Fitness Tracker Application

A comprehensive fitness tracking application built with React, TypeScript, and Tailwind CSS. This application helps users track their workouts, nutrition, and overall fitness progress.

## Features

- **Multiple User Profiles**: Create and manage different profiles for yourself and family members
- **Workout Tracking**: Log and track your workouts with detailed exercise information
- **Nutrition Logging**: Record your meals and track your calorie and macronutrient intake
- **Progress Monitoring**: Track your fitness progress over time
- **Customizable Goals**: Set personalized fitness and nutrition goals
- **Workout Plans**: Choose from pre-made workout plans or create your own

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Open [http://localhost:8080](http://localhost:8080) to view it in the browser

## Technology Stack

- **Frontend**: React with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: Local browser storage
- **Charts and Visualizations**: Recharts
- **Icons**: Lucide React
- **Forms**: React Hook Form
- **Date Handling**: date-fns

## Development

This project is built with Vite. To start the development server, run:

```bash
npm run dev
```

## Project Structure

- `/src`: Source files
  - `/components`: Reusable UI components
  - `/contexts`: React context providers
  - `/hooks`: Custom React hooks
  - `/lib`: Utility functions
  - `/pages`: Application pages/routes
  - `/services`: Data services and API communication

## Data Storage

The application currently uses browser local storage to persist data. In a production environment, this would be replaced with a proper backend database.

## Future Improvements

- Backend API integration
- User authentication
- Social sharing features
- Mobile application
- Advanced analytics and reporting
