@echo off
start cmd /k "cd backend && python manage.py runserver"
start cmd /k "cd FRONTEND && cd frontend && npm run dev"
