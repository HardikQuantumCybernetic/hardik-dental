# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Which versions are eligible for receiving such patches depends on the CVSS v3.0 Rating:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

Please report (suspected) security vulnerabilities to **[hardikjadhav307@gmail.com]**. You will receive a response from us within 48 hours. If the issue is confirmed, we will release a patch as soon as possible depending on complexity but historically within a few days.

### What to Include in Your Report

* Type of issue (e.g. buffer overflow, SQL injection, cross-site scripting, etc.)
* Full paths of source file(s) related to the manifestation of the issue
* The location of the affected source code (tag/branch/commit or direct URL)
* Any special configuration required to reproduce the issue
* Step-by-step instructions to reproduce the issue
* Proof-of-concept or exploit code (if possible)
* Impact of the issue, including how an attacker might exploit the issue

## Security Best Practices

### For Users

1. **Keep Dependencies Updated**: Regularly update all dependencies to patch known vulnerabilities
2. **Use Strong Passwords**: Ensure all admin accounts use strong, unique passwords
3. **Enable HTTPS**: Always use HTTPS in production
4. **Secure Environment Variables**: Never commit sensitive credentials to version control
5. **Enable Row Level Security**: Ensure RLS is enabled on all Supabase tables
6. **Regular Backups**: Maintain regular database backups

### For Developers

1. **Input Validation**: Always validate and sanitize user input
2. **Authentication**: Use Clerk for authentication, never roll your own
3. **Authorization**: Implement proper role-based access control
4. **SQL Injection**: Use parameterized queries, never string concatenation
5. **XSS Prevention**: Sanitize all user-generated content before rendering
6. **CSRF Protection**: Implement CSRF tokens for state-changing operations
7. **Rate Limiting**: Implement rate limiting on sensitive endpoints
8. **Logging**: Log security-relevant events without exposing sensitive data

## Known Security Considerations

### Supabase Row Level Security (RLS)

All tables in the database should have RLS enabled. The following policies are implemented:

* **patients**: Healthcare providers can manage, anyone can view
* **appointments**: Healthcare providers can create/update, admins can delete
* **feedback**: Anyone can submit, admins can manage
* **user_roles**: Users can view their own roles, admins can manage all

### Clerk Authentication

* Clerk handles authentication and session management
* User credentials are never stored in our database
* JWTs are used for API authentication
* Sessions are automatically refreshed

### API Keys and Secrets

* Never commit API keys to version control
* Use Supabase secrets for sensitive credentials
* Rotate keys regularly
* Use environment-specific keys for dev/staging/prod

## Security Updates

We regularly update our dependencies to patch known vulnerabilities. Security updates are prioritized and released as soon as possible.

## Disclosure Policy

When we receive a security bug report, we will:

1. Confirm the problem and determine the affected versions
2. Audit code to find any similar problems
3. Prepare fixes for all supported versions
4. Release new security fix versions as soon as possible

## Comments on this Policy

If you have suggestions on how this process could be improved, please submit a pull request.
