# Patient Management System - Component Documentation

## Overview

The new patient management system has been integrated with a comprehensive sidebar navigation structure. The system includes the following features:

- **Main Navigation Sidebar**: Provides access to Dashboard and Patient Management
- **Patient Management Page**: With its own sub-sidebar for managing patients
- **Add Patient**: Register new patients with comprehensive medical information
- **Update Patient**: Search and modify existing patient records with document management
- **Medical Documents**: Upload, view, and manage patient medical documents

## Components

### 1. MainSidebar.jsx

Located: `src/components/MainSidebar.jsx`

**Purpose**: Main navigation sidebar for the entire application

**Props**:

- `activeMenu` (string): Currently active menu item
- `setActiveMenu` (function): Function to update active menu
- `onLogout` (function): Logout handler

**Features**:

- Navigation to Dashboard
- Navigation to Patient Management
- Logout button
- Gradient background with responsive styling

**Usage**:

```jsx
<MainSidebar
  activeMenu={activeMenu}
  setActiveMenu={setActiveMenu}
  onLogout={handleLogout}
/>
```

---

### 2. PatientManagementSidebar.jsx

Located: `src/components/PatientManagementSidebar.jsx`

**Purpose**: Sub-sidebar for Patient Management page

**Props**:

- `activeTab` (string): Currently active tab ("add" or "update")
- `setActiveTab` (function): Function to update active tab

**Features**:

- Add Patient option
- Update Patient option
- Visual indicators for active tab
- Helpful tips section

**Usage**:

```jsx
<PatientManagementSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
```

---

### 3. PatientManagement.jsx

Located: `src/components/PatientManagement.jsx`

**Purpose**: Main wrapper component for patient management functionality

**Features**:

- Contains PatientManagementSidebar
- Conditionally renders Add Patient or Update Patient components
- Responsive layout

**Route**: `/main` (Main Layout) → Patient Management tab

---

### 4. UpdatePatient.jsx

Located: `src/components/UpdatePatient.jsx`

**Purpose**: Component for searching, viewing, and updating patient records

**Features**:

- Search patients by Patient ID
- View patient information
- Edit patient details:
  - Name, Age, Weight, Height
  - Gender, Blood Type
  - Allergies, Chronic Conditions
  - Lifestyle factors (Smoking, Alcohol, Exercise)
- Integrated Medical Documents manager
- Real-time notifications

**API Endpoints Used**:

- `GET /api/patients/:patientId` - Fetch patient details
- `PUT /api/patients/:patientId` - Update patient information

**Usage**:

```jsx
<UpdatePatient />
```

---

### 5. DocumentManager.jsx

Located: `src/components/DocumentManager.jsx`

**Purpose**: Handle medical document uploads, storage, and management

**Features**:

- File upload (PDF, DOCX, JPG, PNG)
- Document listing with upload dates
- Document download functionality
- File validation
- Loading states and notifications

**API Endpoints Used**:

- `POST /api/documents/add` - Upload medical document
- `GET /api/documents/patient/:patientId` - Fetch patient's documents
- `GET /api/documents/:documentId` - Download document

**Props**:

- `patientId` (string): ID of the patient whose documents to manage

**Usage**:

```jsx
<DocumentManager patientId={patientId} />
```

---

### 6. MainLayout.jsx

Located: `src/components/MainLayout.jsx`

**Purpose**: Main layout wrapper that combines MainSidebar with Dashboard and PatientManagement

**Features**:

- Menu state management
- Conditional rendering based on active menu
- Logout functionality

**Route**: `/main`

---

### 7. Dashboard.jsx (Enhanced)

Located: `src/components/Dashboard.jsx`

**Purpose**: Main dashboard with statistics and overview

**Features**:

- Statistics cards (Total Patients, Active Sessions, Appointments, Consultations)
- Recent consultations display
- Performance metrics with progress bars
- Responsive grid layout

---

## Navigation Flow

```
/main (MainLayout)
├── Dashboard (default)
│   └── Overview statistics and metrics
└── Patient Management
    ├── Add Patient (RegisterPatient.jsx)
    │   └── Register new patients
    └── Update Patient
        ├── Search patient by ID
        ├── Edit patient information
        └── Document Manager
            ├── Upload documents
            ├── View documents
            └── Download documents
```

---

## API Endpoints Reference

### Patient Management Endpoints

```
PUT /api/patients/:patientId
GET /api/patients/:patientId
```

### Document Management Endpoints

```
POST /api/documents/add (multipart/form-data)
GET /api/documents/patient/:patientId
GET /api/documents/:documentId
```

---

## File Structure

```
src/components/
├── MainSidebar.jsx           # Main navigation sidebar
├── PatientManagementSidebar.jsx  # Patient management sub-sidebar
├── PatientManagement.jsx     # Patient management wrapper
├── UpdatePatient.jsx         # Update patient form
├── DocumentManager.jsx       # Medical document management
├── MainLayout.jsx            # Main layout wrapper
├── Dashboard.jsx             # Dashboard component
└── RegisterPatient.jsx       # (Existing) Add patient form
```

---

## Features Summary

### MainSidebar

- ✅ Navigation to Dashboard
- ✅ Navigation to Patient Management
- ✅ Logout functionality
- ✅ Responsive design with gradient styling

### Patient Management

- ✅ Add New Patient (existing RegisterPatient component)
- ✅ Update Existing Patient with search functionality
- ✅ Medical Document Management
- ✅ Real-time notifications
- ✅ Form validation
- ✅ File upload with validation
- ✅ Document download capability

---

## How to Use

### Navigate to Main Application

```
/main - Opens MainLayout with Dashboard
```

### Add a Patient

1. Navigate to Main Layout (`/main`)
2. Click "Patient Management" in MainSidebar
3. Click "Add Patient" in PatientManagementSidebar
4. Fill in the patient information form
5. Click "Register Patient"

### Update a Patient

1. Navigate to Main Layout (`/main`)
2. Click "Patient Management" in MainSidebar
3. Click "Update Patient" in PatientManagementSidebar
4. Enter Patient ID in search box and click "Search"
5. Click "Edit Patient" button
6. Modify the patient information
7. Click "Update Patient"

### Manage Medical Documents

1. Search and open a patient (in Update Patient page)
2. Scroll to "Medical Documents" section
3. Click "Choose File" to upload a document
4. View all uploaded documents
5. Click "Download" to retrieve a document

---

## Styling

All components use Tailwind CSS for styling with:

- Responsive grid layouts
- Blue color scheme (primary: #2563eb)
- Smooth transitions and hover effects
- Consistent spacing and typography

---

## Error Handling

- Invalid patient IDs trigger error notifications
- File upload validation for supported formats
- Network error handling with user-friendly messages
- Form validation before submission

---

## Future Enhancements

- Pagination for patient lists
- Advanced search filters
- Document preview functionality
- Batch upload for documents
- Patient history/audit trail
- Export patient data to CSV/PDF
