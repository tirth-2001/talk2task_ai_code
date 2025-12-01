# Talk2Task AI Component Library

This directory contains reusable components following the **Atomic Design** methodology. Components are organized into atoms and molecules for better maintainability and reusability.

## 📁 Structure

```
components/
├── atoms/           # Basic building blocks
│   ├── Badge.tsx
│   ├── Button.tsx
│   ├── IconContainer.tsx
│   ├── Input.tsx
│   ├── TabButton.tsx
│   ├── Textarea.tsx
│   ├── Toggle.tsx
│   ├── WorkflowNode.tsx
│   └── index.ts
├── molecules/       # Combinations of atoms
│   ├── Card.tsx
│   ├── FeatureCard.tsx
│   ├── NavItem.tsx
│   ├── PageHeader.tsx
│   ├── SectionHeader.tsx
│   ├── Tabs.tsx
│   ├── UploadZone.tsx
│   └── index.ts
└── index.ts         # Main export file
```

## 🧩 Atoms

### Button

A versatile button component with multiple variants and sizes.

**Props:**

- `variant`: 'primary' | 'secondary' | 'ghost' | 'text'
- `size`: 'sm' | 'md' | 'lg'
- `icon`: React.ReactNode (optional)
- `iconPosition`: 'left' | 'right'
- `fullWidth`: boolean

**Example:**

```tsx
import { Button } from '@/components'

;<Button variant="primary" size="lg" icon={<Plus size={16} />}>
  New Workflow
</Button>
```

### Badge

Status indicator component with color variants.

**Props:**

- `variant`: 'success' | 'warning' | 'error' | 'info' | 'neutral'
- `dot`: boolean (shows a dot indicator)

**Example:**

```tsx
import { Badge } from '@/components'

;<Badge variant="success" dot>
  Active
</Badge>
```

### IconContainer

Consistent container for icons with background colors.

**Props:**

- `size`: 'sm' | 'md' | 'lg' | 'xl'
- `variant`: 'primary' | 'secondary' | 'neutral'

**Example:**

```tsx
import { IconContainer } from '@/components'

;<IconContainer size="md" variant="primary">
  <Zap size={24} />
</IconContainer>
```

### Input

Standard text input with consistent styling.

**Props:**

- `error`: boolean
- `fullWidth`: boolean

**Example:**

```tsx
import { Input } from '@/components'

;<Input placeholder="Enter text..." />
```

### Textarea

Multi-line text input with resizable height.

**Props:**

- `error`: boolean
- `fullWidth`: boolean
- `minHeight`: string (e.g., 'min-h-64')

**Example:**

```tsx
import { Textarea } from '@/components'

;<Textarea placeholder="Enter description..." minHeight="min-h-32" />
```

### TabButton

Individual tab button for tab navigation.

**Props:**

- `active`: boolean
- `onClick`: () => void

**Example:**

```tsx
import { TabButton } from '@/components'

;<TabButton active={activeTab === 'paste'} onClick={() => setActiveTab('paste')}>
  Paste Summary
</TabButton>
```

### Toggle

Toggle switch component with smooth animations.

**Props:**

- `checked`: boolean
- `onChange`: (checked: boolean) => void
- `leftLabel`: string (optional)
- `rightLabel`: string (optional)

**Example:**

```tsx
import { Toggle } from '@/components'

;<Toggle checked={isEnabled} onChange={setIsEnabled} leftLabel="Disable" rightLabel="Enable" />
```

### WorkflowNode

Display component for workflow steps on the canvas.

**Props:**

- `icon`: React.ReactNode
- `title`: string
- `description`: string

**Example:**

```tsx
import { Calendar } from 'lucide-react'

import { WorkflowNode } from '@/components'

;<WorkflowNode
  icon={<Calendar size={24} />}
  title="Trigger: Meeting Ends"
  description="Google Calendar / Outlook event ends."
/>
```

## 🔬 Molecules

### Card

Reusable card container with hover effects.

**Props:**

- `hover`: boolean (enables hover effects)
- `padding`: 'none' | 'sm' | 'md' | 'lg'
- `onClick`: () => void (optional)

