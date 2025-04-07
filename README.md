# RGTQ
RGT 과제


## BackEnd
  개발 환경 : FAST API framework, Sqlite
  
  환경설정

```
  cd backend
  python -m venv .venv
  source .venv/bin/activate
  pip install --upgrade pip
  pip install -r requirements.txt
```

  실행 커맨드 

```
  cd backend
  uvicorn app.main:app --reload --host 0.0.0.0 --port 9000
```


  API 페이지 (swagger 기반 API 테스트 페이지)
```
  http://localhost:9000/docs
```
