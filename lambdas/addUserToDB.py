import json
import pymysql
import json
import boto3
from typing import Union, Tuple
from datetime import datetime
import botocore.exceptions
import base64
def load_json(str_json: str) -> Tuple[bool, dict]:
    """
    JSON文字列をPythonで処理できる形にする
    """
    print('[DEBUG]load_json()')
    if str_json is None:
        return False, self.make_response(400, '[FAILED]Data required')
    # Lambdaテスト時にdict型で入ってくるためif分岐
    if isinstance(str_json, str):
        try:
            return True, json.loads(str_json)
        except json.JSONDecodeError:
            print('[DEBUG]json decode error')
            return False, self.make_response(400, '[FAILED]json decode error')
    else:
        return True, str_json
def lambda_handler(event, context):
    """
    AWS Lambda function to handle incoming requests and call add_user_to_db.
    """
    print('[DEBUG] lambda_handler()')
    
    # Extract parameters from the event body (assuming event body contains JSON)
    try:
        # Parse event (assumed to be a JSON string)
        _, data = load_json(event['body'])
        
        # Extract parameters: uuid, name, balance (balance defaults to 5000 if not provided)
        uuid = data.get('uuid')
        name = data.get('name')
        balance = 5000
        # uuid = "hbauoge"
        # name = "yamada"
        # balance = 5000
        
        # Validate that uuid and name are provided
        if not uuid or not name:
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'UUID and name are required'})
            }

        # Call add_user_to_db function
        add_user_to_db(uuid, name, balance)

        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'User added successfully'})
        }
    
    except Exception as error:
        print('[ERROR] lambda_handler error:', error)
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(error)})
        }


def add_user_to_db(uuid: str, name: str, balance: float = 5000):
    """
    Adds a new user to the database.
    """
    print('[DEBUG] add_user_to_db()')
    try:
        connection = pymysql.connect(
            host="face-pay-database.c5may6ci2q4z.us-east-1.rds.amazonaws.com",
            user="admin",
            password="facepaypay",
            db="facepay",
            charset='utf8mb4',
            cursorclass=pymysql.cursors.DictCursor
        )
        with connection.cursor() as cursor:
            sql = "INSERT INTO users (uuid, name, balance) VALUES (%s, %s, %s)"
            cursor.execute(sql, (uuid, name, balance))
            connection.commit()
            print(f'[DEBUG] User {uuid} added successfully with balance {balance}')
    except Exception as error:
        print('[ERROR] Database insertion failed:', error)
    finally:
        if connection:
            connection.close()