**Example:**

```tsx
import { Card } from '@/components'

;<Card hover padding="md">
  <h3>Card Title</h3>
  <p>Card content goes here</p>
</Card>
```

### FeatureCard

Card specifically designed for feature selection.

**Props:**

- `icon`: React.ReactNode
- `title`: string
- `description`: string
- `onClick`: () => void

**Example:**

```tsx
import { FeatureCard } from '@/components'

;<FeatureCard
  icon={<Upload size={32} />}
  title="Upload File"
  description="Upload meeting summaries"
  onClick={() => navigate('/upload')}
/>
```

### NavItem

Sidebar navigation item with active state.

**Props:**

- `path`: string
- `label`: string
- `icon`: LucideIcon
- `isActive`: boolean
- `isCollapsed`: boolean

**Example:**

```tsx
import { NavItem } from '@/components'

;<NavItem
  path="/dashboard"
  label="Dashboard"
  icon={LayoutDashboard}
  isActive={location.pathname === '/dashboard'}
  isCollapsed={false}
/>
```

### PageHeader

Page-level header with icon, title, description, and action button.

**Props:**

- `icon`: React.ReactNode (optional)
- `title`: string
- `description`: string (optional)
- `action`: React.ReactNode (optional)

**Example:**

```tsx
import { PageHeader, Button } from '@/components'

;<PageHeader
  icon={<Zap size={28} />}
  title="Automation Studio"
  description="Create and manage workflows"
  action={<Button variant="primary">New Workflow</Button>}
/>
```

### SectionHeader

Section-level header with title and optional subtitle.

**Props:**

- `title`: string
- `subtitle`: string (optional)
- `action`: React.ReactNode (optional)

**Example:**

```tsx
import { SectionHeader } from '@/components'

;<SectionHeader title="Workflow Templates" subtitle="Choose from pre-built templates" />
```

### Tabs

Tab navigation component managing multiple tabs.

**Props:**

- `tabs`: Tab[] (array of { id: string, label: string })
- `activeTab`: string
- `onTabChange`: (tabId: string) => void

**Example:**

```tsx
import { Tabs } from '@/components'

const tabs = [
  { id: 'paste', label: 'Paste Summary' },
  { id: 'upload', label: 'Upload File' }
]

<Tabs
  tabs={tabs}
  activeTab={activeTab}
  onTabChange={setActiveTab}
/>
```

### UploadZone

Drag-and-drop file upload area.

**Props:**

- `onFileSelect`: (file: File) => void
- `accept`: string (file types, default: '.pdf,.docx,.txt')
- `maxSize`: string (display text, default: '10MB')

**Example:**

```tsx
import { UploadZone } from '@/components'

;<UploadZone onFileSelect={(file) => console.log(file)} accept=".pdf,.docx" maxSize="5MB" />
```

## 🎨 Design Tokens

All components use consistent design tokens:

- **Primary Color**: `#5D0EC0` (via Tailwind's `primary` class)
- **Font**: Nunito
- **Border Radius**: Rounded corners (lg, xl)
- **Spacing**: Consistent padding and gaps
- **Transitions**: Smooth hover and focus states

## 📦 Usage

Import components from the main index:

```tsx
import { Button, Card, PageHeader, Badge } from '@/components'
```

Or import specific atoms/molecules:

```tsx
import { Button } from '@/components/atoms'
import { Card } from '@/components/molecules'
```

## 🔧 Customization

All components accept a `className` prop for additional styling:

```tsx
<Button className="mt-4" variant="primary">
  Custom Button
</Button>
```

## 🚀 Best Practices

1. **Use atoms for basic elements** - Buttons, inputs, badges
2. **Use molecules for composite patterns** - Cards, headers, navigation items
3. **Keep components focused** - Each component should have a single responsibility
4. **Leverage TypeScript** - All components are fully typed
5. **Follow the design system** - Use provided variants instead of custom styles

## 📝 Contributing

When adding new components:

1. Place atoms in `atoms/` and molecules in `molecules/`
2. Export from the respective `index.ts` file
3. Add TypeScript types for all props
4. Include className prop for extensibility
5. Document the component in this README
