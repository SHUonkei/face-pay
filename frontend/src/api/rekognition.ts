import { z } from 'zod';
import { API_BASE_URL, API_KEY } from '../constants';
import ApiError from './ApiError';

const SearchResponseSchema = z.object({
  msg: z.string(),
  payloads: z.object({
    timestamp: z.string(),
    SearchedFaceBoundingBox: z.object({
      Width: z.number(),
      Height: z.number(),
      Left: z.number(),
      Top: z.number(),
    }),
    SearchedFaceConfidence: z.number(),
    FaceMatches: z.array(
      z.object({
        Similarity: z.number(),
        Face: z.object({
          FaceId: z.string().uuid(),
          BoundingBox: z.object({
            Width: z.number(),
            Height: z.number(),
            Left: z.number(),
            Top: z.number(),
          }),
          ImageId: z.string().uuid(),
          ExternalImageId: z.string().uuid(),
          Confidence: z.number(),
          IndexFacesModelVersion: z.string(),
        }),
      }),
    ),
    FaceModelVersion: z.string(),
    ResponseMetadata: z.object({
      RequestId: z.string().uuid(),
      HTTPStatusCode: z.number(),
      HTTPHeaders: z.object({
        'x-amzn-requestid': z.string().uuid(),
        'content-type': z.string(),
        'content-length': z.string(),
        date: z.string(),
      }),
      RetryAttempts: z.number(),
    }),
  }),
});

const SearchErrorResponseSchema = z.object({
  msg: z.string(),
});

export function search(image_base64str: string) {
  return fetch(API_BASE_URL + 'search', {
    method: 'POST',
    body: JSON.stringify({
      threshold: 90,
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
          .then((data) => SearchErrorResponseSchema.parse(data))
          .then((data) => {
            throw new ApiError(data, data.msg);
          });
      }
      return response.json().then((data) => SearchResponseSchema.parse(data));
    })
    .catch((error: Error) => {
      throw error;
    });
}
