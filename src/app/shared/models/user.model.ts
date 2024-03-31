export class User {
  constructor(
    public id: string,
    public username: string,
    public password: string,
    public first_name: string,
    public last_name: string,
    public email: string,
    public token: string,
    public active: string,
    public role_id: string,
    public permissions: string[]
  ) {
  }
}
