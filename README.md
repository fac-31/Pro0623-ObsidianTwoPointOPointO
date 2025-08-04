# Obsidian 2.0.0 - AI-Powered World Building Platform

An innovative world-building application that enables users to create, explore, and navigate interconnected worlds through a graph database backend, powered by natural language AI agents.

## 🌟 Overview

Obsidian 2.0.0 is a sophisticated world-building platform that combines the power of graph databases with AI-driven natural language processing. Users can create rich, interconnected worlds with characters, places, events, and relationships, then query and explore their creations using simple natural language commands.

## ✨ Key Features

### 🧠 AI-Powered Data formulation

- **Natural Language Interface**: Create your world in a graph database by writing a series of documents. Our agents use these to create your world in the form of nodes and relationships

### 📊 Interactive Visualization

- **Dynamic Graph View**: Visual representation of world data using Cytoscape.js
- **Accessible Alternative**: Text-based view for improved accessibility

### 🎨 Modern User Interface

- **Component-Based Architecture**: Built with reusable Svelte components
- **Resizable Panels**: Customizable layout with draggable panel separators
- **Tab Management**: Multi-tab interface for efficient content browsing

## 🛠 Technology Stack

### Frontend & Backend

- **Framework**: SvelteKit 5
- **Language**: TypeScript with Svelte
- **Styling**: Tailwind CSS 4 + DaisyUI 5
- **UI Components**: Custom component library with accessibility focus

### Database & AI

- **Graph Database**: Neo4j for interconnected data storage
- **AI Framework**: LangChain with OpenAI GPT-4 integration
- **Authentication**: Supabase Auth integration
- **Vector Database**: Planned for semantic search capabilities (still to come)

### Development & Testing

- **Build Tool**: Vite
- **Testing**: Vitest (unit) + Playwright (E2E)
- **Code Quality**: ESLint + Prettier
- **Package Management**: npm with semantic versioning

## 🏗 Architecture

### Core Components

#### Dashboard (`src/lib/components/Dashboard.svelte`)

Central hub managing the three main interface areas:

- **World View**: Graph visualization and accessible text view
- **Query Panel**: Natural language input interface
- **Info Panel**: Content display and editing interface

#### Graph Database Integration (`src/lib/db/neo4j.ts`)

Robust Neo4j connection handling with:

- Connection pooling and session management
- Error handling and recovery
- Query optimization for world-scoped data

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Neo4j database instance
- OpenAI API key
- Supabase project (for authentication)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/fac-31/Pro0623-ObsidianTwoPointOPointO.git
cd Pro0623-ObsidianTwoPointOPointO
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
# Create .env file with:
PUBLIC_NEO4J_URL=your_neo4j_url
PUBLIC_NEO4J_USERNAME=your_username
PUBLIC_NEO4J_PASSWORD=your_password
OPENAI_API_KEY=your_openai_key
```

4. Start the development server:

```bash
npm run dev
```

## 🔧 Running the Python Server

### 1. Create a Virtual Environment

```bash
# macOS/Linux
python3 -m venv venv

# Windows
python -m venv venv
```

### 2. Activate the Virtual Environment

```bash
# macOS/Linux
source venv/bin/activate

# Windows (Git Bash or similar)
source venv/Scripts/activate
```

### 3. Install Required Modules

```bash
pip install -r src/python/requirements.txt
```

### 4. Run the Server from Project Root

```bash
# macOS/Linux
python3 src/python/server.py

# Windows
python src/python/server.py
```

### 5. Deactivate the Virtual Environment

```bash
deactivate
```

---

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run lint` - Check code quality
- `npm run format` - Format code

## 📱 Usage

### Creating a World

1. Authenticate with your account
2. Navigate to the worlds page
3. Click "Create New World"

## 🧪 Testing

### Unit Tests

Component and utility function tests using Vitest:

```bash
npm test
```

### End-to-End Tests

User workflow testing with Playwright:

```bash
npm run test:e2e
```

### Accessibility Testing

Built-in accessibility validation:

```bash
npm run test:a11y
```

## 🎯 Future Roadmap

### Planned AI Agents

1. **Relationship Agent** - Process and structure user-created content
2. **Router Agent** - Coordinate between semantic and relationship query agents
3. **Semantic Query Agent** - Vector database integration for semantic search

### Upcoming Features

- Vector database integration for enhanced semantic search
- Advanced privacy and sharing controls
- Collaborative world building
- Export capabilities for various formats
- Mobile application

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes with tests
4. Run quality checks: `npm run lint && npm run check`
5. Submit a pull request

## How to commit — Standardized Commits

We use [Commitizen](https://commitizen-tools.github.io/commitizen/) to help create consistent commit messages required for automated versioning.

Instead of `git commit`, run:

```bash
npm run commit
```

## 🙏 Acknowledgments

- Built with love by the FAC-31 cohort
- Powered by the amazing Svelte and Neo4j communities
- AI capabilities enabled by OpenAI and LangChain

---

**Obsidian 2.0.0** - Where imagination meets intelligent technology ✨
