# 🎓 Educator's Assistant

![License](https://img.shields.io/badge/license-ISC-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-5.x-darkblue?logo=prisma)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?logo=tailwind-css)

> An intelligent, AI-powered platform designed to streamline administrative tasks for educators, enhance student management, and provide intelligent learning tools.

This full-featured assistant empowers educators by automating routine tasks, offering deep analytics, and fostering a more dynamic learning environment.

---

## ✨ Key Features

* **🤖 AI-Powered Assistance**: Leverages **Google's Gemini AI** for intelligent content generation, curriculum planning, and multi-language support.
* **👤 Comprehensive Student Management**: All-in-one toolkit for managing student profiles, tracking academic progress, and monitoring attendance.
* **📊 Interactive Dashboard**: Visualize student performance and classroom trends with a dynamic and responsive dashboard built with **Recharts**.
* **🎨 Modern & Accessible UI**: A beautiful and intuitive user interface crafted with **Radix UI** for maximum accessibility and a great user experience.
* **🔐 Secure Authentication**: Robust user authentication system using **JSON Web Tokens (JWT)** and **bcrypt** password hashing.
* **☁️ Cloud Media Management**: Seamlessly upload and manage images and other media assets via the **Cloudinary** integration.
* **🌓 Light & Dark Mode**: Automatic theme switching for user preference, powered by **Next Themes**.
* **✍️ Rich Text Editing**: Full Markdown support in text fields for creating formatted content, rendered with **React Markdown**.

---

## 🛠️ Tech Stack

The project is built with a modern, scalable, and efficient technology stack.

| Category | Technology |
| :--- | :--- |
| **Framework** | **Next.js 15**, **React 19** |
| **Language** | **TypeScript** |
| **Styling** | **Tailwind CSS**, **Radix UI**, **Framer Motion** |
| **Backend & API** | **Next.js API Routes**, **Firebase** (Authentication) |
| **Database** | **MongoDB**, **Prisma** (ORM), **Mongoose** (ODM) |
| **Services** | **Google Gemini AI**, **Cloudinary** |
| **Form Handling** | **React Hook Form**, **Zod** (Validation) |
| **Utilities** | **Axios**, **date-fns**, **Lucide React**, **Sonner** (Notifications) |

---

## 🚀 Getting Started

Follow these instructions to get a local copy up and running for development and testing purposes.

### Prerequisites

* **Node.js**: Version 18.x or higher
* **Package Manager**: `npm` or `yarn`
* **Firebase Account**: For authentication services
* **MongoDB Instance**: A connection string for a local or cloud-hosted database (e.g., MongoDB Atlas)
* **Cloudinary Account**: For image and media storage

### Installation

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/aashishrrjp/educator-assistant.git](https://github.com/aashishrrjp/educator-assistant.git)
    cd educator-assistant
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    # or
    yarn install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root directory and populate it with your credentials.

    ```bash
    # .env.local

    # Firebase Configuration
    NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

    # MongoDB
    DATABASE_URL=your_mongodb_connection_string

    # Google Cloud (Gemini)
    GOOGLE_CLOUD_TRANSLATE_KEY=your_gemini_api_key

    # Cloudinary
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret

    # JWT Secret
    JWT_SECRET=your_super_secret_jwt_key
    ```

4.  **Run the development server:**
    ```sh
    npm run dev
    # or
    yarn dev
    ```

5.  **Open your browser** and navigate to `http://localhost:3000`.

---

## 📂 Project Structure

The codebase is organized following modern Next.js 15 conventions.
educator-assistant/ ├── app/ # Next.js app directory (routing, pages) ├── components/ # Reusable React components ├── lib/ # Utility functions and helpers ├── prisma/ # Database schema and migrations ├── public/ # Static assets (images, fonts) ├── .env.local # Environment variables (create this file) ├── package.json # Project dependencies └── tsconfig.json # TypeScript configuration

---

## 📈 Roadmap

We have an exciting roadmap ahead! Here are some of the features we plan to implement:

* [ ] Enhanced AI features with deeper OpenAI/Gemini integration
* [ ] Mobile application development (React Native)
* [ ] Advanced analytics and reporting dashboard
* [ ] Automated testing suite (Jest, React Testing Library)
* [ ] Comprehensive API documentation (Swagger/OpenAPI)
* [ ] Real-time collaboration features (WebSockets)

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  **Fork the Project**
2.  **Create your Feature Branch** (`git checkout -b feature/AmazingFeature`)
3.  **Commit your Changes** (`git commit -m 'Add: some AmazingFeature'`)
4.  **Push to the Branch** (`git push origin feature/AmazingFeature`)
5.  **Open a Pull Request**

Please ensure your code adheres to our linting rules (`npm run lint`) and provide a clear description of your changes.

---

## 📜 License

This project is licensed under the **ISC License**. See the `LICENSE` file for more details.

---

## 👨‍💻 Author

**Aashish Rajpurohit**

* **GitHub**: [@aashishrrjp](https://github.com/aashishrrjp)

---

## 🌟 Show Your Support

If you find this project helpful or interesting, please consider:

* ⭐ Giving it a star on GitHub
* 🍴 Forking the repository
* 📢 Sharing it with others

---

Made with ❤️ by **Aashish Rajpurohit**