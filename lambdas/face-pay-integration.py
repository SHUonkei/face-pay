import json
import uuid
from typing import Any, Dict, Optional, Tuple

import boto3

client = boto3.client("lambda")

RECOGNITION_LAMBDA = "face-pay-face-recognition"
TRANSACTION_LAMBDA = "face-pay-transaction"
NOTIFY_LAMBDA = "face-pay-notify"


def make_response(status_code: int, msg: str, payloads: Optional[dict] = None) -> dict:
    """
    レスポンスを作成する
    """
    print("[DEBUG]make_response()")
    body_obj: Dict[str, Any] = {"msg": msg}
    if payloads is not None:
        body_obj["payloads"] = payloads

    return {
        "statusCode": status_code,
        "headers": {"Access-Control-Allow-Origin": "*"},
        "body": json.dumps(body_obj),
    }


def load_json(str_json: Any) -> Tuple[bool, dict]:
    """
    JSON文字列をPythonで処理できる形にする
    """
    print("[DEBUG]load_json()")
    if str_json is None:
        return False, make_response(400, "[FAILED]Data required")

    if isinstance(str_json, str):
        try:
            return True, json.loads(str_json)
        except json.JSONDecodeError:
            print("[DEBUG]json decode error")
            return False, make_response(400, "[FAILED]json decode error")

    return True, str_json


def invoke_lambda(function_name: str, body: dict) -> dict:
    """
    Lambda(同期)を呼び出して、Payloadをdictにして返す
    """
    response = client.invoke(
        FunctionName=function_name,
        InvocationType="RequestResponse",
        LogType="Tail",
        Payload=json.dumps({"body": body}),
    )
    return json.loads(response["Payload"].read())


def lambda_handler(event, context):
    try:
        # リクエストボディの中の文字列型JSONデータをPythonで扱える形に変換する
        result, body = load_json(event.get("body"))
        request_id = uuid.uuid4()
        print(f"[REQUEST ID: {request_id}] Processing new request")

        if not result:
            return body

        print("[body][store_id]:", body["store_id"])

        # 顔認識
        recognition_payload = invoke_lambda(
            RECOGNITION_LAMBDA,
            {"image_base64str": body["image_base64str"], "threshold": 90},
        )
        print("[DEBUG]recognition_lambda")
        print("[response]:", recognition_payload)

        if recognition_payload.get("statusCode") != 200:
            return make_response(recognition_payload["statusCode"], recognition_payload["body"])

        _, recognition_body = load_json(recognition_payload.get("body"))
        print("response_body[payloads][FaceMatches]:", recognition_body["payloads"]["FaceMatches"])
        print("response_body[payloads][FaceMatches][0]:", recognition_body["payloads"]["FaceMatches"][0])

        face_data = recognition_body["payloads"]["FaceMatches"][0]
        user_id = face_data["Face"]["ExternalImageId"]
        print("user_id", user_id)

        # 取引
        transaction_payload = invoke_lambda(
            TRANSACTION_LAMBDA,
            {"user_id": user_id, "store_id": body["store_id"], "amount": body["amount"]},
        )
        print("[DEBUG]transaction_lambda")
        print("[transaction_payload]:", transaction_payload)

        if transaction_payload.get("statusCode") != 200:
            return make_response(transaction_payload["statusCode"], transaction_payload["body"])

        _, transaction_body = load_json(transaction_payload.get("body"))
        transaction_id = transaction_body.get("transaction_id")

        # notify
        notify_payload = invoke_lambda(
            NOTIFY_LAMBDA,
            {"transaction_id": transaction_id, "status_code": transaction_payload["statusCode"]},
        )
        print("[DEBUG]notify_lambda")
        print("[notify_payload]:", notify_payload)

        _, notify_body = load_json(notify_payload)
        print("[notify_body]:", notify_body)

        if notify_body.get("status") == "success":
            transaction = notify_body.get("transaction")
            return make_response(200, "[SUCCESS]Your successful transaction", transaction)

    except Exception as error:
        error_response = {"error_message": str(error), "request_body": "error"}
        return make_response(500, "[FAILED]An error occurred", error_response)
