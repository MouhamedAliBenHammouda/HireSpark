'use server';

import { db,auth } from "@/firebase/admin";
import { cookies } from "next/headers";


const ONE_WEEK = 60 * 60 * 24 * 7;

export async function signUp(params: SignUpParams) {
  const { uid, name, email } = params;
  console.log("signUp params:", { uid, name, email });

  try {
    if (!db) {
      console.error("Firestore is not initialized");
      return {
        success: false,
        message: "Server configuration error: Firestore not initialized",
      };
    }

    const userRef = db.collection("users").doc(uid);
    const userRecord = await userRef.get();
    if (userRecord.exists) {
      console.log("User already exists:", uid);
      return {
        success: false,
        message: "User already exists. Please sign in instead.",
      };
    }

    await userRef.set({
      name,
      email,
      createdAt: new Date().toISOString(),
    });

    console.log("User created successfully:", uid);
    return {
      success: true,
      message: "Account created successfully. Please sign in.",
    };
  } catch (error: any) {
    console.error("Error creating user:", {
      code: error.code,
      message: error.message,
      details: error.details,
      stack: error.stack,
    });
    return {
      success: false,
      message: `Failed to create account: ${error.message || "Unknown error"}`,
    };
  }
}

export async function signIn(params: SignInParams) {
    const {email,idToken} = params;

    try{
        const userRecored = await auth.getUserByEmail(email);
        if(!userRecored){
            return{
                success: false,
                message: 'User soes not exist. Create an account insted.'
            }
        }
        await setSessionCookie(idToken);
    } catch (e) {
        console.error(e);

        return {
            success: false,
            message: 'Failed to log into an account'
        }
    }
}

export async function setSessionCookie(idToken: string) {
    const  cookieStore = await cookies();

    const sessionCookie = await auth.createSessionCookie(idToken,{
        expiresIn: ONE_WEEK * 1000,
    })
    cookieStore.set('session',sessionCookie,{
        maxAge: ONE_WEEK,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: 'lax'
    })
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  
  const sessionCookie = cookieStore.get('session')?.value;

  if(!sessionCookie) return null;

  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie,true);
    const userRecord = await db.
          collection('users')
          .doc(decodedClaims.uid)
          .get();
    if(!userRecord.exists) return null;

    return {
      ...userRecord.data(),
      id: userRecord.id,
    } as User
  } catch(e) {
    console.log(e)
    return null 
  }
}

export async function isAuthenticated() {
  const user = await getCurrentUser();

  return !! user;
}