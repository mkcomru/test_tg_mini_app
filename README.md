# Telegram Mini App - Birthday Tracker

A Telegram Mini App that allows users to track their birthdays and share their birthday information with others.

## Features

- Set and update birthday
- View time remaining until next birthday
- Share birthday information via generated links
- Beautiful and responsive UI
- Real-time updates

## Tech Stack

### Frontend
- Vue 3 with TypeScript
- Vite
- TailwindCSS
- Pinia for state management
- Telegram Web App SDK

### Backend
- FastAPI
- Tortoise ORM
- PostgreSQL
- Redis (optional, for caching)

## Prerequisites

- Python 3.8+
- Node.js 16+
- PostgreSQL
- Nginx
- ngrok (for development)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/mkcomru/test_tg_mini_app
cd test_tg_mini_app
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

3. Install backend dependencies:
```bash
cd backend
pip install -r requirements.txt
```

4. Set up environment variables:
Create `.env` files in both frontend and backend directories:

Frontend `.env`:
```env
VITE_API_URL=http://localhost:8000/api
```

Backend `.env`:
```env
DATABASE_URL=postgres://user:password@localhost:5432/dbname
BOT_TOKEN=your_telegram_bot_token
WEBAPP_URL=https://your-ngrok-url.ngrok-free.app
```

## Development Setup

1. Start PostgreSQL database

2. Start Nginx with the provided configuration:
```bash
sudo nginx -c /path/to/nginx.conf
```

3. Start ngrok to expose your local server:
```bash
ngrok http 8000
```

4. Start the backend server (from project root):
```bash
python -m backend.main
```

5. Start the frontend development server:
```bash
cd frontend
npm run dev
```

## Project Structure

```
.
├── frontend/                 # Frontend Vue.js application
│   ├── src/
│   │   ├── api/            # API client
│   │   ├── components/     # Vue components
│   │   ├── stores/        # Pinia stores
│   │   └── telegram.ts    # Telegram Web App integration
│   └── package.json
├── backend/                 # Backend FastAPI application
│   ├── app/
│   │   ├── api/           # API endpoints
│   │   ├── models/        # Database models
│   │   ├── schemas/       # Pydantic schemas
│   │   └── utils/         # Utility functions
│   └── requirements.txt
└── nginx.conf              # Nginx configuration
```

## API Endpoints

### Users
- `GET /api/users/me` - Get current user information
- `PUT /api/users/me/birthday` - Update user's birthday

### Share
- `POST /api/share` - Create a share link
- `GET /api/share/{code}` - Get shared user information

## Development Notes

- The backend is configured to run on port 8000
- Frontend development server runs on port 5173
- Nginx is used as a reverse proxy
- ngrok is used to expose the local server for Telegram Web App testing

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 