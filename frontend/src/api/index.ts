import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { API_BASE_URL, API_KEY } from '../constants';
import ApiError from './ApiError';

const PaymentResponseSchema = z.object({
  msg: z.string(),
  payloads: z.object({
    amount: z.number(),
    store_name: z.string(),
    updated_at: z.string(),
  }),
});

const PaymentErrorResponseSchema = z.object({
  msg: z.string(),
});

export function payment(
  storeId: number,
  image_base64str: string,
  amount: number,
) {
  return fetch(API_BASE_URL + 'integral_execution', {
    method: 'POST',
    body: JSON.stringify({
      amount: amount,
      store_id: storeId,
      image_base64str: image_base64str,
    }),
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': API_KEY,
    },
  })
    .then((response) => {
      if (!response.ok) {
        return response
          .json()
          .then((data) => PaymentErrorResponseSchema.parse(data))
          .then((data) =>
            PaymentErrorResponseSchema.parse(JSON.parse(data.msg)),
          )
          .then((data) => {
            throw new ApiError(data, data.msg);
          });
      }
      return response.json().then((data) => PaymentResponseSchema.parse(data));
    })
    .catch((error) => {
      throw error;
    });
}

const RegisterFaceResponseSchema = z.object({
  msg: z.string(),
});

export function registerFace(image_base64str: string) {
  return fetch(API_BASE_URL + 'register-face', {
    method: 'POST',
    body: JSON.stringify({
      uuid: uuidv4(),
      image_base64str: image_base64str,
    }),
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': API_KEY,
    },
  })
    .then((response) => {
      if (!response.ok) {
        return response
          .json()
          .then((data) => RegisterFaceResponseSchema.parse(data))
          .then((data) => {
            throw new ApiError(data, data.msg);
          });
      }
      return response
        .json()
        .then((data) => RegisterFaceResponseSchema.parse(data));
    })
    .catch((error) => {
      throw error;
    });
}

const ShopTransactionResponseSchema = z.object({
  msg: z.string(),
});

export function shopTransaction(shopId: number) {
  return fetch(API_BASE_URL + 'get-transactions', {
    method: 'POST',
    body: JSON.stringify({
      store_id: shopId,
    }),
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': API_KEY,
    },
  })
    .then((response) => {
      if (!response.ok) {
        return response
          .json()
          .then((data) => ShopTransactionResponseSchema.parse(data))
          .then((data) => {
            throw new ApiError(data, data.msg);
          });
      }
      return response
        .json()
        .then((data) => ShopTransactionResponseSchema.parse(data));
    })
    .catch((error) => {
      throw error;
    });
}
