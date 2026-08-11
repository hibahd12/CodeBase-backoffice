export class User {
    id: number;
    username: string;
    // C-08: password ne doit JAMAIS être stocké côté client (XSS exfiltration risk)
    password?: string;
    firstName?: string;
    lastName?: string;
    token?: string;
    email: string;
}
