# SnAIck

> AI-powered personalized snack recommendations tailored to your diet, preferences, and restrictions.

## Table of Contents

- [Project Description](#project-description)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Project Scope](#project-scope)
- [Project Status](#project-status)
- [License](#license)

## Project Description

SnAIck is a web application that helps users quickly select healthy and tasty snacks matched to their daily diet, preferences, and dietary restrictions. The application leverages artificial intelligence to generate personalized snack suggestions based on user data submitted through a form.

### Target Audience

- Office or hybrid workers
- Health-conscious individuals
- People on diets
- People with food intolerances

### Core User Flow

1. Register or login to the application
2. Fill out a form with information about meals eaten and preferences
3. Receive an AI-generated snack suggestion
4. Save snacks to favorites or generate new suggestions
5. Browse and manage the list of favorite snacks

## Tech Stack

### Frontend

- [Astro 5](https://astro.build/) - Fast, modern web framework with minimal JavaScript
- [React 19](https://react.dev/) - For interactive components
- [TypeScript 5](https://www.typescriptlang.org/) - Static typing and better IDE support
- [Tailwind 4](https://tailwindcss.com/) - Utility-first CSS framework
- [Shadcn/ui](https://ui.shadcn.com/) - Accessible React component library

### Backend

- [Supabase](https://supabase.io/) - Open source Firebase alternative
  - PostgreSQL database
  - Built-in user authentication
  - SDK for multiple languages

### AI Integration

- [Openrouter.ai](https://openrouter.ai/) - Access to various LLM models (OpenAI, Anthropic, Google, etc.)

### CI/CD & Hosting

- GitHub Actions - CI/CD pipelines

## Getting Started

### Prerequisites

- Node.js 22.14.0 (use nvm to install the correct version)
- npm (comes with Node.js)

### Quick start

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/snaick.git
   cd snaick
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Development Setup

### Local Database Setup

The project uses Supabase for the backend. For local development:

1. Install and start Supabase CLI locally (follow [Supabase local development guide](https://supabase.com/docs/guides/cli/local-development))

2. Start the local Supabase stack:

   ```bash
   supabase start
   ```

3. Your local Supabase instance will be available at `http://127.0.0.1:54321`

### Demo User Creation

To quickly test the application with sample data, you can create a demo user:

1. Set the required environment variables:

   ```bash
   export SUPABASE_LOCAL_URL=your_local_supabase_url
   export SUPABASE_LOCAL_KEY=your_local_supabase_key
   ```

   You can find this key in your local Supabase dashboard or by running `supabase status`.

2. Run the demo script:
   ```bash
   node create-demo-user.js
   ```

This script will:

- Create a demo user with email `demo@example.com` and password `demo123`
- Add all available snacks to the user's favorites list
- Set up the user for immediate testing

**Demo User Credentials:**

- Email: `demo@example.com`
- Password: `demo123`

> **Note:** This script is designed for local development only and requires a running local Supabase instance.

## Available Scripts

### Development Scripts

- `npm run dev` - Start the development server

### Code Quality Scripts

- `npm run lint` - Run ESLint to check for code issues
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run format` - Format code with Prettier

### Testing Scripts

- `npm run test:unit` - Run unit tests with Vitest

### Database Setup Scripts

- `node create-demo-user.js` - Create a demo user with sample data for development testing

## Project Scope

### MVP Features

1. Registration and login system

   - Email and password-based authentication
   - Basic security: authorization, authentication, and data protection

2. User preference form

   - Information about meals eaten that day
   - Snack type preferences (sweet, salty, light, filling)
   - Dietary exclusions
   - User location (work, home, store, away from home)
   - Dietary goals
   - Caloric restrictions
   - Permanent dietary restrictions (veganism, vegetarianism, intolerances, allergies)

3. AI-powered snack generation

   - Using LLM models via Openrouter.ai
   - Personalized suggestions based on form data
   - Standard format results including:
     - Snack name
     - Brief description
     - Ingredient list
     - Preparation instructions
     - Nutritional values (calories, protein, fats, carbohydrates, fiber)

4. Snack management

   - List of favorite snacks with editing capability (deletion)
   - Saving snack history after accepting suggestions

5. User interface
   - Responsive design for mobile and desktop devices
   - Intuitive navigation between main form and favorite snacks list

### Out of Scope for MVP

- Automatic calorie and meal tracking
- Detailed ingredient database with micro and macro elements
- Integration with fitness or diet applications
- Snack rating and commenting system
- Recommendations based on previous day's history
- Data import from other sources
- Export of favorite snacks
- Inappropriate suggestion reporting mechanism
- LLM query limits per user
- LLM query cost monitoring
- Advanced LLM response quality validation mechanisms

## Project Status

The project is currently in the PoC (Proof of Concept) development phase.

### Success Metrics

1. User engagement:

   - 80% of registered users generate at least one snack suggestion
   - 60% of registered users save at least one snack as a favorite

2. Main flow effectiveness:

   - High completion rate from filling out the form to generating a suggestion (>90%)
   - Low suggestion rejection and new generation rate (<50% of cases)

3. Suggestion quality:
   - Suggestions comply with preferences and restrictions entered by the user
   - Suggestion format is consistent and contains all required elements
