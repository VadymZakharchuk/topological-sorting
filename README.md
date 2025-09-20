# Scenario Execution Scheduler

This project is a single-page application (SPA) built with Vue 3 and Vite, designed to plan and visualize the execution order of interdependent scripts. It uses a topological sorting algorithm to distribute scripts into "waves," where all scripts within a wave can be executed in parallel.

-----

## Key Features

* **Dynamic Planning**: Organizes scripts into waves based on their dependencies.
* **Error Handling**: Detects and reports warnings for missing dependencies or circular relationships.
* **Efficiency Analysis**: Calculates execution efficiency as the ratio of total scripts to the total number of waves.
* **User-Friendly Interface**: Provides a simple and intuitive interface for inputting script data in JSON format.

-----

## Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed (recommended version `20.19.0` or newer).

### Installation

1.  Clone the repository:
    ```bash
    git clone [your repository address]
    ```
2.  Navigate to the project directory:
    ```bash
    cd [your project name]
    ```
3.  Install all dependencies:
    ```bash
    npm install
    ```

### Running the Application

Start the application in development mode:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

-----

## Testing

The project includes a comprehensive test suite built with **Vitest** to ensure reliability.

* **Unit Tests**: Verify the correctness of the sorting algorithm.
* **Component Tests**: Ensure the UI component's behavior is correct and handles user interactions as expected.

To run all tests, execute:

```bash
npm run test
```

-----

## Project Structure

* `src/components/ExecutionPlanner.vue`: The main Vue component responsible for the user interface and interaction handling.
* `src/utils/scriptPlanner.ts`: Contains the core business logic, including the `createExecutionPlan` function.
* `src/utils/scriptPlanner.spec.ts`: The unit test file for the `createExecutionPlan` algorithm.
* `src/components/ExecutionPlanner.spec.ts`: The component test file for `ExecutionPlanner.vue`.

-----

## Usage

To use the application, enter an array of scripts in JSON format into the text area. Each script should have a unique `scriptId` and an array of `dependencies`.

**Example JSON Input:**

```json
[
  { "scriptId": 1, "dependencies": [] },
  { "scriptId": 2, "dependencies": [1] },
  { "scriptId": 3, "dependencies": [1, 2] },
  { "scriptId": 4, "dependencies": [99] }
]
```

After clicking the `Generate plan` button, you will see a visualized execution plan, statistics, and any warnings.

-----

## Main Dependencies

* **Vue 3**: Progressive JavaScript framework.
* **Vite**: Fast build tool.
* **Vitest**: Unit testing framework.
* **@vue/test-utils**: Utilities for testing Vue components.
* **jsdom**: A headless browser environment for DOM testing.
* **Tailwind CSS**: A utility-first CSS framework.

-----

## Author

* [Vadym Zakharchuk]
