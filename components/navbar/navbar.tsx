"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/providers/auth-providers";

type Props = {};

function Navbar({}: Props) {
  const auth = useAuth();
  const pathname = usePathname();

  const isAdminPage = pathname.includes("/admin");
  const isProPage = pathname.includes("/pro");
  const isUserPage = pathname.includes("/user");

  const loginGoogle = () =>
    auth
      ?.loginGoogle()
      .then((res) => console.log("Logged in"))
      .catch((err) => console.log("Error logging in"));

  const logoutUser = () =>
    auth
      ?.logout()
      .then((res) => console.log("Logged out"))
      .catch((err) => console.log("Error logging out"));

  return (
    <div className="fixed top-12 left-0 w-full flex items-center justify-center">
      <div className="flex items-center bg-slate-200/10 gap-2 py-1 px-2 rounded-lg border border-slate-300/10 shadow mb-12">
        {!auth?.currentUser ? (
          <button
            onClick={loginGoogle}
            className="text-white text-sm font-semibold p-2 bg-orange-700 hover:bg-orange-400 rounded-md transition"
          >
            Login with Google
          </button>
        ) : (
          <button
            onClick={logoutUser}
            className="text-white text-sm font-semibold p-2 bg-orange-700 hover:bg-orange-400 rounded-md transition"
          >
            Logout user
          </button>
        )}

        {auth?.currentUser && (
          <div className="mr-12">
            <p className="text-white text-sm font-semibold">
              {auth.currentUser.displayName}
            </p>
            <p className="text-white text-sm font-semibold">
              {auth.currentUser.email}
            </p>
          </div>
        )}

        {(isUserPage || isAdminPage || isProPage) && (
          <Link
            href={"/"}
            className="text-white text-sm font-semibold p-2 hover:bg-slate-900 rounded-md transition"
          >
            Go to Home page
          </Link>
        )}
        {!isUserPage && (
          <Link
            href={"user"}
            className="text-white text-sm font-semibold p-2 hover:bg-slate-900 rounded-md transition"
          >
            Go to User page
          </Link>
        )}

        {!isProPage && (
          <Link
            href={"pro"}
            className="text-white text-sm font-semibold p-2 hover:bg-slate-900 rounded-md transition"
          >
            Go to Pro page
          </Link>
        )}

        {!isAdminPage && (
          <Link
            href={"admin"}
            className="text-white text-sm font-semibold p-2 hover:bg-slate-900 rounded-md transition"
          >
            Go to Admin page
          </Link>
        )}
      </div>
    </div>
  );
}

export default Navbar;
