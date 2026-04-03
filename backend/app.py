from fastapi import FastAPI
from routes import auth_routes, prediction_routes, report_routes, assistant_routes

app = FastAPI(title="Cognitive Healthcare System API")

app.include_router(prediction_routes.router, prefix="/predict")
app.include_router(report_routes.router, prefix="/report")
app.include_router(auth_routes.router)
app.include_router(prediction_routes.router)
app.include_router(assistant_routes.router, prefix="/assistant")


@app.get("/")
def root():
    return {"message": "Healthcare AI API running"}