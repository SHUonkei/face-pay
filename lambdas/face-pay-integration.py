import json
import boto3
from typing import Union, Tuple
from datetime import datetime
import botocore.exceptions
import base64

client = boto3.client('lambda')
RECOGNITION_LAMBDA = 'face-pay-face-recognition'
TRANSACTION_LAMBDA = 'face-pay-transaction'
NOTIFY_LAMBDA = 'face-pay-notify'

def make_response(status_code: int, msg: str, payloads: dict = None) -> dict:
    """
    レスポンスを作成する
    """
    print('[DEBUG]make_response()')
    if payloads:
        body = json.dumps({'msg': msg, 'payloads': payloads})
    else:
        body = json.dumps({'msg': msg})
    return {
        'statusCode': status_code,
        'headers': {"Access-Control-Allow-Origin" : "*"},
        'body': body,
    }

def load_json(str_json: str) -> Tuple[bool, dict]:
    """
    JSON文字列をPythonで処理できる形にする
    """
    print('[DEBUG]load_json()')
    if str_json is None:
        return False, make_response(400, '[FAILED]Data required')
    if isinstance(str_json, str):
        try:
            return True, json.loads(str_json)
        except json.JSONDecodeError:
            print('[DEBUG]json decode error')
            return False, make_response(400, '[FAILED]json decode error')
    else:
        return True, str_json

def lambda_handler(event, context):
    try:
        # リクエストボディの中の文字列型JSONデータをPythonで扱える形に変換する
        result, body = load_json(event['body'])
        import uuid
        request_id = uuid.uuid4()
        print(f'[REQUEST ID: {request_id}] Processing new request')
        print("[body][store_id]:",body['store_id'])
        if not result:
            return body

        # リクエストボディの内容を設定
        query = json.dumps({"body":{'image_base64str': body['image_base64str'], 'threshold': 90}})
        
        # Lambdaを実行して顔認識を行う
        response = client.invoke(
            FunctionName=RECOGNITION_LAMBDA,
            InvocationType='RequestResponse',
            LogType='Tail',
            Payload=query
        )
        print('[DEBUG]recognition_lambda')

        # 認識結果の読み取りとチェック
        print("[response]:", response)
        response_payload = json.loads(response['Payload'].read())
        print("[response_payload]:", response_payload)
        if response_payload["statusCode"] != 200:
            return make_response(response_payload["statusCode"], response_payload["body"])
        response_body = load_json(response_payload['body'])
        response_body = response_body[1]
        print("response_body[payloads][FaceMatches]:", response_body["payloads"]["FaceMatches"])
        print("response_body[payloads][FaceMatches][0]:",response_body["payloads"]["FaceMatches"][0])
        Face_data = response_body["payloads"]["FaceMatches"][0]
        user_id = Face_data["Face"]["ExternalImageId"]
        print('user_id',user_id)

        # 取引用のクエリを作成して送信
        transaction_query = json.dumps({"body":{
            'user_id': user_id, 
            'store_id': body['store_id'], 
            'amount': body['amount']
        }})
        
        # Lambdaを実行して取引処理を行う
        transaction_response = client.invoke(
            FunctionName=TRANSACTION_LAMBDA,
            InvocationType='RequestResponse',
            LogType='Tail',
            Payload=transaction_query
        )
        print('[DEBUG]transaction_lambda')

        # 取引結果の読み取り
        transaction_payload = json.loads(transaction_response['Payload'].read())
        print('[transaction_payload]:',transaction_payload)
        transaction_body = load_json(transaction_payload['body'])
        transaction_id = transaction_body[1].get('transaction_id')
        
        if transaction_payload["statusCode"] != 200:
            return make_response(transaction_payload["statusCode"], transaction_payload["body"])
        
        notify_query = json.dumps({"body":{
            'transaction_id': transaction_id, 
            'status_code': transaction_payload["statusCode"], 
        }})

        # notify
        notify_response = client.invoke(
            FunctionName=NOTIFY_LAMBDA,
            InvocationType='RequestResponse',
            LogType='Tail',
            Payload=notify_query
        )
        print('[DEBUG]notify_lambda')
        notify_payload = json.loads(notify_response['Payload'].read())
        print('[notify_payload]:',notify_payload)
            
        _, notify_body = load_json(notify_payload)
        print('[notify_body]:',notify_body)
        status = notify_body.get('status')
        if status == 'success':
            transaction = notify_body.get('transaction')
            response = transaction
            return make_response(200, '[SUCCESS]Your successful transaction', response)

    except Exception as error:
        error_response = {
            'error_message': str(error),
            'request_body': "error"
        }
        return make_response(500, '[FAILED]An error occurred', error_response)
