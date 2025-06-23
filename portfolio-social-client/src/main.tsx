import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "@/styles/globals.css";
import { HeroUIProvider } from "@heroui/system";
import { ThemeProvider } from "./components/theme-provider/index.tsx";
import { Auth } from "./pages/auth/index.tsx";
import { Layout } from "./components/layout/index.tsx";
import { Posts } from "./pages/posts/index.tsx";
import { CurrentPost } from "./pages/currentPost/index.tsx";
import { UserProfile } from "./pages/userProfile/index.tsx";
import { Followers } from "./pages/followers/index.tsx";
import { Following } from "./pages/following/index.tsx";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { AuthGuard } from "./features/user/authGuard.tsx";


const router = createBrowserRouter([
  {
    path: '/auth',
    element: <Auth />

  },
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '',
        element: <Posts />
      },
      {
        path: 'posts/:id',
        element: <CurrentPost />
      },
      {
        path: 'users/:id',
        element: <UserProfile />
      },
      {
        path: 'followers',
        element: <Followers />
      },
      {
        path: 'following',
        element: <Following />
      },
    ]
  },
]);


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <HeroUIProvider>
          <AuthGuard>
            <RouterProvider router={router} />
          </AuthGuard>
        </HeroUIProvider>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
);
