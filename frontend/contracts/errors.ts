export class AuthError extends Error {
  constructor(message: string = "Аутентификация қатесі") {
    super(message);
    this.name = "AuthError";
  }
}

export class ValidationError extends Error {
  constructor(message: string = "Валидация қатесі") {
    super(message);
    this.name = "ValidationError";
  }
}
