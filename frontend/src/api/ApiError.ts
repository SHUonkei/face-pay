class ApiError<T> extends Error {
  response: T;

  constructor(response: T, ...params: ConstructorParameters<typeof Error>) {
    // 親のコンストラクターに（ベンダー固有のものも含めて）残りの引数を渡す
    super(...params);

    // エラーが発生した箇所の正しいスタックトレースを維持する （V8でのみ有効）
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }

    this.name = 'ApiError';
    // カスタムのデバッグ情報
    this.response = response;
  }
}

export default ApiError;
