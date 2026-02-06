# Secure Digital Attendance System

A comprehensive full-stack web application designed to digitize and secure the attendance process for educational institutions. This system utilizes geofencing technology, time-bound OTPs, and role-based access control to ensure accurate and proxy-proof attendance tracking.

## Project Overview

- **Role-Based Access:** Distinct portals for Admins, Faculty, and Students.
- **Geofencing Security:** Students can only mark attendance when physically present near the Faculty's location.
- **Real-Time OTP:** Dynamic OTP generation with strict time expiration.
- **Reporting:** Automated calculation of attendance percentages and downloadable Excel reports.
- **Secure Authentication:** JWT-based login and Email OTP for password recovery.

## Technology Stack

- **Backend:** Java 21, Spring Boot 3.4.0, Spring Security, JWT, JavaMailSender
- **Frontend:** React.js, Vite, Bootstrap 5
- **Database:** MySQL 8.0
- **Build Tools:** Maven (Backend), NPM (Frontend)

---

## Setup and Installation Guide

Follow these steps to set up the project locally.

### 1. Prerequisites

Ensure you have the following installed on your machine:

- Java Development Kit (JDK 21 or later)
- Node.js and npm
- MySQL Server
- Maven

### 2. Clone the Repository

```bash
git clone [https://github.com/Prathmesh597/CDAC_Project-Secure-Digital-Attendance-System.git](https://github.com/Prathmesh597/CDAC_Project-Secure-Digital-Attendance-System.git)
cd CDAC_Project-Secure-Digital-Attendance-System
```
