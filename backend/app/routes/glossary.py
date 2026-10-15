from fastapi import APIRouter
from typing import List, Dict
from ..services.explainer import get_glossary, get_disclaimer
from ..schemas.asteroid import GlossaryTerm

router = APIRouter(prefix="/explain", tags=["Glossary & Scientific Explainability"])

@router.get("/glossary", response_model=List[GlossaryTerm])
async def list_glossary_terms():
    return get_glossary()

@router.get("/disclaimer", response_model=Dict[str, str])
async def get_scientific_disclaimer():
    return get_disclaimer()
