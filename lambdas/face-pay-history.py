import json
import pymysql
import os
from typing import Union, Tuple
from datetime import datetime
import decimal

db_params = {
    "host": "face-pay-database.c5may6ci2q4z.us-east-1.rds.amazonaws.com",
    "user": "admin",
    "password": "facepaypay",
    "database": "facepay"
}

# データベース接続を作成する関数
def connect_to_database():
    return pymysql.connect(**db_params)

def load_json(str_json: str) -> Tuple[bool, dict]:
    """
    JSON文字列をPythonで処理できる形にする
    """
    print('[DEBUG]load_json()')
    if str_json is None:
        return False, {'error': '[FAILED] Data required'}
    # Lambdaテスト時にdict型で入ってくるためif分岐
    if isinstance(str_json, str):
        try:
            return True, json.loads(str_json)
        except json.JSONDecodeError:
            print('[DEBUG]json decode error')
            return False, {'error': '[FAILED] JSON decode error'}
    else:
        return True, str_json

# Decimalをfloatに変換する関数
def decimal_to_float(obj):
    if isinstance(obj, decimal.Decimal):
        return float(obj)
    raise TypeError("Type not serializable")

# Lambda関数のハンドラ
def lambda_handler(event, context):
    success, body = load_json(event.get('body'))

    if not success:
        return {
            'statusCode': 400,
            'body': json.dumps(body)
        }
    store_id = body.get('store_id')
    # store_id = 1

    # データベースに接続
    connection = connect_to_database()
    
    try:
        with connection.cursor() as cursor:
            # 店舗の取引履歴を取得
            cursor.execute("""
                SELECT transactions.updated_at, users.name AS user_name, transactions.amount
                FROM transactions
                JOIN users ON transactions.user_id = users.id
                WHERE transactions.store_id = %s
                ORDER BY transactions.updated_at DESC
            """, (store_id,))
            
            transactions = cursor.fetchall()

            # 取引が存在するか確認
            if transactions:
                # 結果をリストに格納
                transaction_history = [
                    {
                        'transaction_date': transaction[0].strftime('%Y-%m-%d %H:%M:%S'),
                        'user_name': transaction[1],
                        'amount': transaction[2]
                    }
                    for transaction in transactions
                ]

                return {
                    'statusCode': 200,
                    'body': json.dumps({'transaction_history': transaction_history}, default=decimal_to_float)
                }
            else:
                return {
                    'statusCode': 404,
                    'body': json.dumps({'error': 'No transactions found for this store'})
                }
    finally:
        connection.close()
