# Full-Stack Web Application with Telegram Bot Integration

A modern full-stack web application built with **Vite + React** frontend, **Django** backend, and **Telegram bot** integration using **Cloudflare Tunnel** for secure webhook delivery.

## 🏗️ Project Structure

```
project-root/
├── my-vite-app/          # React frontend (Vite)
├── backend/              # Django backend
│   ├── backend/          # all the configuration files
│   ├── myapp/            # my app for all the other stuffs
│   ├── scripts/          # Utility scripts
│   └── .env              # Environment variables
├── venv/                 # Python virtual environment
├── public/               # Public files for setup
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher)
- **Python** (v3.8 or higher)
- **Chocolatey** (for Windows Cloudflare CLI installation)
- **Telegram Bot Token** (from @BotFather)

### 1. Frontend Setup (Vite + React)

Navigate to the frontend directory and install dependencies:

```bash
cd my-vite-app
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

### 2. Backend Setup (Django)

Create and activate a virtual environment:

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment (Windows)
venv\Scripts\activate

# Activate virtual environment (macOS/Linux)
source venv/bin/activate
```

Navigate to the backend directory:

```bash
cd backend
```

Install Python dependencies:

```bash
pip install -r requirements.txt
```

Set up the database:

```bash
python manage.py makemigrations
python manage.py migrate
```

Start the Django development server:

```bash
python manage.py runserver
```

The backend API will be available at `http://127.0.0.1:8000`


### 3. Redis Setup (Celery Broker)

Redis is required as a message broker for Celery task processing.

#### Install Redis

**Windows:**
1. Download Redis for Windows from the [official releases](https://github.com/microsoftarchive/redis/releases)
2. Extract and run the installer
3. Or install via Chocolatey:
```bash
choco install redis-64
```

**macOS:**
```bash
brew install redis
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install redis-server
```

#### Start Redis Server

**Windows:**
```bash
redis-server
```

**macOS/Linux:**
```bash
redis-server
# Or as a service
sudo systemctl start redis
```

Verify Redis is running:
```bash
redis-cli ping
# Should return: PONG
```

### 4. Telegram Bot Setup with Cloudflare Tunnel

#### Install Cloudflare CLI

**Note**: Run your terminal as **Administrator** on Windows

```bash
choco install cloudflared
```

Verify the installation:

```bash
cloudflared --version
```

#### Create Secure Tunnel

Start a tunnel to expose your Django backend:

```bash
cloudflared tunnel --url http://127.0.0.1:8000/
```

This generates a public HTTPS URL like: `https://random-subdomain.trycloudflare.com`

#### Configure Webhook

1. Create a `.env` file in the `backend` directory:

```env
BOT_TOKEN=your_bot_token_here
WEBHOOK_URL=https://your-generated-url.trycloudflare.com/
```

2. Set up the Telegram webhook:

```bash
cd backend/scripts
python set_telegram_webhook.py
```

## 🛠️ Development Workflow

1. **Start Redis**: Run Redis server (`redis-server`)
2. **Start Backend**: Run Django server (`python manage.py runserver`)
3. **Start Frontend**: Run Vite dev server (`npm run dev`)
4. **Start Tunnel**: Run Cloudflare tunnel for bot webhook
5. **Set Webhook**: Configure Telegram bot webhook URL

## 📁 Key Files

- `my-vite-app/` - React frontend application
- `backend/manage.py` - Django management script
- `backend/scripts/set_telegram_webhook.py` - Webhook configuration script
- `backend/.env` - Environment variables (create this file)

## 🔧 Environment Variables

Create a `.env` file in the `backend` directory with these feilds:

```env
WEBHOOK_URL=https://your-cloudflare-tunnel-url.trycloudflare.com/
SECRET_KEY=your_django_secret_key
DEBUG=False
CELERY_BROKER_URL=redis://localhost:6379
EMAIL_HOST_USER=real_host_user_email
EMAIL_HOST_PASSWORD=not_the_gmail_app_password_but_locally_created_one
FROM_EMAIL=host_email
BOT_TOKEN=secret_bot_token_generated_by_telegram
```


Create a `.env` file in the `my-vite-app` directory with these feilds:

```env
VITE_REACT_BACKEND_URL=your_backend_url
```


## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues

1. **Port already in use**: Change the port in Django settings or kill the process
2. **Cloudflare tunnel fails**: Ensure you're running as Administrator on Windows
3. **Telegram webhook errors**: Verify your bot token and webhook URL are correct
4. **Database errors**: Run migrations with `python manage.py migrate`

### Getting Help

- Check the [Issues](../../issues) page for known problems
- Create a new issue if you encounter a bug
- Contact the maintainers for support

---

**Built with ❤️ using React, Django, and Cloudflare**
