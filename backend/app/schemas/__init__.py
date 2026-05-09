from pydantic import BaseModel


class ConvertResponse(BaseModel):
    job_id: str


class ResultFile(BaseModel):
    filename: str
    url: str
