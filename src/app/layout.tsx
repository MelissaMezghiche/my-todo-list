import '/styles/globals.css';
import Sidebar from '../../components/Sidebar';
import ThemeToggle from "../../components/themeToggle";

export const metadata = {
  title: 'My To-Do App',
  description: 'A Next.js To-Do List with Dashboard, Calendar, and Statistics',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="container">
          <Sidebar />
            
          <div className="content">
            <div className="Logo-notif">
                <img src="/images/logo.svg" alt="logo" />
                <ThemeToggle />
            </div>
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
