# AutoWorx Manager Web Application: Setup & Configuration Guide

## 1. Overview
The **Manager Web App** is a specialized administrative dashboard built with **React**. It is restricted to workshop administrators and managers for high-level oversight of operations.

## 2. Architecture & Tech Stack
* **Frontend**: React (Presentation Layer).
* **Backend**: Django REST Framework (Business Logic Layer).
* **Database**: PostgreSQL (Data Layer).
* **Deployment**: Fully containerized using **Docker** for scalability and consistency.

## 3. Administrative Modules
The web application is configured to handle the following management tasks:
* **User Oversight**: Adding new mechanics and managing staff profiles.
* **Inventory Management**: Using `/api/parts/` to track the parts inventory and log parts used during repairs.
* **Financials**: Generating invoices via `/api/invoices/` and tracking labor/part cost breakdowns.
* **Service Reporting**: Accessing comprehensive service and task reports for quality control.

## 4. Setup & Deployment
1. **Containerization**: Use Docker to spin up the frontend, backend, and PostgreSQL database simultaneously.
2. **Access Control**: Configure the web app to block all non-manager roles. This is a hard-coded security requirement; mechanics and customers are restricted from accessing this platform.
3. **Database Initialization**: Ensure the `PredefinedCar`, `ServiceType`, and `PredefinedTask` tables are populated to allow for smooth data entry.
4. **Maintenance**: Utilize the modular nature of the API to extend features (such as Skills Sharing or Car Health analytics) as the workshop grows.
