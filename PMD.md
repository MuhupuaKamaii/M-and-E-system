# Project Management Document (PMD)
# NPC Frontend Demo - Monitoring & Evaluation System

## Project Overview
**Primary Objective**: Develop a comprehensive web-based monitoring and evaluation system for the National Planning Commission of Namibia to track the implementation of NDP6 (National Development Plan 6) and progress towards Vision 2030.

**Secondary Objective**: Create a proper landing page for the National Planning Commission Frontend Demo that mirrors the official NPC website design and functionality.

## System Context

### PROJECT CONTEXT
This system serves as a digital backbone for tracking Namibia's national development progress through a structured monitoring and evaluation framework. The system enables real-time tracking of programmes, budgets, targets, and outcomes across all implementing bodies while maintaining alignment with NDP6 strategic objectives.

### SYSTEM OVERVIEW
The platform supports two primary user categories with distinct responsibilities:

**Admin Users (NPC Staff)**
- Create and manage users (O/M/As, OPM, NPC)
- Manage auxiliary data (pillars, thematic areas, focus areas, goals, indicators, frameworks)
- View high-level plans and comprehensive reports
- Configure system parameters and access controls

**Implementing Bodies (O/M/As - Offices/Ministries/Agencies)**
- Enter programme data and implementation plans
- Track indicators and submit progress reports  
- Monitor budget allocation and expenditure
- Access personalized progress visualizations

## Design Requirements

### Color Scheme (Based on NPC Website)
- **Primary Blue**: #2C5AA0 (Header background)
- **Secondary Blue**: #4A90E2 (Accent elements)
- **Dark Blue**: #1E3D6F (Text, darker elements)
- **Light Blue**: #E8F4FD (Light backgrounds)
- **Orange**: #FF8C42 (Call-to-action buttons, highlights)
- **White**: #FFFFFF (Text on dark backgrounds)
- **Gray**: #F5F5F5 (Section backgrounds)
- **Dark Gray**: #333333 (Body text)

### Page Structure
1. **Landing Section** (Full viewport height)
   - Header with NPC logo and navigation
   - Hero content with main title
   - "Get Started" button → directs to `/login`
   - Professional background (gradient or image)

2. **Brief Intro Section** (Scroll down)
   - About NPC content
   - Mission and vision
   - Key features/services
   - Clean white background with blue accents

3. **News Highlights Section** (Final section)
   - Current projects
   - Soon-to-start projects
   - Public information updates
   - Card-based layout with orange accents

4. **Footer Section**
   - Contact information
   - Quick links
   - Copyright information
   - Social media links (if applicable)

### User Experience Flow
```
Landing → Scroll to Brief Intro → Scroll to News → Footer
     ↓
"Get Started" Button → Login Page
```

### Target Users
- **Primary**: Admin users (directed to login)
- **Secondary**: Public users (browse information)
- **Tertiary**: Stakeholders (overview of projects)

## Database Structure
The system maintains a comprehensive hierarchical data model supporting NDP6 implementation tracking:

### Core Entities
- **Users** (userId, name, username, password) - O/M/As, OPM, NPC user types
- **Pillars** (pillarId, name, description, goalId, indicators) - 4 main NDP6 pillars (p14-15)
- **Thematic Areas** (themeId, description, pillarId, doId) - Fixed areas (p23)
- **Focus Areas** (areaId, description, themeId) - Specific focus domains (p24)
- **Goals** (goalId, description, goalName, indicatorId) - Strategic objectives
- **Desired Outcomes** (doId, description, goalId) - Fixed outcomes
- **Framework** (frameworkId, name, objectives, pillarId, outcome) - Implementation frameworks
- **Indicators** (indicatorID, indicatorName, description, baseline, target) - Measurable metrics
- **Programmes** (programmeId, name, themeId, voteId, target, budgets, comments) - Implementation units
- **Votes** (budgetVote, userId, programmeId, opBudget, devBudget) - Budget allocations
- **Reports** (auto-generated from forms) - Progress documentation
- **Forms** (frequency-based, year-dynamic) - Data collection instruments

## System Navigation Structure
The application features a three-tier navigation system:

### Primary Navigation Sections
1. **Forms Section** - Planning Phase
   - Programme plan entry
   - Budget allocation
   - Target setting
   - Sub-programme management

2. **Reports Section** - Execution Tracking
   - Progress report submission
   - Actual expenditure updates
   - Quarterly performance tracking
   - Evidence upload and management

3. **Analytics Section** - Monitoring & Evaluation
   - Progress visualizations
   - Performance dashboards
   - Cross-pillar analytics
   - Tagging and filtering systems

## Core Functionality Requirements

### 1. Programme Management
- Create programmes with hierarchical sub-programmes and action steps
- Link programmes to NDP6 structure (pillar → thematic area → focus area → goal → indicator)
- Support cascading relationships and dependencies
- Enable programme categorization and classification

