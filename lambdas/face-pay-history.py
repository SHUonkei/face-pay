import json
import decimal
from typing import Any, Dict, Tuple

import pymysql


db_params = {
    "host": "face-pay-database.c5may6ci2q4z.us-east-1.rds.amazonaws.com",
    "user": "admin",
    "password": "facepaypay",
    "database": "facepay",
}


def connect_to_database():
    """データベース接続を作成する"""
    return pymysql.connect(**db_params)


def load_json(str_json: Any) -> Tuple[bool, dict]:
    """
    JSON文字列をPythonで処理できる形にする
    """
    print("[DEBUG]load_json()")
    if str_json is None:
        return False, {"error": "[FAILED] Data required"}

    # Lambdaテスト時にdict型で入ってくるためif分岐
    if isinstance(str_json, str):
        try:
            return True, json.loads(str_json)
        except json.JSONDecodeError:
            print("[DEBUG]json decode error")
            return False, {"error": "[FAILED] JSON decode error"}

    return True, str_json


def decimal_to_float(obj):
    """Decimalをfloatに変換する（json.dumps の default 用）"""
    if isinstance(obj, decimal.Decimal):
        return float(obj)
    raise TypeError("Type not serializable")


def response(status_code: int, body_obj: Dict[str, Any]) -> dict:
    """Lambdaのレスポンスを作る（json化ルールも統一）"""
    return {
        "statusCode": status_code,
        "body": json.dumps(body_obj, default=decimal_to_float),
    }


def fetch_transaction_history(connection, store_id):
    """店舗の取引履歴をDBから取得して整形して返す"""
    query = """
        SELECT transactions.updated_at, users.name AS user_name, transactions.amount
        FROM transactions
        JOIN users ON transactions.user_id = users.id
        WHERE transactions.store_id = %s
        ORDER BY transactions.updated_at DESC
    """
    with connection.cursor() as cursor:
        cursor.execute(query, (store_id,))
        rows = cursor.fetchall()

    if not rows:
        return None

    return [
        {
            "transaction_date": row[0].strftime("%Y-%m-%d %H:%M:%S"),
            "user_name": row[1],
            "amount": row[2],
        }
        for row in rows
    ]


def lambda_handler(event, context):
    success, body = load_json(event.get("body"))
    if not success:
        # 元コードと同じ返し方（statusCode=400 + body=json文字列）
        return {"statusCode": 400, "body": json.dumps(body)}

    store_id = body.get("store_id")

    connection = connect_to_database()
    try:
        transaction_history = fetch_transaction_history(connection, store_id)
        if transaction_history is None:
            return response(404, {"error": "No transactions found for this store"})

        return response(200, {"transaction_history": transaction_history})
    finally:
        connection.close()
