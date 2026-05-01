# Taskly — Team Task Manager

A full-stack web application for managing projects, assigning tasks, and tracking team progress with role-based access control.

**Live Demo:** https://sublime-commitment-production-27f2.up.railway.app  
**Backend API:** https://taskly-production-9811.up.railway.app  
**GitHub:** https://github.com/manyajuneja3/taskly

---

## Features

- **Authentication** — Signup and Login with JWT (JSON Web Tokens)
- **Role-Based Access Control** — Admin and Member roles with different permissions
- **Project Management** — Admins can create, update, and delete projects
- **Team Management** — Admins can add or remove members from projects
- **Task Management** — Create tasks, assign to members, set deadlines
- **Kanban Board** — Visual task board with To Do / In Progress / Done columns
- **Dashboard** — Real-time stats: total tasks, overdue count, tasks by status, recent assignments
- **Overdue Detection** — Tasks past their deadline are automatically flagged

---

## Tech Stack

**Backend**
- Python, Django, Django REST Framework
- Simple JWT for authentication
- PostgreSQL (production), SQLite (development)
- Gunicorn (WSGI server), WhiteNoise (static files)
- django-cors-headers, python-decouple, dj-database-url

**Frontend**
- React 18, Vite, Tailwind CSS
- Axios (with request/response interceptors)
- React Router v6

**Deployment**
- Railway (backend + frontend + PostgreSQL)
- GitHub (CI/CD — auto-deploy on push)

---

## API Endpoints

### Auth — `/api/auth/`
| Method | Endpoint | Description |
|---|---|---|
| POST | `/register/` | Create new account |
| POST | `/login/` | Get access + refresh token |
| POST | `/refresh/` | Refresh access token |
| GET | `/me/` | Get current user profile |
| GET | `/users/` | List all users (for member assignment) |

### Projects — `/api/projects/`
| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | List accessible projects |
| POST | `/` | Create project (Admin) |
| PATCH | `/:id/` | Update project (Admin) |
| DELETE | `/:id/` | Delete project (Admin) |
| POST | `/:id/add_member/` | Add member to project (Admin) |
| POST | `/:id/remove_member/` | Remove member (Admin) |

### Tasks — `/api/tasks/`
| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | List tasks (filtered by role) |
| POST | `/` | Create task (Admin) |
| PATCH | `/:id/` | Update task / change status |
| DELETE | `/:id/` | Delete task (Admin) |
| GET | `/dashboard/` | Dashboard stats |

---

## Local Setup

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create .env file
SECRET_KEY=your-secret-key
DEBUG=True
DATABASE_URL=sqlite:///db.sqlite3
CORS_ALLOWED_ORIGINS=http://localhost:5173

python manage.py migrate
python manage.py runserver
```

### Frontend
```bash
cd frontend
npm install

# Create .env file
VITE_API_URL=http://localhost:8000

npm run dev
```

---

## Project Structure

```
taskly/
├── backend/
│   ├── core/          # Settings, main URLs
│   ├── users/         # Auth, User model, JWT
│   ├── projects/      # Project CRUD, member management
│   ├── tasks/         # Task CRUD, dashboard API
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── api/       # Axios instance + API calls
│   │   ├── pages/     # Login, Dashboard, Projects, TaskBoard
│   │   └── components/# Navbar
│   └── vite.config.js
├── Procfile           # Railway deployment
└── runtime.txt        # Python 3.12.7
```

---

## Environment Variables (Production)

| Variable | Description |
|---|---|
| `SECRET_KEY` | Django secret key |
| `DEBUG` | False in production |
| `DATABASE_URL` | PostgreSQL connection URL |
| `ALLOWED_HOSTS` | Backend domain |
| `CORS_ALLOWED_ORIGINS` | Frontend domain |
| `VITE_API_URL` | Backend URL (frontend env) |