### 2. Budget Tracking & Management
- Track dual budget types: Operational + Capital (Developmental)
- Support multi-level budget allocation (programme and sub-programme levels)
- Monitor actual expenditure vs. planned budget with variance analysis
- Generate budget performance reports and forecasts

### 3. Target Setting & Performance Monitoring
- Configure quarterly targets (Q1, Q2, Q3, Q4) for programmes and indicators
- Implement year selection functionality for temporal data management
- Link targets to specific indicators and strategic goals
- Auto-calculate progress percentages and performance metrics

### 4. Progress Reporting System
- Submit quarterly actuals with automatic progress calculation
- Support multiple reporting frequencies (quarterly, annually)
- Enable narrative reporting with structured comments
- Maintain audit trails for all submissions and modifications

### 5. Evidence & Document Management
- Upload evidence files (PDF, Word, Excel, Images) with validation
- Link evidence to programmes, reports, or specific indicators
- Secure API for evidence download with access controls
- Version control and comprehensive audit trail for documents

### 6. Analytics & Data Visualization
- Interactive dashboards with KPIs and performance analytics
- Advanced search and filtering (pillar, thematic area, ministry, budget type)
- Progress visualization by organizational and thematic dimensions
- Cross-cutting issue tagging system for comprehensive monitoring

### 7. Security & Access Management
- Role-based access control (Admin, O/M/As, OPM, NPC)
- Secure API architecture for sensitive data operations
- Comprehensive audit logging for data changes and access
- User session management and security protocols

## Technical Requirements

### Frontend Components Structure
- `Home.jsx` - Landing page component with NPC branding
- `Login.jsx` - Authentication with role-based routing
- `Dashboard.jsx` - Main navigation and overview
- `Plan.jsx` - Programme planning and management
- `Forms.jsx` - Data entry and submission forms
- `Reports.jsx` - Progress reporting and analytics
- Responsive design for desktop-optimized interface
- Progressive disclosure for complex data hierarchies

### Navigation Flow & User Experience
- Landing page → Role-based login → Dashboard
- "Get Started" → `/login` → User-specific routing
- Sidebar navigation between Forms, Reports, Analytics
- Contextual navigation within each functional area

### Data Architecture Considerations
- Year-based data partitioning for optimal performance
- Cascading dropdown implementation for hierarchical selections
- Automatic calculation engines for progress and variance metrics
- File upload system with security validation and storage
- Export capabilities for reports (PDF, Excel formats)
- RESTful API design for data integration and interoperability

## Design Approach & Standards

### Visual Design Principles
- **Clean, professional government system aesthetic** appropriate for official use
- **Data-dense but organized interface** optimizing information display
- **Clear hierarchy and navigation** reflecting NDP6 structural relationships  
- **Responsive design** with primary focus on desktop functionality
- **Logically functional architecture** supporting complex workflows
- **Progressive disclosure** revealing complexity incrementally as needed
- **Clear visual hierarchy** emphasizing NDP6 structural relationships

### Reference Documentation
- **Namibia NDP6** (National Development Plan 6) - Primary policy framework
- **NDP6 Implementation, Monitoring and Evaluation Plan (IMEP)** - Implementation guidelines
- **Key Pages**: 12 (implementation plan), 20 & 312 (policy details)
- **Geographic Focus**: NPC Namibia structure and context

## Implementation Roadmap

### Phase 1: Foundation (Current)
- [x] Landing page with NPC branding
- [x] Authentication system with role-based routing
- [x] Basic navigation structure
- [ ] Core database schema implementation
- [ ] User management system

### Phase 2: Core Functionality
- [ ] Programme management interface
- [ ] Budget tracking and allocation system
- [ ] Target setting and monitoring tools
- [ ] Progress reporting workflows
- [ ] Evidence management system

### Phase 3: Analytics & Monitoring
- [ ] Dashboard and visualization system
- [ ] Advanced filtering and search capabilities
- [ ] Cross-cutting analysis tools
- [ ] Performance analytics and reporting

### Phase 4: Integration & Optimization
- [ ] API development for data integration
- [ ] Export and reporting capabilities
- [ ] Security hardening and audit systems
- [ ] Performance optimization and scaling

## Quality Assurance Standards
- **Security**: Role-based access with comprehensive audit logging
- **Performance**: Year-based partitioning for large dataset management
- **Usability**: Government system standards with accessibility compliance
- **Reliability**: Automated calculations with manual override capabilities
- **Scalability**: Modular architecture supporting organizational growth

## Notes & Considerations
- **Primary Reference**: Official NPC website (npc.gov.na) for design consistency
- **Compliance**: Government website standards and accessibility requirements
- **Audience**: Professional government users with varying technical expertise  
- **Data Sensitivity**: Handle planning and budget information with appropriate security
- **Integration**: Design for future integration with existing government systems
- **Training**: Consider user training requirements for complex functionality