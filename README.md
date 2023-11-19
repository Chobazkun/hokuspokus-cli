
# 🧙 Hokuspokus CLI Tool

## Overview
`hokuspokus-cli` is a CLI tool that leverages the OpenAI API to generate CLI commands based on user prompts for various tools like AWS, GCP, etc.

## Features
- **Configure OpenAI API Key 🔑**: Set up your OpenAI API key for the tool.
- **Translate Descriptions to CLI Commands 💬**: Input a description and get a suggested CLI command.
- **Command Execution Confirmation ✅**: Users can choose to execute the suggested command directly from the CLI.
- **Fetching Manuals 📚**: Retrieve the latest manual for a specific command based on a description.
- **Generating Scripts 📜**: Create scripts in various programming languages or tools based on your description.
- **Generating Code Snippets 🧩**: Generate short code snippets for quick tasks.

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

- **Translating Text to CLI commands**:
  - Run `hokuspokus -t <tool> "<prompt>"` to receive a suggested CLI command for your description on the chosen tool.
    - `<tool>`: The CLI tool for which you want to generate a command (e.g., aws, gcp).
    - `<prompt>`: Your description of the task.
  - Confirm execution of the command directly within the CLI.

- **Fetching Manuals**:
  - Use `hokuspokus -m "<command_prompt>"` to get the latest manual for a specific command.
    - `<command_prompt>`: Describe the command for which you need a manual.

- **Generating Scripts**:
  - Run `hokuspokus -s "<script_prompt>"` to generate a script in the specified language or tool based on your prompt.
    - `<script_prompt>`: Describe the task for which you need a script.
  - You will be prompted to save the script to a file.

- **Generating Code Snippets**:
  - Use `hokuspokus -c "<code_prompt>"` to generate a short code snippet based on your prompt.
    - `<code_prompt>`: Describe the task for which you need a code snippet.
  - The snippet will be displayed directly in the CLI.


## Example
```bash
# Configure OpenAI API Key
hokuspokus configure

# Translate Text to CLI Command
hokuspokus -t aws "describe all instances in the us-east-1 region"

# Fetch Command Manual
hokuspokus -m "manual for git commit command"

# Generate a Script
hokuspokus -s "Python script to sort a list of numbers"

# Generate a Code Snippet
hokuspokus -c "JavaScript function to reverse a string"
```

## Contributing
Contributions are welcome. Please follow the project's contribution guidelines.

## License
[MIT License](LICENSE)

**Note**: This tool uses the OpenAI API and is subject to their usage terms and conditions.
