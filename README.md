# 🧙 Hokuspokus CLI Tool

## Overview
`hokuspokus-cli` is a CLI tool that leverages the OpenAI API to generate CLI commands based on user prompts for various tools like AWS, GCP, etc.

## Features
- **Configure OpenAI API Key 🔑**: Set up your OpenAI API key for the tool.
- **Translate Descriptions to CLI Commands 💬**: Input a description and get a suggested CLI command.
- **Command Execution Confirmation ✅**: Users can choose to execute the suggested command directly from the CLI.

## Installation

### For Users
To install `hokuspokus` globally and use it from anywhere in your command line interface, run:

```bash
npm install -g hokuspokus-cli
```

### For project contributors
If you are a developer and want to contribute to `hokuspokus-cli`, clone the repository and run the following command in the project directory to install dependencies:

1. Run `npm install` to install the required dependencies.
2. Use `npm link` to symlink the package globally for development testing.

## Usage
- **Configuration**:
  - Run `hokuspokus-cli configure` to set up your OpenAI API key.

- **Translating Text**:
  - Run `hokuspokus -t <tool> "<prompt>""` to receive a suggested CLI command for your description on the chosen tool.
    - `<tool>`: The CLI tool for which you want to generate a command (e.g., aws, gcp).
    - `<prompt>`: Your description of the task.
  - Confirm execution of the command directly within the CLI.

## Example
```bash
hokuspokus -t aws "list the ec2 instances in Ireland region"
```

## Contributing
Contributions are welcome. Please follow the project's contribution guidelines.

## License
[MIT License](LICENSE)

**Note**: This tool uses the OpenAI API and is subject to their usage terms and conditions.