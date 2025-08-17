# Giantogram Tiktok Clone

A social media application built with React and Node.js that allows users to share and interact with video content.

## Project Structure

```
├── server/           # Backend Node.js server
│   ├── server.js     # Main server file
│   └── uploads/      # Video uploads directory
└── src/             # Frontend React application
    ├── components/   # React components
    ├── contexts/     # React contexts
    └── services/     # API services
```

## Local Development

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Git

### Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/yourusername/Giantogram-Tiktok.git
cd Giantogram-Tiktok
```

2. Install frontend dependencies:
```bash
npm install
```

3. Install backend dependencies:
```bash
cd server
npm install
cd ..
```

4. Start the backend server:
```bash
cd server
npm start
```

5. Start the frontend development server (in a new terminal):
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Deployment

### Backend Deployment (Render)

1. Create a new account on [Render](https://render.com) if you haven't already

2. Create a new Web Service:
   - Click "New +" and select "Web Service"
   - Connect your GitHub repository
   - Choose the repository and branch

3. Configure the Web Service:
   - Name: Choose a name for your backend service
   - Root Directory: `server`
   - Runtime: Node
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Select the appropriate instance type (Free tier available)

4. Add Environment Variables:
   - Go to your service's "Environment" tab
   - Add the following variables:
     - `PORT`: 8000
     - Any other environment variables used in your project

5. Deploy:
   - Click "Create Web Service"
   - Render will automatically build and deploy your backend

6. Note your backend URL (e.g., https://your-app-name.onrender.com)

### Frontend Deployment (Render)

1. Create a new Static Site on Render:
   - Click "New +" and select "Static Site"
   - Connect your GitHub repository
   - Choose the repository and branch

2. Configure the Static Site:
   - Name: Choose a name for your frontend
   - Root Directory: Leave empty (project root)
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`

3. Add Environment Variables:
   - Go to your static site's "Environment" tab
   - Add the following variables:
     - `VITE_API_URL`: Your backend URL (e.g., https://your-backend.onrender.com)

4. Deploy:
   - Click "Create Static Site"
   - Render will automatically build and deploy your frontend

5. Access your deployed site:
   - Render will provide a URL for your frontend (e.g., https://your-frontend.onrender.com)

### Environment Variables

Create a `.env` file in both the root directory and the server directory:

Root `.env`:
```
VITE_API_URL=http://localhost:8000
```

Server `.env`:
```
PORT=8000
JWT_SECRET=your-secret-key
```

### Important Notes for Deployment

1. Update API URLs:
   - In `src/services/postService.js`, update the `API_URL` to use the environment variable:
   ```javascript
   const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
   ```

2. Configure CORS on the backend:
   - Update the CORS configuration in `server/server.js` to allow your frontend domain:
   ```javascript
   app.use(cors({
     origin: ['https://your-frontend-domain.vercel.app', 'http://localhost:3000']
   }));
   ```

3. Handle file uploads:
   - For production, consider using cloud storage (like AWS S3) instead of local file storage
   - Update the file upload configuration accordingly

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details
