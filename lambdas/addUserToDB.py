import json
from typing import Any, Tuple

import pymysql


DB_CONFIG = {
    "host": "face-pay-database.c5may6ci2q4z.us-east-1.rds.amazonaws.com",
    "user": "admin",
    "password": "facepaypay",
    "db": "facepay",
    "charset": "utf8mb4",
    "cursorclass": pymysql.cursors.DictCursor,
}


def load_json(str_json: Any) -> Tuple[bool, dict]:
    """
    JSON文字列をPythonで処理できる形にする
    """
    print("[DEBUG]load_json()")
    if str_json is None:
        return False, {"error": "[FAILED]Data required"}

    # Lambdaテスト時にdict型で入ってくるためif分岐
    if isinstance(str_json, str):
        try:
            return True, json.loads(str_json)
        except json.JSONDecodeError:
            print("[DEBUG]json decode error")
            return False, {"error": "[FAILED]json decode error"}

    return True, str_json


def connect_to_database():
    """DB接続を作成する"""
    return pymysql.connect(**DB_CONFIG)


def add_user_to_db(uuid: str, name: str, balance: float = 5000):
    """
    Adds a new user to the database.
    """
    print("[DEBUG] add_user_to_db()")
    connection = None
    try:
        connection = connect_to_database()
        with connection.cursor() as cursor:
            sql = "INSERT INTO users (uuid, name, balance) VALUES (%s, %s, %s)"
            cursor.execute(sql, (uuid, name, balance))
        connection.commit()
        print(f"[DEBUG] User {uuid} added successfully with balance {balance}")
    except Exception as error:
        print("[ERROR] Database insertion failed:", error)
    finally:
        if connection:
            connection.close()


def lambda_handler(event, context):
    """
    AWS Lambda function to handle incoming requests and call add_user_to_db.
    """
    print("[DEBUG] lambda_handler()")

    try:
        _, data = load_json(event["body"])

        user_uuid = data.get("uuid")
        name = data.get("name")
        balance = 5000  

        if not user_uuid or not name:
            return {"statusCode": 400, "body": json.dumps({"error": "UUID and name are required"})}

        add_user_to_db(user_uuid, name, balance)

        return {"statusCode": 200, "body": json.dumps({"message": "User added successfully"})}

    except Exception as error:
        print("[ERROR] lambda_handler error:", error)
        return {"statusCode": 500, "body": json.dumps({"error": str(error)})}
