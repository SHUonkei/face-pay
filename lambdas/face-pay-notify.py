import pymysql
import os

def lambda_handler(event, context):
    # transactionsのidとstatus_codeを取得
    print("[EVENT]:",event)
    body = event['body']
    transaction_id = body.get("transaction_id")
    status_code = body.get("status_code")
    
    # status_codeによる条件分岐
    if status_code == 200:
        # データベース接続パラメータ
        db_params = {
            "host": "face-pay-database.c5may6ci2q4z.us-east-1.rds.amazonaws.com",
            "user": "admin",
            "password": "facepaypay",
            "database": "facepay"
        }

        # MySQLデータベースに接続
        connection = pymysql.connect(**db_params)

        try:
            with connection.cursor() as cursor:
                # 取引の詳細を取得
                cursor.execute("""
                    SELECT t.amount, t.updated_at, s.name 
                    FROM transactions t
                    JOIN stores s ON t.store_id = s.id
                    WHERE t.id = %s
                """, (transaction_id,))
                
                result = cursor.fetchone()
                
                if not result:
                    return {"status": "error", "message": "Transaction not found."}

                amount, updated_at, store_name = result

                # JSON形式で結果を返す
                return {
                    "status": "success",
                    "transaction": {
                        "amount": float(amount),  # 金額を浮動小数点数に変換
                        "updated_at": updated_at.isoformat(),  # ISOフォーマットで日時を返す
                        "store_name": store_name
                    }
                }
        except pymysql.MySQLError as e:
            return {"status": "error", "message": f"Database error: {str(e)}"}
        finally:
            if connection:
                connection.close()

    elif status_code == 400:
        return {"status": "error", "message": "Insufficient balance."}

    elif status_code == 404:
        return {"status": "error", "message": "User not found."}

    else:
        return {"status": "error", "message": "Invalid status code."}
