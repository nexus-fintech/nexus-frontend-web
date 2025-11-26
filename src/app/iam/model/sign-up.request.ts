export class SignUpRequest {
  public username: string;
  public password: string;
  public roles: string[];

  constructor(username: string, password: string, roles: string[] = []) {
    this.username = username;
    this.password = password;
    this.roles = roles;
  }
}
