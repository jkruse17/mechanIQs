# mechanIQs

**Vehicle-specific car repair platform that helps people maintain their own cars without intimidation or confusion.**

mechanIQs empowers car owners to take control of their vehicle maintenance with AI-powered guidance, detailed repair instructions, and real-time diagnostic support—all tailored to your specific vehicle.

## About

mechanIQs was created with a mission inspired by Neil Postman's observation: *"We live in a world that, for the most part, makes no sense to us."* Our platform removes the fog of war between drivers and their vehicles, making auto maintenance accessible, understandable, and achievable for everyone.

Whether you're a first-time DIY mechanic or an experienced enthusiast, mechanIQs provides the knowledge and context you need to confidently handle your own repairs. By combining vehicle-specific data, AI assistance, and step-by-step guidance, we eliminate confusion and help you save money while building mechanical confidence.

## Core Features

### 🚗 Vehicle Selector
- Select your specific year, make, and model
- VIN lookup support for quick vehicle identification
- Integrates with NHTSA vehicle database for accurate specifications
- Access all features specific to your exact vehicle configuration

### 🔧 Parts Catalog
- Browse maintenance and repair parts compatible with your vehicle
- Compare OEM (Original Equipment Manufacturer) vs. aftermarket pricing
- Real-time pricing and availability sourced from RockAuto
- Difficulty ratings, time estimates, and customer satisfaction scores for each part

### 📖 Guided Repairs
- Step-by-step repair instructions for common maintenance tasks
- Comprehensive tool and supply lists for each job
- Critical safety warnings ("gotchas") to prevent mistakes
- Time estimates to plan your project properly

### 🤖 AI Repair Assistant
- Step-aware chat help that understands exactly where you are in a repair
- Real-time guidance tailored to your vehicle specifications
- Troubleshooting support when you encounter unexpected issues
- Powered by Claude AI with vehicle context awareness

### 🔍 AI Symptom Diagnosis
- Describe your vehicle symptoms and let AI analyze potential causes
- Ranked list of likely issues based on the symptom pattern
- Suggested diagnostic checks to narrow down the problem
- Context-aware recommendations specific to your vehicle

### 🏠 Garage & Maintenance Tracking
- Your personal garage—save and manage multiple vehicles (coming soon)
- Track maintenance history and upcoming service intervals
- Organized maintenance schedule by vehicle and task type
- Remember where you left off across sessions

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
   - Copy `.env.local.example` to `.env.local`
   - Add your Anthropic API key (get one from https://console.anthropic.com/)
   - Add your OpenRouter API key (get one from https://openrouter.ai/keys)

```bash
cp .env.local.example .env.local
# Edit .env.local and add your API key
```

Required keys for AI features:
- `OPENROUTER_API_KEY` for both AI Repair Assistant and AI Symptom Diagnosis (server-side proxy)

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to the URL shown (typically http://localhost:5173)

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Note on API Keys

AI chat requests are proxied through Vite dev server at `/api/ai-chat`, so `OPENROUTER_API_KEY` stays server-side during development.

## Tech Stack

- **Frontend**: React 18, Vite, CSS-in-JS styling
- **APIs**: 
  - OpenRouter (for Claude AI models via proxy)
  - NHTSA Vehicle Database (for vehicle specifications)
  - RockAuto (for parts pricing and availability)

## Project Structure

```
src/
├── pages/              # Main application pages
│   ├── SelectorPage    # Vehicle selection/VIN lookup
│   ├── HubPage         # Main navigation hub
│   ├── GaragePage      # Vehicle management
│   ├── MaintenancePage # Maintenance schedule
│   ├── PartsPage       # Parts catalog browser
│   ├── RepairsPage     # Repair selection
│   ├── RepairPage      # Guided repair with AI chat
│   ├── OBDLookupPage   # OBD-II error code lookup
│   └── SymptomDiagnosisPage # AI symptom analyzer
├── components/         # Reusable UI components
├── constants/          # App data, vehicle specs, parts database
├── utils/
│   ├── guideBuilder    # Generates repair guides
│   ├── storage         # Local storage management
│   └── vehicle         # Vehicle data utilities
└── styles/             # Theme and styling
```

## How It Works

1. **Vehicle Selection**: Users start by selecting their vehicle year/make/model or by entering a VIN
2. **Context Awareness**: Once a vehicle is selected, all subsequent features are personalized to that vehicle
3. **Browse & Learn**: Users explore the parts catalog, maintenance schedules, and available repairs
4. **Guided Repair**: Select a part/repair and follow step-by-step instructions
5. **AI Assistance**: Ask the AI repair assistant questions while working through a repair
6. **Diagnostics**: Use the symptom diagnosis tool to troubleshoot issues

## Use Cases

- **DIY Mechanics**: Complete maintenance tasks confidently with AI guidance
- **Troubleshooting**: Diagnose vehicle problems using AI-powered symptom analysis
- **Cost Savings**: Compare OEM vs. aftermarket parts and understand repair complexity before committing
- **Learning**: Build mechanical knowledge through detailed, vehicle-specific repair guides
- **Planning**: Understand maintenance schedules and plan upcoming service tasks

