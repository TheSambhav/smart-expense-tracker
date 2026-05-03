# Smart Expense Tracker

A professional-grade, high-performance personal finance management dashboard built with the Next.js 15 App Router architecture.

## Overview

Smart Expense Tracker provides a comprehensive suite for financial monitoring, featuring an integrated rule-based natural language processing (NLP) engine for data querying and a high-throughput CSV processing pipeline.

## Features

- **Rule-Based AI Assistant**: Context-aware financial querying engine utilizing Drizzle ORM for precise data aggregation.
- **High-Performance Data Ingestion**: Batch-optimized CSV import system designed to handle large datasets within the Vercel/Next.js execution limits.
- **Financial Visualization**: Real-time analytical dashboards using Recharts for categorical spending and temporal trends.
- **Responsive Architecture**: Mobile-first design with a persistent desktop sidebar for multitasking.
- **Stateless Authentication**: Secure session management via Better Auth with PostgreSQL persistence.

## Technical Specifications

- **Frontend**: Next.js 15 (React 19, Turbopack)
- **Database**: PostgreSQL (Supabase)
- **ORM**: Drizzle ORM
- **Authentication**: Better Auth
- **Styling**: Tailwind CSS 4
- **Visualization**: Recharts
- **Parsing**: PapaParse

## Requirements

- **Node.js**: Version 20.0.0 or higher
- **Database**: PostgreSQL instance (Supabase recommended)
- **Package Manager**: npm or yarn

## Getting Started

1. **Clone and Install**:
   ```bash
   npm install
   ```

2. **Environment Configuration**:
   Create a `.env` file in the root directory with the following variables:
   ```env
   DATABASE_URL="postgresql://user:password@host:port/dbname"
   BETTER_AUTH_SECRET="your_32_character_secret"
   BETTER_AUTH_URL="http://localhost:3000"
   ```

3. **Database Migration**:
   ```bash
   npx drizzle-kit push
   ```

4. **Development Execution**:
   ```bash
   npm run dev
   ```

## Supported AI Query Patterns

The integrated assistant supports various query intents:
- **Aggregation**: "Total spend in March", "Sum of food expenses this month"
- **Analysis**: "Highest spend this year", "Average transaction amount"
- **Breakdown**: "Spending distribution by category", "Categorical summary"
- **Reporting**: "Show recent transactions", "Last 5 entries"
