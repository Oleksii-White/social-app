# Social App

## Docker

Соберите и запустите приложение в Docker:

```bash
docker build -t social-app \
  --build-arg VITE_BASE_URL=<frontend-url> \
  --build-arg DATABASE_URL=<mongo-url> \
  .

docker run -p 3000:3000 \
  -e DATABASE_URL=<mongo-url> \
  -e SECRET_KEY=<секрет> \
  social-app
```

При необходимости директорию `uploads` следует монтировать как volume для сохранения загруженных файлов.
