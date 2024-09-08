import cookie from "cookie";
import bcrypt from "bcryptjs";
import { query } from "@/lib/db";
import jwt from "jsonwebtoken";

interface AuthenticateUserResult {
  success: boolean;
  token?: string;
  cookieHeader?: string;
  message?: string;
}

interface LogoutResult {
  success: boolean;
  message: string;
  cookieHeader?: string;
}

interface UserData {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  password: string;
}

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Authenticate a user
export async function authenticateUser(
  email: string,
  password: string
): Promise<AuthenticateUserResult> {
  try {
    const results: any = await query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    const user = results[0];

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ user_id: user.id }, JWT_SECRET, {
        expiresIn: "1h",
      });

      await query("UPDATE users set auth_token = ? WHERE email = ?", [
        token,
        user.email,
      ]);

      const cookieHeader = cookie.serialize("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3600,
        path: "/",
      });

      return {
        success: true,
        token,
        cookieHeader,
      };
    } else {
      return {
        success: false,
        message: "Invalid credentials",
      };
    }
  } catch (error) {
    console.error("Error authenticating user:", error);
    return {
      success: false,
      message: "Internal server error",
    };
  }
}

// Register a new user
export const registerUser = async (
  userData: UserData
): Promise<AuthenticateUserResult> => {
  const { username, email, firstName, lastName, age, gender, password } =
    userData;

  try {
    if (
      !username ||
      !email ||
      !firstName ||
      !lastName ||
      age === undefined ||
      !gender ||
      !password
    ) {
      return { success: false, message: "All fields are required" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await query(
      `INSERT INTO users (username, email, first_name, last_name, age, gender, password) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [username, email, firstName, lastName, age, gender, hashedPassword]
    );

    return { success: true, message: "User created" };
  } catch (error) {
    console.error("Error creating user:", error);
    return { success: false, message: "Internal server error" };
  }
};

// Logout a user
export const logoutUser = async (cookies: {
  [key: string]: string | undefined;
}): Promise<LogoutResult> => {
  try {
    const sessionId = cookies.session_id;

    if (sessionId) {
      // Remove session from database
      await query("DELETE FROM sessions WHERE session_id = ?", [sessionId]);

      // Prepare the cookie to expire
      const cookieHeader = cookie.serialize("session_id", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: -1, // Expire the cookie
        path: "/",
      });

      return { success: true, message: "Logged out", cookieHeader };
    } else {
      return { success: false, message: "No session found" };
    }
  } catch (error) {
    console.error("Logout error:", error);
    return { success: false, message: "Internal server error" };
  }
};
