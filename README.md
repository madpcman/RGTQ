# RGTQ
RGT 과제


## BackEnd
  개발 환경 : FAST API framework, Sqlite / PostgresSQL

  DB 설정 : 
  .env.dev(local / dev 설정) 또는 .env.prod(production 설정) 에서 DB 설정 

```
  ENV=development | production
  POSTGRES_SERVER={{your db server url}}
  POSTGRES_PORT=5432
  POSTGRES_DB={{database name}}
  POSTGRES_USER={{database user id}}
  POSTGRES_PASSWORD={{database user password}}
  POSTGRES_QUERY=
```
  
  환경설정

```
  cd backend
  python -m venv .venv
  source .venv/bin/activate
  pip install --upgrade pip
  pip install -r requirements.txt
```

   ** python version 3.11 이하 라면 requirements.txt 의 # backports.zoneinfo==0.2.1 주석을 해제 하고 설치

  실행 커맨드 

```
  cd backend
  uvicorn app.main:app --host 0.0.0.0 --port 9000
```
  Prod설정 실행 
```
  cd backend
  ENV=production uvicorn app.main:app --host 0.0.0.0 --port 9000
```


  API 페이지 (swagger 기반 API 테스트 페이지)
```
  http://localhost:9000/docs
```



## FrontEnd
  개발환경 : node.js

  backend Server url 설정 : 
  .env.local(local / dev 설정) 또는 .env.production(production 설정) 에서 설정
```
  NEXT_PUBLIC_API_BASE={{your backend url}}
```
 

  환경설정 및 빌드
```
  cd frontend/bookstore-app
  npm install package.json
  npm run build
```
  Prod설정 빌드
```
  NEXT_PUBLIC_API_BASE=https://rgtq.onrender.com npm run build
```

  실행 커맨드
```
  cd frontend/bookstore-app
  npm run start
```

  프런트엔드 웹 페이지 
```
  http://localhost:3000/books
```
  
