from fastapi import APIRouter
from database import get_connection

router = APIRouter()

@router.post("/add-product")
def add_product(product_name: str, category: str):

    conn = get_connection()
    cursor = conn.cursor()

    query = """
    INSERT INTO products (product_name, category)
    VALUES (%s, %s)
    """

    cursor.execute(query, (product_name, category))

    conn.commit()
    cursor.close()
    conn.close()

    return {"message": "Product added successfully"}