
# 🧙 Hokuspokus CLI Tool

## Overview

`hokuspokus-cli` is a CLI tool designed for developers that leverages the OpenAI API to boost their daily productivity 👨‍💻🚀.

## Features

- **Configure OpenAI API Key 🔑**: Set up your OpenAI API key for the tool.
- **Translate Descriptions to CLI Commands 💬**: Input a description and get a suggested CLI command. Users can choose to execute the suggested command directly from the CLI.
- **Fetching Manuals and Documentations 📚**: Retrieve the latest manual or documentation for a specific command or tool based on a description.
- **Generating Scripts 📜**: Create scripts in various programming languages or tools based on your description. The tool offers the posibility to directly save the script.
- **Generating Code Snippets 🧩**: Generate short code snippets for quick tasks.
- **Code Review for Recent Changes 🔍**: Review recent code changes in the current folder for code quality, style, best practices, and more. Requires Git to be installed and executed in a git repository.
- **Asking Software Engineering Questions 🧠**: Pose questions about software engineering and receive precise, expert answers. Users have the option to delve deeper into the topic or conclude the interaction after receiving the initial response.
- **Debugging Code 🐛**: Debug issues by analyzing error messages and the content of the current directory's files. This command scans all files and subfiles for context to provide a solution.
- **Developing Features 🛠️**: Generate a development plan for a new feature based on its description and the current project's context. This command scans all files and subfiles in the directory for a comprehensive approach.

## Installation

### For Users

To install `hokuspokus` globally and use it from anywhere in your command line interface, run:

```bash
npm install -g hokuspokus-cli
```

### For project contributors

If you are a developer and want to contribute to `hokuspokus-cli`, clone the repository and run the following command in the project directory to install dependencies:

1. Run `npm install` to install the required dependencies.
2. Run `npm run build` to locally build the project using parcel.
3. Use `npm link` to symlink the package globally for development testing.

## Usage

- **Configuration**:
  - Run `hokuspokus configure` to set up your OpenAI API key.

- **Translating Text to CLI Commands**:
  - Run `hokuspokus cli "<cli_prompt>"` to receive a suggested CLI command for your description.
    - `<cli_prompt>`: Your description of the task.
  - Confirm execution of the command directly within the CLI.

- **Fetching Manuals**:
  - Run `hokuspokus man "<manual_prompt>"` to get the latest manual or documentation for a specific command or tool.
    - `<manual_prompt>`: Describe the command for which you need a manual.

- **Generating Scripts**:
  - Run `hokuspokus script "<script_prompt>"` to generate a script based on your prompt.
    - `<script_prompt>`: Describe the task for which you need a script.
  - You will be prompted to save the script to a file.

- **Generating Code Snippets**:
  - Run `hokuspokus code "<code_prompt>"` to generate a short code snippet based on your prompt.
    - `<code_prompt>`: Describe the task for which you need a code snippet.
  - The snippet will be displayed directly in the CLI.

- **Code Review**:
  - Run `hokuspokus code-review` to perform an AI-powered review of your recent code changes. This feature provides feedback on various aspects like code quality, coding style, adherence to principles like SOLID and DRY, potential refactoring, and unit testing.

- **Asking Software Engineering Questions**:
  - Run `hokuspokus question "<question_prompt>"` to ask a software engineering-related question and receive a concise, expert answer.
    - `<question_prompt>`: Your specific question about software engineering.
  - After receiving the answer, you can choose to ask for more details or exit.

- **Debugging Code**:
  - Run hokuspokus debug `<error_message>` to analyze an error message and the contents of your current directory for debugging insights.
    - `<error_message>`: The error message you are trying to debug.

- **Developing Features**:
  - Run hokuspokus develop `<feature_description>` to generate a development plan for a new feature based on the current project context.
    - `<feature_description>`: Description of the feature you want to develop.

## Example

```bash
# Configure OpenAI API Key
hokuspokus configure

# Translate Text to CLI Command
hokuspokus cli "aws cli command to describe all instances in the us-east-1 region"

# Fetch Command Manual
hokuspokus man "manual for git commit command"

# Generate a Script
hokuspokus script "Python script to sort a list of numbers"

# Generate a Code Snippet
hokuspokus code "JavaScript function to reverse a string"

# Perform a Code Review
hokuspokus code-review

# Ask a Software Engineering Question
hokuspokus question "What is the difference between interface and abstract class in Java?"

# Debugging Code
hokuspokus debug "TypeError: undefined is not a function"

# Developing a New Feature
hokuspokus develop "Implement a new authentication system using OAuth"
```

## Contributing

Contributions are welcome. Please follow the project's contribution guidelines.

## License

[MIT License](LICENSE)

**Note**: This tool uses the OpenAI API and is subject to their usage terms and conditions.
