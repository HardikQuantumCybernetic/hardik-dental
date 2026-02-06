# Contributing to Hardik Dental

First off, thank you for considering contributing to Hardik Dental! It's people like you that make this project such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to hardikjadhav307@gmail.com.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* **Use a clear and descriptive title** for the issue to identify the problem.
* **Describe the exact steps which reproduce the problem** in as many details as possible.
* **Provide specific examples to demonstrate the steps**.
* **Describe the behavior you observed after following the steps** and point out what exactly is the problem with that behavior.
* **Explain which behavior you expected to see instead and why.**
* **Include screenshots and animated GIFs** which show you following the described steps and clearly demonstrate the problem.

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* **Use a clear and descriptive title** for the issue to identify the suggestion.
* **Provide a step-by-step description of the suggested enhancement** in as many details as possible.
* **Provide specific examples to demonstrate the steps**.
* **Describe the current behavior** and **explain which behavior you expected to see instead** and why.
* **Explain why this enhancement would be useful** to most Hardik Dental users.

### Pull Requests

* Fill in the required template
* Do not include issue numbers in the PR title
* Include screenshots and animated GIFs in your pull request whenever possible.
* Follow the TypeScript and React styleguides.
* Include thoughtfully-worded, well-structured tests.
* Document new code
* End all files with a newline

## Development Setup

1. Fork and clone the repo
2. Install dependencies: `npm install`
3. Set up your Supabase project and update credentials
4. Set up your Clerk account and update credentials
5. Start the development server: `npm run dev`
6. Make your changes
7. Test your changes thoroughly
8. Push to your fork and submit a pull request

## Styleguides

### Git Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line
* Consider starting the commit message with an applicable emoji:
    * 🎨 `:art:` when improving the format/structure of the code
    * 🐎 `:racehorse:` when improving performance
    * 📝 `:memo:` when writing docs
    * 🐛 `:bug:` when fixing a bug
    * 🔥 `:fire:` when removing code or files
    * ✅ `:white_check_mark:` when adding tests
    * 🔒 `:lock:` when dealing with security
    * ⬆️ `:arrow_up:` when upgrading dependencies
    * ⬇️ `:arrow_down:` when downgrading dependencies

### TypeScript Styleguide

* Use TypeScript for all new code
* Prefer interfaces over types for object shapes
* Use meaningful variable names
* Add JSDoc comments for complex functions
* Avoid `any` type - use `unknown` if type is truly unknown
* Use optional chaining (`?.`) and nullish coalescing (`??`)

### React Component Styleguide

* One component per file
* Use functional components with hooks
* Use descriptive component names in PascalCase
* Keep components small and focused
* Extract reusable logic into custom hooks
* Use TypeScript for props typing
* Add PropTypes or TypeScript interfaces for all props

### CSS/Tailwind Styleguide

* Use Tailwind utility classes when possible
* Follow the design system tokens defined in `index.css`
* Use semantic color variables (e.g., `text-foreground` not `text-gray-900`)
* Avoid inline styles unless absolutely necessary
* Use responsive design prefixes (`sm:`, `md:`, `lg:`, etc.)

## Testing Guidelines

* Write tests for new features
* Update tests when modifying existing features
* Ensure all tests pass before submitting PR
* Aim for meaningful test coverage, not just high percentages

## Documentation

* Update the README.md if you change functionality
* Comment your code where necessary
* Update API documentation for backend changes
* Add JSDoc comments for complex functions

## Community

* Be respectful and inclusive
* Provide constructive feedback
* Help others when you can
* Share your knowledge

## Questions?

Feel free to open an issue with your question or reach out to the maintainers directly.

Thank you for contributing! 🎉
